// Client of the private SmartWorkout API (api.smartworkout.app), as far as docs/smartworkout-api.md describes it.
// It is not a public API: anything here may change with an app update.
//
// Never log the address of /Account/* calls: SmartWorkout carries tokens in the query string.

import type { Config } from './config.ts';
import { sha256, tokenSubject } from './identity.ts';
import type { ExerciseCache, SmartWorkoutSession, Store } from './store.ts';
import type { SwWorkout } from './mapping.ts';

/** Refresh the access token (valid 14 days) when it has less than this left. */
const REFRESH_BEFORE_MS = 7 * 86_400_000;
/** The exercise catalogue is checked again (with its ETag) at most this often, unless an id is missing. */
const CATALOGUE_TTL_MS = 6 * 3_600_000;

export class SmartWorkoutAuthError extends Error {}
export class SmartWorkoutError extends Error {}

export interface SwChange {
  sequence: number;
  workoutId: string;
  operation: string;
  serverRevision: number;
  changedAtMs: number;
  workout?: SwWorkout | null;
}

export interface SwSyncPage {
  /** As SmartWorkout sent them: the sync checks each one before it reads it. */
  changes: unknown[];
  nextCursor: number;
  serverEpoch: string | null;
  hasMore: boolean;
  requiresFullSnapshot: boolean;
}

interface TokenAnswer {
  token?: string;
  expires?: number;
  refreshToken?: string;
}

export class SmartWorkout {
  private readonly config: Config;
  private readonly store: Store;

  constructor(config: Config, store: Store) {
    this.config = config;
    this.store = store;
  }

