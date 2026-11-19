// One pass: read what changed in the SmartWorkout workout history since the last pass and send every finished
// workout to Enduo. The cursor moves only after everything before it was handled, so a pass that fails half way
// is repeated; what was already sent is skipped by its revision (and by the idempotency key in Enduo).
//
// A workout that cannot be read, or that Enduo refuses as invalid, is given up on and the pass goes on: it is
// remembered with its revision and tried again when it changes in SmartWorkout. A failure that is not about one
// workout (the network, a refused token, 429, 5xx) ends the pass, which is then repeated.

import type { Config } from './config.ts';
import { EnduoToolError } from './enduo.ts';
import { serverOrigin } from './identity.ts';
import type { SyncIdentity } from './identity.ts';
import { catalogueIn, problemWith, toSession, unknownExercises } from './mapping.ts';
import type { EnduoSession, SwWorkout } from './mapping.ts';
import { SmartWorkoutError } from './smartworkout.ts';
import type { SwChange, SwSyncPage } from './smartworkout.ts';
import type { ExerciseCache, SkippedWorkout, Store, SyncState } from './store.ts';
import { line } from './text.ts';

/** SmartWorkout as a pass needs it. */
export interface WorkoutSource {
  /** The account of the session, to tie the sync state to it. */
  account(): Promise<string>;
  exercises(force?: boolean): Promise<Pick<ExerciseCache, 'translations' | 'weightTypes'>>;
  workoutChanges(clientInstanceId: string, cursor: number, serverEpoch: string | null): Promise<SwSyncPage>;
}

/** Enduo as a pass needs it. */
export interface EnduoTools {
  /** The account of the token, to tie the sync state to it. */
  account(): Promise<string>;
  callTool(name: string, args?: Record<string, unknown>): Promise<unknown>;
}

export interface PassResult {
  sent: number;
  /** Given up on: it could not be read, or Enduo refused it as invalid. */
  skipped: number;
  /** Nothing to send: deleted, older than the first run reaches, or without a completed set. */
  ignored: number;
}

export interface PassOptions {
  /** Print what would be sent instead of sending it; the state is not changed. */
  dryRun?: boolean;
  log: (line: string) => void;
}

/** "2 sent, 1 skipped (unreadable or refused by Enduo), 3 with nothing to send" */
export function summary(result: PassResult, dryRun = false): string {
  return `${result.sent} ${dryRun ? 'to send' : 'sent'}, ${result.skipped} skipped (unreadable or refused by Enduo), ${result.ignored} with nothing to send`;
}

/** A change of the log that says which workout and which revision it is about. */
export function isChange(value: unknown): value is SwChange {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const change = value as Record<string, unknown>;

  return (
    typeof change.workoutId === 'string' &&
    change.workoutId !== '' &&
    typeof change.sequence === 'number' &&
    Number.isFinite(change.sequence) &&
    typeof change.serverRevision === 'number' &&
    Number.isFinite(change.serverRevision) &&
    typeof change.operation === 'string'
  );
}

const startOf = (change: SwChange): number => {
  const startedAt: unknown = change.workout?.startedAt;

  return typeof startedAt === 'number' && Number.isFinite(startedAt) ? startedAt : 0;
};

/** The newest change of every workout of a page, in the order of the workouts' start. */
export function latestByWorkout(changes: SwChange[]): SwChange[] {
  const latest = new Map<string, SwChange>();
  for (const change of [...changes].sort((a, b) => a.sequence - b.sequence)) {
    latest.set(change.workoutId, change);
  }

  return [...latest.values()].sort((a, b) => startOf(a) - startOf(b));
}

const describe = (workout: SwWorkout): string =>
  `"${line(workout.name, 60) ?? 'workout'}" of ${new Date(workout.startedAt).toISOString().slice(0, 16).replace('T', ' ')} UTC`;

/** An id of SmartWorkout in a log line: one line, bounded. */
const shown = (id: unknown): string => line(id, 80) ?? 'without an id';

