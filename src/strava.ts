// Official Strava API only. Tokens rotate and are persisted before any activity is sent. No token, response
// body, callback address or workout data is included in an error: the service prints error messages to its log.
// The one exception is the processing error of an upload: Strava's short, human-readable reason why it refused
// our file, cleaned and bounded, so that a refusal can be diagnosed from the log.

import type { Config } from './config.ts';
import type { Store, StravaSession } from './store.ts';
import type { StravaActivity } from './strava-mapping.ts';
import { isStravaExternalId, stravaExternalId, uploadAttempt } from './strava-mapping.ts';
import { line } from './text.ts';

const API = 'https://www.strava.com/api/v3';
export const STRAVA_SCOPES = ['activity:read_all', 'activity:write'];

export class StravaError extends Error {}
export class StravaAuthError extends StravaError {}
/** A refusal of one activity, rather than a connection/authentication/rate-limit failure. */
export class StravaActivityError extends StravaError {}
/** The activity to update is no longer on Strava: the athlete deleted it there. */
export class StravaActivityGoneError extends StravaActivityError {}
/** Strava's rate limit is used up: nothing is sent to Strava until `until` (ms since the epoch). */
export class StravaRateLimitError extends StravaError {
  readonly until: number;
  /** False when the limit was hit before and this pass did not contact Strava at all. */
  readonly first: boolean;

  constructor(until: number, daily: boolean, first: boolean) {
    super(`Strava's ${daily ? 'daily' : '15-minute'} rate limit is used up; Strava is contacted again after ${new Date(until).toISOString()}.`);
    this.until = until;
    this.first = first;
  }
}

export interface StravaUpload {
  id: string;
  activityId: string | null;
  failed: boolean;
  duplicate: boolean;
  /** Strava's reason for a failed upload, as plain text; null while it processes or after success. */
  error: string | null;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", nbsp: ' ' };

/** Strava's upload errors "may include escaped HTML": keep the words only. */
export function uploadError(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const text = value.replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|apos|#39|nbsp);/g, (_, name: string) => ENTITIES[name] ?? '').replace(/<[^>]*>/g, ' ');

  return line(text, 300) ?? null;
}

const object = (value: unknown): Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};

/** Prefer Strava's string ids: its examples include ids larger than JavaScript's safe integer range. */
function idOf(value: unknown): string | null {
  const record = object(value);
  if (typeof record.id_str === 'string' && /^[1-9]\d*$/.test(record.id_str)) {
    return record.id_str;
  }

  return typeof record.id === 'number' && Number.isSafeInteger(record.id) && record.id > 0 ? String(record.id) : null;
}

const pair = (value: string | null): [number, number] | null => {
  const numbers = (value ?? '').split(',').map((part) => Number(part.trim()));

  return numbers.length === 2 && numbers.every((number) => Number.isFinite(number)) ? [numbers[0]!, numbers[1]!] : null;
};

/**
 * When to contact Strava again after a 429. Its limits reset at every quarter hour (0, 15, 30, 45 min) and daily
 * at midnight UTC; the overall and the read limit each give "15-minute,daily" in their headers.
 */
export function rateLimitReset(headers: Headers, now: number): { until: number; daily: boolean } {
  const daily = [['X-RateLimit-Limit', 'X-RateLimit-Usage'], ['X-ReadRateLimit-Limit', 'X-ReadRateLimit-Usage']].some(([limit, usage]) => {
    const limits = pair(headers.get(limit!));
    const used = pair(headers.get(usage!));

    return limits !== null && used !== null && used[1] >= limits[1];
  });
  const date = new Date(now);
  const until = daily
    ? Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
    : Math.floor(now / 900_000) * 900_000 + 900_000;

  // A few seconds of margin for clocks that differ.
  return { until: until + 5_000, daily };
}

async function json(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new StravaError('Strava sent an answer that cannot be read.');
  }
}

export class Strava {
  private readonly config: Config;
  private readonly store: Store;
  private paused: { until: number; daily: boolean } | null = null;

  constructor(config: Config, store: Store) {
    this.config = config;
    this.store = store;
  }

  private client(): { client_id: string; client_secret: string } {
    if (this.config.stravaClientId === null || this.config.stravaClientSecret === null) {
      throw new StravaAuthError('Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET, then run `enduo-smartworkout setup --strava`.');
    }

    return { client_id: this.config.stravaClientId, client_secret: this.config.stravaClientSecret };
  }

  private session(): StravaSession | null {
    const stored = this.store.strava();

    return stored?.clientId === this.config.stravaClientId ? stored : null;
  }

