// Official Strava API only. Tokens rotate and are persisted before any activity is sent. No token, response
// body, callback address or workout data is included in an error: the service prints error messages to its log.

import type { Config } from './config.ts';
import type { Store, StravaSession } from './store.ts';
import type { StravaActivity } from './strava-mapping.ts';
import { stravaExternalId } from './strava-mapping.ts';

const API = 'https://www.strava.com/api/v3';
export const STRAVA_SCOPES = ['activity:read_all', 'activity:write'];

export class StravaError extends Error {}
export class StravaAuthError extends StravaError {}
/** A refusal of one activity, rather than a connection/authentication/rate-limit failure. */
export class StravaActivityError extends StravaError {}

export interface StravaUpload {
  id: string;
  activityId: string | null;
  failed: boolean;
  duplicate: boolean;
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
  private accountId: string | null = null;

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
      // A refresh may also be used to connect a different athlete: verify with /athlete below.
      athleteId: idOf(answer.athlete),
    };
    this.store.saveStrava(session);
    this.accountId = null;

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
    await this.account();
  }

  /** Explicit setup may replace the stored athlete with a new ENV refresh token. */
  async connect(): Promise<string> {
    if (this.config.stravaRefreshToken !== null) {
      await this.token({ grant_type: 'refresh_token', refresh_token: this.config.stravaRefreshToken });
    }

    return this.account();
  }

  private async request(method: string, path: string, fields?: Record<string, string | number> | FormData): Promise<Response> {
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
    if (response.status === 401 || response.status === 403) {
      throw new StravaAuthError(`Strava refused access (${response.status}): approve activity:read_all and activity:write with \`enduo-smartworkout setup --strava\`.`);
    }
    if (!response.ok) {
      if (method !== 'GET' && [400, 404, 422].includes(response.status)) {
        throw new StravaActivityError(`Strava refused this activity (${response.status}).`);
      }
      throw new StravaError(`Strava API answered ${response.status}.`);
    }

    return response;
  }

  async account(): Promise<string> {
    if (this.accountId !== null) {
      return this.accountId;
    }
    const id = idOf(await json(await this.request('GET', '/athlete')));
    if (id === null) {
      throw new StravaError('Strava did not say which athlete the token belongs to.');
    }
    const session = this.session();
    if (session !== null) {
      this.store.saveStrava({ ...session, athleteId: id });
    }
    this.accountId = id;

    return id;
  }

  /** Reconcile a lost upload response using its stable external id, including private activities. */
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
        if (activity.external_id === stravaExternalId(marker)) {
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

    return { id, activityId: idOf({ id: answer.activity_id, id_str: answer.activity_id_str }), failed: error.trim() !== '', duplicate: /duplicate/i.test(error) };
  }

  async createUpload(activity: StravaActivity, marker: string): Promise<StravaUpload> {
    const form = new FormData();
    form.set('file', new Blob([JSON.stringify(activity.file)], { type: 'application/json' }), stravaExternalId(marker));
    form.set('data_type', 'json');
    form.set('sport_type', activity.sport_type);
    form.set('external_id', stravaExternalId(marker));
    form.set('name', activity.name);
    form.set('description', activity.description);

    return this.uploadAnswer(await json(await this.request('POST', '/uploads', form)));
  }

  async getUpload(id: string): Promise<StravaUpload> {
    return this.uploadAnswer(await json(await this.request('GET', `/uploads/${encodeURIComponent(id)}`)));
  }

  async updateActivity(id: string, activity: StravaActivity): Promise<void> {
    // The update endpoint cannot replace native sets, start or elapsed time. Their latest source values remain
    // in the description; never delete/recreate an athlete's activity to change them.
    await this.request('PUT', `/activities/${encodeURIComponent(id)}`, { name: activity.name, description: activity.description, sport_type: activity.sport_type });
  }
}
