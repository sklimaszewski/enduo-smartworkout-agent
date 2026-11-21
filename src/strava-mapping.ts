// SmartWorkout → Strava's JSON strength upload. Native sets hold what Strava supports (exercise, repetitions,
// weight, duration); the activity gets no description: the athlete's own words on Strava are left alone.

import { sha256 } from './identity.ts';
import { byOrder, MAX_TITLE } from './mapping.ts';
import type { Catalogue, SwWorkout } from './mapping.ts';
import type { SwCatalogueExercise } from './smartworkout.ts';
import { STRAVA_EXERCISE_BY_ID } from './strava-catalogue.ts';
import { STRAVA_EXERCISES } from './strava-exercises.ts';
import { line } from './text.ts';

export interface StravaActivity {
  name: string;
  sport_type: 'WeightTraining';
  file: {
    version: '1.0';
    start_time: string;
    utc_offset: number;
    elapsed_time: number;
    creator: { name: string };
    sets: StravaSet[];
  };
}

export interface StravaSet {
  exercise_type: string;
  repetitions?: number;
  weight?: number;
  duration?: number;
}

export class StravaMappingError extends Error {}

/** Opaque, stable across revisions, and distinct for different SmartWorkout accounts. */
export const stravaMarker = (account: string, workoutId: string): string => `SmartWorkout: ${sha256(JSON.stringify([account, workoutId]))}`;

const externalBase = (marker: string): string => `smartworkout-${marker.slice('SmartWorkout: '.length)}`;

/**
 * The external id of one upload. Strava refuses ("Error Processing Data", at once) every upload whose external id
 * an earlier upload already used, even a valid file after a failed or deleted one; so each upload has an attempt
 * of its own after the stable part. Without an attempt: the id of uploads made before this rule.
 */
export const stravaExternalId = (marker: string, attempt?: string): string =>
  `${externalBase(marker)}${attempt === undefined ? '' : `-${attempt}`}.json`;

/** An external id of any upload of this workout, including the earlier ones without an attempt. */
export function isStravaExternalId(value: unknown, marker: string): boolean {
  const base = externalBase(marker);

  return typeof value === 'string' && (value === `${base}.json` || (value.startsWith(`${base}-`) && /^-[a-z0-9]{1,32}\.json$/.test(value.slice(base.length))));
}

