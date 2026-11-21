// SmartWorkout → Strava's JSON strength upload. Native sets hold what Strava supports (exercise, repetitions,
// weight, duration); the activity gets no description: the athlete's own words on Strava are left alone.

import { sha256 } from './identity.ts';
import { byOrder, MAX_TITLE } from './mapping.ts';
import type { Catalogue, SwWorkout } from './mapping.ts';
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
};

/** Do not guess at a custom exercise's movement. Its original name stays in the description. */
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

  return 'TOTAL_BODY_GENERIC';
}

/** Null for an empty/aborted workout. A missing duration is refused rather than invented. */
export function toStravaActivity(workout: SwWorkout, catalogue: Catalogue, timezone: string): StravaActivity | null {
  const sets: StravaSet[] = [];
  for (const exercise of byOrder(workout.workoutExercises ?? [])) {
    const units = Array.isArray(exercise.units) ? exercise.units : [];
    const exerciseType = stravaExercise(catalogue.englishNames?.[exercise.exerciseId] ?? catalogue.names[exercise.exerciseId], catalogue.weightTypes[exercise.exerciseId]);
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
