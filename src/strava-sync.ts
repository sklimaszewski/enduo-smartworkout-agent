// Strava has its own cursor, revisions and account binding. A failed Strava pass never holds back Enduo, and a
// failed Enduo pass never holds back Strava. The first pass pins the start boundary before contacting Strava:
// enabling the integration does not send the history as it is, even if signing in to Strava initially fails.
// Once that history has been read, every change is sent, whatever its date: an edit of an older workout updates
// its activity or creates it, and so does a workout added with an earlier date.

import type { Config } from './config.ts';
import { catalogueIn, problemWith, unknownExercises } from './mapping.ts';
import type { SwWorkout } from './mapping.ts';
import { SmartWorkoutError } from './smartworkout.ts';
import type { Store } from './store.ts';
import { StravaActivityError } from './strava.ts';
import type { StravaUpload } from './strava.ts';
import { StravaMappingError, stravaMarker, toStravaActivity } from './strava-mapping.ts';
import type { StravaActivity } from './strava-mapping.ts';
import { isChange, latestByWorkout } from './sync.ts';
import type { PassOptions, PassResult, WorkoutSource } from './sync.ts';
import { line } from './text.ts';

export interface StravaActivities {
  account(): Promise<string>;
  findActivity(marker: string, startedAt: number): Promise<string | null>;
  createUpload(activity: StravaActivity, marker: string): Promise<StravaUpload>;
  getUpload(id: string): Promise<StravaUpload>;
  updateActivity(id: string, activity: StravaActivity): Promise<void>;
}

interface StravaSyncState {
  smartworkoutAccount: string;
  /** Null until the first successful Strava sign-in. */
  stravaAccount: string | null;
  clientInstanceId: string;
  sinceMs: number;
  cursor: number;
  serverEpoch: string | null;
  /** Last revision handled, including empty, old, unreadable and refused workouts. */
  revisions: Record<string, number>;
  /** Workouts of the history as it was when Strava was enabled, left out until they change. */
  historical: Record<string, true>;
  /** True once the history as it was has been read: a change after that is sent, whatever its date. */
  historyRead: boolean;
  /** Id of each exported activity; retained even if a newer revision is refused. */
  activities: Record<string, string>;
  /** Start used for a create that may have reached Strava without a response reaching us. */
  pending: Record<string, { startedAt: number; uploadId: string | null }>;
  lastSyncAt: string | null;
}

export interface StravaPassResult extends PassResult {
  pending: number;
}

function emptyState(smartworkoutAccount: string, sinceMs: number): StravaSyncState {
  return { smartworkoutAccount, stravaAccount: null, clientInstanceId: crypto.randomUUID(), sinceMs, cursor: 0, serverEpoch: null, revisions: {}, historical: {}, historyRead: false, activities: {}, pending: {}, lastSyncAt: null };
}

function readState(store: Store): StravaSyncState | null {
  const state = store.read<StravaSyncState>('strava-sync.json');
  if (!state || typeof state.smartworkoutAccount !== 'string' || (state.stravaAccount !== null && typeof state.stravaAccount !== 'string') ||
    typeof state.sinceMs !== 'number' || !Number.isFinite(state.sinceMs) || typeof state.clientInstanceId !== 'string' ||
    !Number.isFinite(state.cursor) || !state.revisions || !state.historical || !state.activities || !state.pending) {
    return null;
  }
  // A state saved before this flag: a pass that finished has read the history.
  if (typeof state.historyRead !== 'boolean') {
    state.historyRead = state.lastSyncAt !== null;
  }

  return state;
}