  private headers(token?: string): Record<string, string> {
    return {
      Accept: 'application/json',
      'Accept-Language': this.config.exerciseLanguages.join(', '),
      'User-Agent': this.config.smartworkoutUserAgent,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private session(): SmartWorkoutSession {
    const session = this.store.smartworkout();
    if (session === null) {
      throw new SmartWorkoutAuthError('Not signed in to SmartWorkout: run `enduo-smartworkout setup`.');
    }

    return session;
  }

  /**
   * Exchanges the refresh token for a new access token and stores it. SmartWorkout wants the current access
   * token as well; the refresh token itself does not change.
   */
  async refresh(session: SmartWorkoutSession = this.session()): Promise<SmartWorkoutSession> {
    const url = `${this.config.smartworkoutUrl}/Account/token/refresh?refreshToken=${encodeURIComponent(session.refreshToken)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers(session.accessToken),
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new SmartWorkoutAuthError(
        `SmartWorkout refused the session (${response.status}). It ends when you sign out in the app; ` +
          'give the container a new one with `enduo-smartworkout setup --smartworkout`.',
      );
    }
    if (!response.ok) {
      throw new SmartWorkoutError(`SmartWorkout token refresh answered ${response.status}`);
    }

    const answer = (await response.json()) as TokenAnswer;
    if (typeof answer.token !== 'string' || typeof answer.expires !== 'number') {
      throw new SmartWorkoutError('SmartWorkout token refresh answered without a token');
    }

    const refreshed: SmartWorkoutSession = {
      accessToken: answer.token,
      refreshToken: typeof answer.refreshToken === 'string' && answer.refreshToken !== '' ? answer.refreshToken : session.refreshToken,
      expiresAt: answer.expires,
      savedAt: new Date().toISOString(),
    };
    this.store.saveSmartworkout(refreshed);

    return refreshed;
  }

  /** A valid access token, refreshed when it gets close to its end. */
  async accessToken(now = Date.now()): Promise<string> {
    const session = this.session();
    if (session.expiresAt - now < REFRESH_BEFORE_MS) {
      return (await this.refresh(session)).accessToken;
    }

    return session.accessToken;
  }

  private async request(method: string, path: string, body?: unknown, extra: Record<string, string> = {}): Promise<Response> {
    const send = async (token: string): Promise<Response> =>
      fetch(`${this.config.smartworkoutUrl}${path}`, {
        method,
        headers: { ...this.headers(token), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...extra },
        body: body === undefined ? undefined : JSON.stringify(body),
        redirect: 'error',
        signal: AbortSignal.timeout(60_000),
      });

    let response = await send(await this.accessToken());
    if (response.status === 401) {
      // The token may have been ended early; one refresh, then give up.
      response = await send((await this.refresh()).accessToken);
      if (response.status === 401) {
        throw new SmartWorkoutAuthError('SmartWorkout refused the session (401): run `enduo-smartworkout setup --smartworkout`.');
      }
    }

    return response;
  }

  /** Who the session belongs to (for setup and status). */
  async user(): Promise<{ id?: unknown; userName?: string; workoutCount?: number }> {
    const response = await this.request('GET', '/User');
    if (!response.ok) {
      throw new SmartWorkoutError(`SmartWorkout /User answered ${response.status}`);
    }

    return (await response.json()) as { id?: unknown; userName?: string; workoutCount?: number };
  }

  /**
   * The account of the session, to tie the sync state to it: the user id the access token names, else the id
   * /User gives, else a hash of the user name.
   */
  async account(): Promise<string> {
    const subject = tokenSubject(await this.accessToken());
    if (subject !== null) {
      return subject;
    }

    const user = await this.user();
    if ((typeof user.id === 'string' && user.id.trim() !== '') || typeof user.id === 'number') {
      return String(user.id).trim();
    }
    if (typeof user.userName === 'string' && user.userName.trim() !== '') {
      return `sha256:${sha256(user.userName.trim().toLowerCase())}`;
    }
    throw new SmartWorkoutError('SmartWorkout does not say whose session this is, so the sync state cannot be tied to its account.');
  }

  /** One page of changes of the workout history after `cursor`. Sends no mutations: it only reads. */
  async workoutChanges(clientInstanceId: string, cursor: number, serverEpoch: string | null): Promise<SwSyncPage> {
    const response = await this.request('POST', '/v1/workout-history/sync', {
      clientInstanceId,
      cursor,
      changeWindowCursor: null,
      serverEpoch,
      mutations: [],
    });
    if (!response.ok) {
      throw new SmartWorkoutError(`SmartWorkout workout-history sync answered ${response.status}`);
    }

    const answer: unknown = await response.json();
    const page: Partial<SwSyncPage> = typeof answer === 'object' && answer !== null ? answer : {};

    return {
      changes: Array.isArray(page.changes) ? page.changes : [],
      nextCursor: typeof page.nextCursor === 'number' && Number.isFinite(page.nextCursor) ? page.nextCursor : cursor,
      serverEpoch: page.serverEpoch ?? serverEpoch,
      hasMore: page.hasMore === true,
      requiresFullSnapshot: page.requiresFullSnapshot === true,
    };
  }

  /**
   * The exercise catalogue (names in every language it has, and load types, by id), cached on the volume and revalidated with its ETag.
   * `force` checks with the server even when the cache is fresh: an exercise the athlete just added is missing.
   */
  async exercises(force = false): Promise<ExerciseCache> {
    const stored = this.store.read<ExerciseCache>('exercises.json');
    // A cache of an older version holds no translations: fetch the catalogue whole again.
    const cached = stored !== null && typeof stored.translations === 'object' ? stored : null;
    if (cached !== null && !force && Date.now() - cached.fetchedAt < CATALOGUE_TTL_MS) {
      return cached;
    }

    const response = await this.request('GET', '/Exercise', undefined, cached?.etag ? { 'If-None-Match': cached.etag } : {});
    if (response.status === 304 && cached !== null) {
      const fresh = { ...cached, fetchedAt: Date.now() };
      this.store.write('exercises.json', fresh);

      return fresh;
    }
    if (!response.ok) {
      if (cached !== null) {
        return cached;
      }
      throw new SmartWorkoutError(`SmartWorkout /Exercise answered ${response.status}`);
    }

    const list = (await response.json()) as Array<{ id?: string; translations?: Record<string, string>; weightType?: string }>;
    const cache: ExerciseCache = { etag: response.headers.get('etag'), fetchedAt: Date.now(), translations: {}, weightTypes: {} };
    for (const exercise of list) {
      if (typeof exercise.id !== 'string') {
        continue;
      }
      const translations = Object.fromEntries(
        Object.entries(exercise.translations ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim() !== ''),
      );
      if (Object.keys(translations).length > 0) {
        cache.translations[exercise.id] = translations;
      }
      if (exercise.weightType) {
        cache.weightTypes[exercise.id] = exercise.weightType;
      }
    }
    this.store.write('exercises.json', cache);

    return cache;
  }
}