/** Distinct for every upload of a workout, also within one millisecond. */
export const uploadAttempt = (): string => `${Date.now().toString(36)}${crypto.randomUUID().slice(0, 4)}`;

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/** ISO local time with the offset at the workout's date, including daylight saving time. */
export function localStart(ms: number, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'longOffset',
  }).formatToParts(ms);
  const part = (type: string): string => parts.find((item) => item.type === type)?.value ?? '';
  const offset = part('timeZoneName').replace('GMT', '') || '+00:00';

  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}${offset}`;
}

const normalized = (name: string): string => name.toUpperCase().replace(/['’]/g, '').replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');

// Exact catalogue names cover all documented identifiers; aliases cover common app names and generic names.
const ALIASES: Record<string, string> = {
  BENCH_PRESS: 'BENCH_PRESS_GENERIC', PLANK: 'PLANK_GENERIC', PULL_UP: 'PULL_UP_GENERIC', PULL_UPS: 'PULL_UP_GENERIC',
  PUSH_UP: 'PUSH_UP_GENERIC', PUSH_UPS: 'PUSH_UP_GENERIC', SQUAT: 'SQUAT_GENERIC', SQUATS: 'SQUAT_GENERIC',
  DEADLIFT: 'DEADLIFT_GENERIC', DEADLIFTS: 'DEADLIFT_GENERIC', LUNGE: 'LUNGE_GENERIC', LUNGES: 'LUNGE_GENERIC',
  DUMBBELL_CURL: 'STANDING_DUMBBELL_BICEPS_CURL', BARBELL_CURL: 'BARBELL_BICEPS_CURL', BICEP_CURL: 'CURL_GENERIC',
  HAMMER_CURL: 'DUMBBELL_HAMMER_CURL', TRICEPS_PUSHDOWN: 'CABLE_TRICEPS_PUSHDOWN', TRICEP_PUSHDOWN: 'CABLE_TRICEPS_PUSHDOWN',
  ASSISTED_PULL_UP: 'MACHINE_ASSISTED_PULL_UP', ASSISTED_PULL_UPS: 'MACHINE_ASSISTED_PULL_UP',
  LAT_PULL_DOWN: 'LAT_PULLDOWN', LAT_PULLDOWNS: 'LAT_PULLDOWN', LEG_EXTENSION: 'MACHINE_LEG_EXTENSION',
  SEATED_LEG_CURL: 'MACHINE_LEG_CURL_SEATED', LYING_LEG_CURL: 'LEG_CURL_GENERIC', CALF_RAISE: 'CALF_RAISE_GENERIC',
  LATERAL_RAISE: 'LATERAL_RAISE_GENERIC', DUMBBELL_LATERAL_RAISE: 'LATERAL_RAISE_GENERIC',
  SHOULDER_PRESS: 'SHOULDER_PRESS_GENERIC', DUMBBELL_SHOULDER_PRESS: 'OVERHEAD_DUMBBELL_PRESS',
  BARBELL_SHOULDER_PRESS: 'OVERHEAD_BARBELL_PRESS', OVERHEAD_PRESS: 'SHOULDER_PRESS_GENERIC',
  BENT_OVER_BARBELL_ROW: 'BENT_OVER_BARBELL_ROW', BARBELL_ROW: 'BENT_OVER_BARBELL_ROW',
  TRICEPS_EXTENSION: 'TRICEPS_EXTENSION_GENERIC', SIT_UP: 'SIT_UP_GENERIC', SIT_UPS: 'SIT_UP_GENERIC',
  CRUNCHES: 'CRUNCH', ROMANIAN_DEADLIFT: 'ROMANIAN_DEADLIFTS', DUMBBELL_ROMANIAN_DEADLIFT: 'DUMBBELL_ROMANIAN_DEADLIFTS',
  WIDE_GRIP_LAT_PULLDOWN: 'LAT_PULLDOWN', DUMBBELL_BENT_OVER_ROW: 'BENT_OVER_DUMBBELL_ROW',
  MACHINE_REVERSE_FLY: 'MACHINE_REAR_DELT_REVERSE_FLY', MACHINE_REVERSE_FLYES: 'MACHINE_REAR_DELT_REVERSE_FLY',
  DUMBBELL_BULGARIAN_SQUAT: 'DUMBBELL_BULGARIAN_SPLIT_SQUATS', DUMBBELL_BULGARIAN_SPLIT_SQUAT: 'DUMBBELL_BULGARIAN_SPLIT_SQUATS',
  ONE_ARM_CABLE_LATERAL_RAISE: 'CABLE_LATERAL_RAISE', SINGLE_ARM_CABLE_LATERAL_RAISE: 'CABLE_LATERAL_RAISE',
  ROPE_TRICEPS_PUSHDOWN: 'CABLE_TRICEPS_PUSHDOWN', ROPE_TRICEP_PUSHDOWN: 'CABLE_TRICEPS_PUSHDOWN',
  KNEELING_CABLE_ABS_CRUNCHES: 'CABLE_CRUNCH', KNEELING_CABLE_CRUNCH: 'CABLE_CRUNCH', CABLE_CRUNCHES: 'CABLE_CRUNCH',
  DUMBBELL_NEUTRAL_GRIP_INCLINE_BENCH_ROW: 'CHEST_SUPPORTED_ROW', INCLINE_DUMBBELL_ROW: 'CHEST_SUPPORTED_ROW',
  ONE_ARM_CABLE_ROW: 'SEATED_CABLE_ROW', SINGLE_ARM_CABLE_ROW: 'SEATED_CABLE_ROW', CABLE_FACE_PULL: 'FACE_PULL',
  SMITH_CALF_RAISES: 'STANDING_CALF_RAISE', SMITH_MACHINE_CALF_RAISE: 'STANDING_CALF_RAISE',
  CLOSE_GRIP_BENCH_PRESS: 'CLOSE_GRIP_BARBELL_BENCH_PRESS', PLATE_LOADED_CHEST_PRESS: 'MACHINE_CHEST_PRESS',
  SEATED_ARNOLD_DUMBBELL_PRESS: 'ARNOLD_PRESS', DUMBBELL_ARNOLD_PRESS: 'ARNOLD_PRESS',
  HANGING_STRAIGHT_LEG_RAISE: 'HANGING_LEG_RAISE',
};

/** Words of a name that tell its movement: the first that matches gives Strava's generic type of that movement. */
const MOVEMENTS: Array<[RegExp, string]> = ([
  ['LEG_CURLS?', 'LEG_CURL_GENERIC'],
  ['CALF|CALVES', 'CALF_RAISE_GENERIC'],
  ['LATERAL_RAISES?|SIDE_RAISES?', 'LATERAL_RAISE_GENERIC'],
  ['(?:LEG|KNEE)_RAISES?|TOES_TO_BAR', 'LEG_RAISE_GENERIC'],
  ['TRICEPS?|PUSHDOWNS?|PRESSDOWNS?|SKULL_?CRUSHERS?|DIPS?', 'TRICEPS_EXTENSION_GENERIC'],
  ['CRUNCH(?:ES)?', 'CRUNCH'],
  ['SIT_?UPS?', 'SIT_UP_GENERIC'],
  ['FACE_PULLS?', 'FACE_PULL'],
  ['(?:LAT_)?PULL_?DOWNS?', 'LAT_PULLDOWN'],
  ['PULL_?UPS?|CHIN_?UPS?', 'PULL_UP_GENERIC'],
  ['ROWS?', 'ROW_GENERIC'],
  ['FL(?:Y|YE|YES|IES)', 'FLYE_GENERIC'],
  ['DEADLIFTS?|RDL', 'DEADLIFT_GENERIC'],
  ['LUNGES?', 'LUNGE_GENERIC'],
  ['SQUATS?|LEG_PRESS', 'SQUAT_GENERIC'],
  ['(?:BENCH|CHEST)_PRESS', 'BENCH_PRESS_GENERIC'],
  ['(?:SHOULDER|OVERHEAD|MILITARY|ARNOLD)_PRESS', 'SHOULDER_PRESS_GENERIC'],
  ['PUSH_?UPS?', 'PUSH_UP_GENERIC'],
  ['PLANKS?', 'PLANK_GENERIC'],
  ['SHRUGS?', 'SHRUG_GENERIC'],
  ['HIP_THRUSTS?|GLUTE_BRIDGES?', 'HIP_RAISE_GENERIC'],
  ['HYPEREXTENSIONS?|BACK_EXTENSIONS?', 'HYPEREXTENSION_GENERIC'],
  ['CARRY|CARRIES|FARMERS?_WALKS?', 'CARRY_GENERIC'],
  ['CURLS?', 'CURL_GENERIC'],
] as Array<[string, string]>).map(([words, type]) => [new RegExp(`(?:^|_)(?:${words})(?:_|$)`), type]);

/**
 * An exact identifier, else an alias, else the generic type of the movement its name tells (a row is ROW_GENERIC),
 * else TOTAL_BODY_GENERIC. Never a specific exercise that the name does not say.
 */
export function stravaExercise(name: string | undefined, weightType?: string): string {
  if (name === undefined) {
    return 'TOTAL_BODY_GENERIC';
  }
  const key = normalized(name);
  const words = key.split('_');
  const equipment = words.at(-1);
  const reordered = equipment && ['BARBELL', 'DUMBBELL', 'KETTLEBELL', 'MACHINE', 'CABLE'].includes(equipment)
    ? `${equipment}_${words.slice(0, -1).join('_')}` : key;
  const candidates = [key, reordered, `${weightType ?? ''}_${key}`];
  for (const candidate of candidates) {
    if (STRAVA_EXERCISES.has(candidate)) {
      return candidate;
    }
  }
  for (const candidate of candidates) {
    if (ALIASES[candidate] !== undefined) {
      return ALIASES[candidate];
    }
  }

  return MOVEMENTS.find(([words]) => words.test(key))?.[1] ?? 'TOTAL_BODY_GENERIC';
}

/** The type from the table of SmartWorkout's catalogue, else the type its name gives (an athlete's own exercise). */
export function stravaExerciseOf(exerciseId: string, name: string | undefined, weightType?: string): string {
  return Object.hasOwn(STRAVA_EXERCISE_BY_ID, exerciseId) ? STRAVA_EXERCISE_BY_ID[exerciseId]! : stravaExercise(name, weightType);
}

export interface CatalogueGaps {
  /** Public exercises the table lacks, with the type their name gives. */
  missing: Array<{ id: string; name: string; type: string }>;
  /** Exercises athletes added for themselves: always matched by name. */
  own: Array<{ id: string; name: string; type: string }>;
  /** Ids in the table that the catalogue no longer has. */
  stale: string[];
}

/** What `strava-exercises` reports: how the table of SmartWorkout's catalogue compares with the catalogue now. */
export function catalogueGaps(catalogue: SwCatalogueExercise[]): CatalogueGaps {
  const gaps: CatalogueGaps = { missing: [], own: [], stale: [] };
  const ids = new Set<string>();
  for (const exercise of catalogue) {
    ids.add(exercise.id);
    const row = { id: exercise.id, name: exercise.name ?? exercise.id, type: stravaExercise(exercise.name ?? undefined, exercise.weightType ?? undefined) };
    if (!exercise.isPublic) {
      gaps.own.push(row);
    } else if (!Object.hasOwn(STRAVA_EXERCISE_BY_ID, exercise.id)) {
      gaps.missing.push(row);
    }
  }
  gaps.stale = Object.keys(STRAVA_EXERCISE_BY_ID).filter((id) => !ids.has(id));

  return gaps;
}

/** Null for an empty/aborted workout. A missing duration is refused rather than invented. */
export function toStravaActivity(workout: SwWorkout, catalogue: Catalogue, timezone: string): StravaActivity | null {
  const sets: StravaSet[] = [];
  for (const exercise of byOrder(workout.workoutExercises ?? [])) {
    const units = Array.isArray(exercise.units) ? exercise.units : [];
    const exerciseType = stravaExerciseOf(exercise.exerciseId, catalogue.englishNames?.[exercise.exerciseId] ?? catalogue.names[exercise.exerciseId], catalogue.weightTypes[exercise.exerciseId]);
    for (const set of byOrder(exercise.sets ?? [])) {
      if (!finite(set.reps) || set.reps <= 0) {
        continue;
      }
      const native: StravaSet = { exercise_type: exerciseType };
      if (units.includes('TIME')) {
        native.duration = Math.max(1, Math.round(set.reps / 1000));
      } else {
        native.repetitions = Math.max(1, Math.round(set.reps));
      }
      // An assisting weight is no load: Strava would read it as one.
      if (finite(set.weight) && set.weight >= 0 && catalogue.weightTypes[exercise.exerciseId] !== 'ASSISTED_WEIGHT') {
        native.weight = set.weight;
      }
      sets.push(native);
    }
  }
  if (sets.length === 0) {
    return null;
  }
  if (!finite(workout.durationInMinutes) || !Number.isSafeInteger(Math.round(workout.durationInMinutes * 60)) || Math.round(workout.durationInMinutes * 60) < 1) {
    throw new StravaMappingError('the workout has no positive duration (required by Strava)');
  }

  return {
    name: line(workout.name, MAX_TITLE) ?? 'SmartWorkout strength training',
    sport_type: 'WeightTraining',
    file: {
      version: '1.0',
      // The form of Strava's example: whole seconds in UTC with a Z.
      start_time: new Date(Math.floor(workout.startedAt / 1000) * 1000).toISOString().replace('.000Z', 'Z'),
      utc_offset: Math.round((Date.parse(localStart(workout.startedAt, timezone).slice(0, 19) + 'Z') - Math.floor(workout.startedAt / 1000) * 1000) / 1000),
      elapsed_time: Math.round(workout.durationInMinutes * 60),
      creator: { name: 'Enduo SmartWorkout Agent' },
      sets,
    },
  };
}