export async function runStravaPass(config: Config, store: Store, smartworkout: WorkoutSource, strava: StravaActivities, options: PassOptions): Promise<StravaPassResult> {
  const result: StravaPassResult = { sent: 0, skipped: 0, ignored: 0, pending: 0 };
  if (!config.stravaEnabled) {
    return result;
  }
  const now = Date.now();
  const dryRun = options.dryRun === true;
  const { log } = options;
  const sourceAccount = await smartworkout.account();
  let state = readState(store);
  const reset = (why: string): StravaSyncState => {
    if (!dryRun) {
      const old = store.read<unknown>('strava-sync.json');
      if (old !== null) {
        store.setAside('strava-sync.json');
      }
    }
    log(`Strava: ${why}; only workouts starting from now will be sent.`);

    return emptyState(sourceAccount, now);
  };
  if (state === null) {
    state = reset('first run');
  } else if (state.smartworkoutAccount !== sourceAccount) {
    state = reset('the SmartWorkout account changed');
  }
  const save = (): void => {
    if (!dryRun) {
      store.write('strava-sync.json', state);
    }
  };
  save();

  // A dry run must neither refresh Strava tokens nor write its session. Without a verified stored athlete it
  // can still preview the mapping, but cannot use activity ids belonging to an unknown/currently changed token.
  const session = store.strava();
  const account = dryRun ? (session?.clientId === config.stravaClientId ? session.athleteId : null) : await strava.account();
  if (account !== null && state.stravaAccount !== null && state.stravaAccount !== account) {
    state = reset('the Strava account changed');
  } else if (dryRun && account === null) {
    state = emptyState(sourceAccount, state.sinceMs);
    log('Strava: no verified stored sign-in; previewing without exported activity ids.');
  }
  state.stravaAccount = account;
  save();

  const skip = (id: string, revision: number, reason: string): void => {
    log(`Strava: skipped workout ${line(id, 80) ?? 'without an id'} (revision ${revision}): ${reason}. It is tried again when it changes in SmartWorkout.`);
    state.revisions[id] = revision;
    delete state.pending[id];
    result.skipped++;
    save();
  };

  let catalogue = catalogueIn(await smartworkout.exercises(), config.exerciseLanguages);
  let more = true;
  let restarted = false;
  while (more) {
    const page = await smartworkout.workoutChanges(state.clientInstanceId, state.cursor, state.serverEpoch);
    const startOver = page.requiresFullSnapshot || (state.serverEpoch !== null && page.serverEpoch !== null && page.serverEpoch !== state.serverEpoch);
    if (startOver) {
      if (restarted) {
        throw new SmartWorkoutError('SmartWorkout keeps asking Strava sync for a full resync.');
      }
      restarted = true;
      state.cursor = 0;
      state.serverEpoch = page.requiresFullSnapshot ? null : page.serverEpoch;
      // Revisions of a new snapshot may not compare with ours: read it as history, never send it all as edits.
      state.historyRead = false;
      save();
      continue;
    }
    const changes = page.changes.filter(isChange);
    result.skipped += page.changes.length - changes.length;
    for (const change of latestByWorkout(changes)) {
      const id = change.workoutId;
      const revision = change.serverRevision;
      if ((state.revisions[id] ?? 0) >= revision) {
        continue;
      }
      if (change.operation !== 'upsert' || change.workout == null) {
        // Deletions never remove a Strava activity, including one that an athlete has since edited there.
        state.revisions[id] = revision;
        result.ignored++;
        continue;
      }
      const problem = problemWith(change.workout);
      if (problem !== null || change.workout.id !== id) {
        skip(id, revision, problem ?? 'the workout id does not match its change');
        continue;
      }
      const workout = change.workout as SwWorkout;
      // A new revision of a workout that was historical is an edit made after Strava was enabled: it is sent.
      if (!state.historyRead && workout.startedAt < state.sinceMs && state.activities[id] === undefined && state.pending[id] === undefined) {
        state.historical[id] = true;
        state.revisions[id] = revision;
        result.ignored++;
        continue;
      }
      if (unknownExercises(workout, catalogue).length > 0) {
        catalogue = catalogueIn(await smartworkout.exercises(true), config.exerciseLanguages);
      }
      const marker = stravaMarker(sourceAccount, id);
      let activity: StravaActivity | null;
      try {
        activity = toStravaActivity(workout, catalogue, config.stravaTimezone);
      } catch (error) {
        skip(id, revision, error instanceof StravaMappingError ? error.message : 'the workout cannot be mapped');
        continue;
      }
      if (activity === null) {
        state.revisions[id] = revision;
        result.ignored++;
        continue;
      }
      if (dryRun) {
        log(`Would send to Strava (${state.activities[id] === undefined ? 'create' : 'update'}):\n${JSON.stringify(activity, null, 2)}`);
        result.sent++;
        continue;
      }
      try {
        let activityId = state.activities[id];
        if (activityId === undefined) {
          const pending = state.pending[id];
          let upload = pending?.uploadId ? await strava.getUpload(pending.uploadId) : null;
          activityId = upload?.activityId ?? undefined;
          if (activityId === undefined && (upload === null || !upload.failed || upload.duplicate)) {
            activityId = await strava.findActivity(marker, pending?.startedAt ?? workout.startedAt) ?? undefined;
          }
          if (activityId === undefined && upload === null) {
            state.pending[id] = { startedAt: pending?.startedAt ?? workout.startedAt, uploadId: null };
            save();
            upload = await strava.createUpload(activity, marker);
            // Persist the upload id before polling: a restart must resume processing rather than upload again.
            state.pending[id]!.uploadId = upload.id;
            save();
          }
          if (activityId === undefined && upload !== null) {
            activityId = upload.activityId ?? undefined;
          }
          if (activityId === undefined && upload !== null) {
            if (upload.duplicate) {
              if (!pending?.uploadId) {
                // A prior upload whose response was lost may still be processing. Look again next pass before
                // deciding that this is another source's activity; never edit a watch activity by time alone.
                result.pending++;
                log(`Strava: duplicate upload for workout ${line(id, 80)}; the next pass will look for its source id.`);
                return result;
              }
              throw new StravaActivityError('Strava reports duplicate data, but no activity with our source id was found; the existing activity was left unchanged');
            }
            if (upload.failed) {
              throw new StravaActivityError(`Strava could not process this workout file: ${upload.error ?? 'no reason given'}`);
            }
          }
          if (activityId === undefined) {
            log(`Strava: workout ${line(id, 80)} is being processed; the next pass will check its upload.`);
            result.pending++;
            return result;
          }
          state.activities[id] = activityId;
          save();
          // A completed upload may belong to a revision before an edit that arrived while it was processing.
          await strava.updateActivity(activityId, activity);
        } else {
          state.activities[id] = activityId;
          save();
          await strava.updateActivity(activityId, activity);
        }
        state.revisions[id] = revision;
        delete state.pending[id];
        result.sent++;
        log(`Strava: sent workout ${line(id, 80)} to activity ${line(activityId, 80)}.`);
        save();
      } catch (error) {
        if (!(error instanceof StravaActivityError)) {
          throw error;
        }
        skip(id, revision, error.message);
      }
    }
    if (page.hasMore && page.changes.length > 0 && page.nextCursor <= state.cursor) {
      throw new SmartWorkoutError('SmartWorkout says there is more for Strava sync but did not move the cursor.');
    }
    state.cursor = page.nextCursor;
    state.serverEpoch = page.serverEpoch;
    more = page.hasMore && page.changes.length > 0;
    save();
  }
  state.historyRead = true;
  state.lastSyncAt = new Date().toISOString();
  save();

  return result;
}