  private async fetch(url: string, init: RequestInit = {}): Promise<Response> {
    try {
      return await fetch(url, {
        ...init,
        headers: { Accept: 'application/json', 'User-Agent': this.config.userAgent, ...init.headers },
        redirect: 'error',
        signal: AbortSignal.timeout(60_000),
      });
    } catch {
      throw new StravaError('Strava is not reachable; the request will be retried.');
    }
  }

  private async token(grant: Record<string, string>): Promise<StravaSession> {
    const client = this.client();
    const previous = this.session();
    const response = await this.fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      body: new URLSearchParams({ ...client, ...grant }),
    });
    if ([400, 401, 403].includes(response.status)) {
      throw new StravaAuthError(`Strava refused the sign-in (${response.status}): run \`enduo-smartworkout setup --strava\`.`);
    }
    if (!response.ok) {
      throw new StravaError(`Strava token exchange answered ${response.status}.`);
    }
    const answer = object(await json(response));
    if (typeof answer.access_token !== 'string' || answer.access_token === '' || typeof answer.refresh_token !== 'string' || answer.refresh_token === '' ||
      typeof answer.expires_at !== 'number' || !Number.isFinite(answer.expires_at) || answer.expires_at * 1000 <= Date.now()) {
      throw new StravaError('Strava token exchange answered without a usable session.');
    }
    const session: StravaSession = {
      clientId: client.client_id,
      accessToken: answer.access_token,
      refreshToken: answer.refresh_token,
      expiresAt: answer.expires_at * 1000,
      // The athlete stays verified only when the session refreshes itself. A new authorization or a bootstrap
      // token may belong to another athlete: account() verifies it with /athlete.
      athleteId: previous !== null && grant.grant_type === 'refresh_token' && grant.refresh_token === previous.refreshToken ? previous.athleteId : null,
    };
    this.store.saveStrava(session);

    return session;
  }

  /** Use the latest token on the volume, even if ENV still contains the bootstrap refresh token. */
  async accessToken(): Promise<string> {
    this.client();
    const session = this.session();
    if (session !== null && session.expiresAt > Date.now() + 60_000) {
      return session.accessToken;
    }
    const refresh = session?.refreshToken ?? this.config.stravaRefreshToken;
    if (refresh === null) {
      throw new StravaAuthError('Not signed in to Strava: run `enduo-smartworkout setup --strava`, or set STRAVA_REFRESH_TOKEN.');
    }

    return (await this.token({ grant_type: 'refresh_token', refresh_token: refresh })).accessToken;
  }

  authorizationUrl(state: string): string {
    const client = this.client();
    const url = new URL('https://www.strava.com/oauth/authorize');
    url.search = new URLSearchParams({
      client_id: client.client_id,
      redirect_uri: this.config.stravaRedirectUri,
      response_type: 'code',
      approval_prompt: 'force',
      scope: STRAVA_SCOPES.join(','),
      state,
    }).toString();

    return url.href;
  }

  /** Copying the final browser address back to setup needs no listening port in the container. */
  async authorize(callback: string, state: string): Promise<void> {
    let url: URL;
    try {
      url = new URL(callback);
    } catch {
      throw new StravaAuthError('Paste the complete Strava redirect address.');
    }
    const expected = new URL(this.config.stravaRedirectUri);
    if (url.origin !== expected.origin || url.pathname !== expected.pathname || url.searchParams.get('state') !== state) {
      throw new StravaAuthError('The Strava redirect does not match this sign-in. Run setup again.');
    }
    const scopes = (url.searchParams.get('scope') ?? '').split(/[ ,]+/);
    const code = url.searchParams.get('code');
    if (url.searchParams.has('error') || code === null || code === '' || !STRAVA_SCOPES.every((scope) => scopes.includes(scope))) {
      throw new StravaAuthError('Approve both activity:read_all and activity:write in Strava, then run setup again.');
    }
    await this.token({ grant_type: 'authorization_code', code });
    await this.account(true);
  }

  /** Explicit setup may replace the stored athlete with a new ENV refresh token. */
  async connect(): Promise<string> {
    if (this.config.stravaRefreshToken !== null) {
      await this.token({ grant_type: 'refresh_token', refresh_token: this.config.stravaRefreshToken });
    }

    return this.account(true);
  }

  private async request(method: string, path: string, fields?: Record<string, string | number> | FormData): Promise<Response> {
    // Every request counts against the limits of the Strava application, those that are refused as well.
    if (this.paused !== null && Date.now() < this.paused.until) {
      throw new StravaRateLimitError(this.paused.until, this.paused.daily, false);
    }
    this.paused = null;
    const send = async (token: string): Promise<Response> => this.fetch(`${API}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: fields === undefined ? undefined : fields instanceof FormData ? fields : new URLSearchParams(Object.entries(fields).map(([key, value]): [string, string] => [key, String(value)])),
    });
    let response = await send(await this.accessToken());
    if (response.status === 401) {
      const refresh = this.session()?.refreshToken;
      if (refresh === undefined) {
        throw new StravaAuthError('Strava refused the token: run `enduo-smartworkout setup --strava`.');
      }
      response = await send((await this.token({ grant_type: 'refresh_token', refresh_token: refresh })).accessToken);
    }
    if (response.status === 429) {
      this.paused = rateLimitReset(response.headers, Date.now());
      throw new StravaRateLimitError(this.paused.until, this.paused.daily, true);
    }
    if (response.status === 401 || response.status === 403) {
      throw new StravaAuthError(`Strava refused access (${response.status}): approve activity:read_all and activity:write with \`enduo-smartworkout setup --strava\`.`);
    }
    if (!response.ok) {
      if (method === 'PUT' && response.status === 404) {
        throw new StravaActivityGoneError('The activity is no longer on Strava.');
      }
      if (method !== 'GET' && [400, 404, 422].includes(response.status)) {
        throw new StravaActivityError(`Strava refused this activity (${response.status}).`);
      }
      throw new StravaError(`Strava API answered ${response.status}.`);
    }

    return response;
  }

  /**
   * The athlete of the stored session. It is asked from Strava only once per sign-in, or with `verify` (setup,
   * status), never on every pass: a request a minute would use up Strava's daily read limit by itself.
   */
  async account(verify = false): Promise<string> {
    const stored = this.session()?.athleteId ?? null;
    if (stored !== null && !verify) {
      // A token that expires is refreshed here, as a request to Strava would.
      await this.accessToken();

      return this.session()?.athleteId ?? this.account(true);
    }
    const id = idOf(await json(await this.request('GET', '/athlete')));
    if (id === null) {
      throw new StravaError('Strava did not say which athlete the token belongs to.');
    }
    const session = this.session();
    if (session !== null) {
      this.store.saveStrava({ ...session, athleteId: id });
    }

    return id;
  }

  /** Reconcile a lost upload response using the stable part of its external id, including private activities. */
  async findActivity(marker: string, startedAt: number): Promise<string | null> {
    const start = Math.floor(startedAt / 1000);
    for (let page = 1; ; page++) {
      const query = new URLSearchParams({ after: String(start - 86_400), before: String(start + 86_400), page: String(page), per_page: '100' });
      const activities = await json(await this.request('GET', `/athlete/activities?${query}`));
      if (!Array.isArray(activities)) {
        throw new StravaError('Strava sent an activity list that cannot be read.');
      }
      for (const value of activities) {
        const activity = object(value);
        if (isStravaExternalId(activity.external_id, marker)) {
          const id = idOf(activity);
          if (id === null) {
            throw new StravaError('Strava sent an activity without a usable id.');
          }
          return id;
        }
      }
      if (activities.length < 100) {
        return null;
      }
    }
  }

  private uploadAnswer(value: unknown): StravaUpload {
    const answer = object(value);
    const id = idOf(answer);
    if (id === null) {
      throw new StravaError('Strava sent an upload without a usable id; the next pass will look for its activity.');
    }
    const error = typeof answer.error === 'string' ? answer.error : '';
    const failed = error.trim() !== '';

    return {
      id,
      activityId: idOf({ id: answer.activity_id, id_str: answer.activity_id_str }),
      failed,
      duplicate: /duplicate/i.test(error),
      error: failed ? uploadError(error) ?? 'no reason given' : null,
    };
  }

  async createUpload(activity: StravaActivity, marker: string): Promise<StravaUpload> {
    const externalId = stravaExternalId(marker, uploadAttempt());
    const form = new FormData();
    form.set('file', new Blob([JSON.stringify(activity.file)], { type: 'application/json' }), externalId);
    form.set('data_type', 'json');
    form.set('sport_type', activity.sport_type);
    form.set('external_id', externalId);
    form.set('name', activity.name);

    return this.uploadAnswer(await json(await this.request('POST', '/uploads', form)));
  }

  async getUpload(id: string): Promise<StravaUpload> {
    return this.uploadAnswer(await json(await this.request('GET', `/uploads/${encodeURIComponent(id)}`)));
  }

  async updateActivity(id: string, activity: StravaActivity): Promise<void> {
    // The update endpoint cannot replace native sets, start or elapsed time; never delete/recreate an athlete's
    // activity to change them. The description is the athlete's: it is never sent.
    await this.request('PUT', `/activities/${encodeURIComponent(id)}`, { name: activity.name, sport_type: activity.sport_type });
  }
}
