// Files on the state volume: sign-ins, sync states and the cached exercise catalogue. Every file is
// readable by its owner only and replaced in one step, so a crash never leaves half a file.

import { chmodSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Config } from './config.ts';
import { difference, readIdentity } from './identity.ts';
import type { SyncIdentity } from './identity.ts';

export interface SmartWorkoutSession {
  accessToken: string;
  refreshToken: string;
  /** ms since the epoch */
  expiresAt: number;
  savedAt: string;
}

export interface EnduoCredentials {
  accessToken: string;
  tokenId?: string;
  scope?: string;
  enduoUrl: string;
  signedInAt: string;
}

export interface StravaSession {
  clientId: string;
  accessToken: string;
  refreshToken: string;
  /** ms since the epoch */
  expiresAt: number;
  athleteId: string | null;
}

/** A workout that was given up on: it could not be read, or Enduo refused it. */
export interface SkippedWorkout {
  /** serverRevision that was skipped; a newer one is tried again. */
  revision: number;
  reason: 'unreadable' | 'refused';
  at: string;
}

export interface SyncState {
  /**
   * The accounts this state was built from. A state of other accounts is never applied (syncFor); null only in
   * a file of a version that did not record it.
   */
  identity: SyncIdentity | null;
  /** Our id towards SmartWorkout's sync, made once. */
  clientInstanceId: string;
  /** Last change of the workout history we handled; null before the first run. */
  cursor: number | null;
  serverEpoch: string | null;
  /** Workouts that started before this (ms) are never sent: the limit of the first run. */
  backfillFromMs: number | null;
  /** serverRevision last sent to Enduo (or given up on), by SmartWorkout workout id. */
  sent: Record<string, number>;
  /** Workouts given up on, by SmartWorkout workout id; an entry goes when a later revision is sent. */
  skipped: Record<string, SkippedWorkout>;
  lastSyncAt: string | null;
}

export interface SyncForOptions {
  log: (line: string) => void;
  /** Change nothing on the volume: a state of other accounts stays where it is. */
  dryRun?: boolean;
}

const record = <T>(value: unknown): Record<string, T> => (typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, T>) : {});

export interface ExerciseCache {
  etag: string | null;
  fetchedAt: number;
  /** names by SmartWorkout exercise id, by language ("en", "pl", …) */
  translations: Record<string, Record<string, string>>;
  /** weightType by SmartWorkout exercise id (BARBELL, ASSISTED_WEIGHT, …) */
  weightTypes: Record<string, string>;
}

export class Store {
  readonly dir: string;

  constructor(config: Config) {
    this.dir = config.stateDir;
  }

  ensure(): void {
    mkdirSync(this.dir, { recursive: true, mode: 0o700 });
  }

  read<T>(name: string): T | null {
    try {
      return JSON.parse(readFileSync(join(this.dir, name), 'utf8')) as T;
    } catch {
      return null;
    }
  }

  write(name: string, value: unknown): void {
    this.ensure();
    const file = join(this.dir, name);
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify(value, null, 2), { mode: 0o600 });
    chmodSync(tmp, 0o600);
    renameSync(tmp, file);
  }

  remove(name: string): void {
    rmSync(join(this.dir, name), { force: true });
  }

  smartworkout(): SmartWorkoutSession | null {
    const session = this.read<SmartWorkoutSession>('smartworkout.json');

    return session && typeof session.accessToken === 'string' && typeof session.refreshToken === 'string' ? session : null;
  }

  saveSmartworkout(session: SmartWorkoutSession): void {
    this.write('smartworkout.json', session);
  }

  enduo(): EnduoCredentials | null {
    const credentials = this.read<EnduoCredentials>('enduo.json');

    return credentials && typeof credentials.accessToken === 'string' ? credentials : null;
  }

  saveEnduo(credentials: EnduoCredentials): void {
    this.write('enduo.json', credentials);
  }

  strava(): StravaSession | null {
    const session = this.read<StravaSession>('strava.json');

    return session && typeof session.clientId === 'string' && typeof session.accessToken === 'string' && session.accessToken !== '' &&
      typeof session.refreshToken === 'string' && session.refreshToken !== '' && Number.isFinite(session.expiresAt) &&
      (session.athleteId === null || typeof session.athleteId === 'string') ? session : null;
  }

  saveStrava(session: StravaSession): void {
    this.write('strava.json', session);
  }

  private state(stored: Partial<SyncState> | null, identity: SyncIdentity | null): SyncState {
    return {
      identity,
      clientInstanceId: typeof stored?.clientInstanceId === 'string' ? stored.clientInstanceId : crypto.randomUUID(),
      cursor: typeof stored?.cursor === 'number' ? stored.cursor : null,
      serverEpoch: stored?.serverEpoch ?? null,
      backfillFromMs: typeof stored?.backfillFromMs === 'number' ? stored.backfillFromMs : null,
      sent: record<number>(stored?.sent),
      skipped: record<SkippedWorkout>(stored?.skipped),
      lastSyncAt: typeof stored?.lastSyncAt === 'string' ? stored.lastSyncAt : null,
    };
  }

  private stored(): Partial<SyncState> | null {
    const stored = this.read<Partial<SyncState>>('sync.json');

    return typeof stored === 'object' && stored !== null && !Array.isArray(stored) ? stored : null;
  }

  /** The state as it is on the volume, whoever it belongs to: for `status` only. A pass takes syncFor(). */
  sync(): SyncState {
    const stored = this.stored();

    return this.state(stored, readIdentity(stored?.identity));
  }

  /** A state that knows nothing yet, for the accounts given (none: a dry run without an Enduo sign-in). */
  emptySync(identity: SyncIdentity | null): SyncState {
    return this.state(null, identity);
  }

  /**
   * The state of a pass for the accounts signed in now. A state built from another Enduo server, Enduo account
   * or SmartWorkout account is not applied: the pass starts from an empty one and the old file is kept aside.
   *
   * A file of a version that recorded no accounts is taken for the current ones: all a wrong guess can do here
   * is leave a workout unsent (the cursor and the revisions of another account), and nothing in Enduo is ever
   * changed or removed on the strength of this state.
   */
  syncFor(identity: SyncIdentity, options: SyncForOptions): SyncState {
    const stored = this.stored();
    if (stored === null) {
      return this.emptySync(identity);
    }
    if (stored.identity === undefined || stored.identity === null) {
      options.log('The sync state names no accounts (an older version wrote it): taking it for the accounts signed in now.');
      const adopted = this.state(stored, identity);
      if (options.dryRun !== true) {
        this.saveSync(adopted);
      }

      return adopted;
    }

    const owner = readIdentity(stored.identity);
    const other = owner === null ? 'account (its owner cannot be read)' : difference(owner, identity);
    if (other === null) {
      return this.state(stored, identity);
    }
    if (options.dryRun === true) {
      options.log(`The sync state belongs to another ${other}: a pass would start from an empty state and keep the old file aside.`);
    } else {
      options.log(`The sync state belongs to another ${other}: starting from an empty state; the old one is kept as ${this.setAside('sync.json')}.`);
    }

    return this.emptySync(identity);
  }

  /** Renames a file of the volume instead of deleting it; returns its new name. It stays readable by its owner only. */
  setAside(name: string): string {
    const stamp = new Date().toISOString().replace(/[-:.]/g, '');
    const kept = `${name.replace(/\.json$/, '')}.${stamp}.other-account.json`;
    renameSync(join(this.dir, name), join(this.dir, kept));
    chmodSync(join(this.dir, kept), 0o600);

    return kept;
  }

  saveSync(state: SyncState): void {
    this.write('sync.json', state);
  }
}