export async function runPass(config: Config, store: Store, smartworkout: WorkoutSource, enduo: EnduoTools | null, options: PassOptions): Promise<PassResult> {
  const { log } = options;
  const dryRun = options.dryRun === true;
  const result: PassResult = { sent: 0, skipped: 0, ignored: 0 };

  let state: SyncState;
  if (enduo === null) {
    // A dry run without an Enduo sign-in: whose state the stored one is cannot be told, so it is not used.
    log('Not signed in to Enduo: showing what a first run would send.');
    state = store.emptySync(null);
  } else {
    const identity: SyncIdentity = {
      enduo: serverOrigin(config.mcpUrl),
      enduoAccount: await enduo.account(),
      smartworkoutAccount: await smartworkout.account(),
    };
    state = store.syncFor(identity, { log, dryRun });
  }

  const save = (): void => {
    if (!dryRun) {
      store.saveSync(state);
    }
  };

  /** Gives up on this revision of a workout: it is not tried again until SmartWorkout has a newer one. */
  const giveUp = (id: string, revision: number, reason: SkippedWorkout['reason'], why: string): void => {
    log(`Skipped workout ${shown(id)} (revision ${revision}): ${why}. It is tried again when it changes in SmartWorkout.`);
    state.sent[id] = revision;
    state.skipped[id] = { revision, reason, at: new Date().toISOString() };
    result.skipped++;
    save();
  };

  if (state.cursor === null) {
    state.cursor = 0;
    state.backfillFromMs = Date.now() - config.backfillDays * 86_400_000;
    log(`First run: sending workouts that started after ${new Date(state.backfillFromMs).toISOString().slice(0, 10)} (BACKFILL_DAYS=${config.backfillDays}).`);
  }

  let catalogue = catalogueIn(await smartworkout.exercises(), config.exerciseLanguages);
  let more = true;
  let restarted = false;
  while (more) {
    const page = await smartworkout.workoutChanges(state.clientInstanceId, state.cursor, state.serverEpoch);
    const startOver = page.requiresFullSnapshot || (state.serverEpoch !== null && page.serverEpoch !== null && page.serverEpoch !== state.serverEpoch);
    if (startOver && restarted) {
      throw new Error('SmartWorkout keeps asking for a full resync; its sync may have changed (docs/smartworkout-api.md).');
    }
    if (startOver) {
      restarted = true;
      // SmartWorkout started its history over: read it again from the start; what was sent is skipped by revision.
      log('SmartWorkout asks for a full resync; reading the history again from the start.');
      state.cursor = 0;
      state.serverEpoch = page.requiresFullSnapshot ? null : page.serverEpoch;
      save();
      continue;
    }

    const changes: SwChange[] = [];
    for (const change of page.changes) {
      if (isChange(change)) {
        changes.push(change);
        continue;
      }
      // Nothing says which workout it is, so there is nothing to remember: the cursor moves past it.
      const id = typeof change === 'object' && change !== null ? (change as { workoutId?: unknown }).workoutId : undefined;
      log(`Skipped a change of the workout history (workout ${shown(id)}): it cannot be read.`);
      result.skipped++;
    }

    for (const change of latestByWorkout(changes)) {
      const workout: unknown = change.workout;
      const revision = change.serverRevision;
      if (change.operation !== 'upsert' || workout === null || workout === undefined) {
        // A deleted workout stays in Enduo: the activity is the watch's, and its sets are history.
        log(`Workout ${shown(change.workoutId)}: ${shown(change.operation)} in SmartWorkout, nothing to send.`);
        result.ignored++;
        continue;
      }

      const problem = problemWith(workout);
      if (problem !== null) {
        if ((state.sent[change.workoutId] ?? 0) < revision) {
          giveUp(change.workoutId, revision, 'unreadable', problem);
        }
        continue;
      }
      const readable = workout as SwWorkout;
      if ((state.sent[readable.id] ?? 0) >= revision) {
        continue;
      }
      if (state.backfillFromMs !== null && readable.startedAt < state.backfillFromMs) {
        state.sent[readable.id] = revision;
        result.ignored++;
        continue;
      }

      if (unknownExercises(readable, catalogue).length > 0) {
        catalogue = catalogueIn(await smartworkout.exercises(true), config.exerciseLanguages);
      }
      let session: EnduoSession | null;
      try {
        session = toSession(readable, revision, catalogue);
      } catch (error) {
        // The mapping only computes: whatever it trips over is in this workout, not in the connection.
        giveUp(readable.id, revision, 'unreadable', `it cannot be mapped (${error instanceof Error ? error.name : 'error'})`);
        continue;
      }
      if (session === null) {
        log(`Workout ${shown(readable.id)}: no completed sets, nothing to send.`);
        state.sent[readable.id] = revision;
        delete state.skipped[readable.id];
        result.ignored++;
        continue;
      }

      if (dryRun || enduo === null) {
        log(`Would send ${describe(readable)}:\n${JSON.stringify(session, null, 2)}`);
        result.sent++;
        continue;
      }

      try {
        const answer = (await enduo.callTool('strength_session_log', { ...session })) as { activity_id?: string; id?: string } | null;
        const activity = answer?.activity_id ?? answer?.id;
        log(`Sent ${describe(readable)}: ${session.sets.length} sets${activity ? `, activity ${shown(activity)}` : ''}.`);
        result.sent++;
      } catch (error) {
        if (!(error instanceof EnduoToolError)) {
          throw error;
        }
        // Enduo refused this workout as invalid: say why and move on, or one bad workout would block every later one.
        giveUp(readable.id, revision, 'refused', `Enduo refused it (${line(error.message, 300) ?? 'no reason given'})`);
        continue;
      }
      state.sent[readable.id] = revision;
      delete state.skipped[readable.id];
      save();
    }

    if (page.hasMore && page.changes.length > 0 && page.nextCursor <= state.cursor) {
      // Asking again from the same place would never end.
      throw new SmartWorkoutError('SmartWorkout says there is more but did not move the cursor; its sync may have changed (docs/smartworkout-api.md).');
    }
    state.cursor = page.nextCursor;
    state.serverEpoch = page.serverEpoch;
    more = page.hasMore && page.changes.length > 0;
  }

  if (!dryRun) {
    state.lastSyncAt = new Date().toISOString();
    store.saveSync(state);
  }

  return result;
}
