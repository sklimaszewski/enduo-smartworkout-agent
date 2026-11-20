// SmartWorkout → Strava's JSON strength upload. Native sets hold supported fields; the description also keeps
// the original exercise names, RPE, set types, assistance, bands, body weight, timers and notes.

import { sha256 } from './identity.ts';
import { atom, byOrder, exerciseName, MAX_TITLE } from './mapping.ts';
import type { Catalogue, SwWorkout } from './mapping.ts';
import { STRAVA_EXERCISES } from './strava-exercises.ts';
import { line, note } from './text.ts';

export interface StravaActivity {
  name: string;
  sport_type: 'WeightTraining';
  description: string;
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

export const stravaExternalId = (marker: string): string => `smartworkout-${marker.slice('SmartWorkout: '.length)}.json`;

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
export function toStravaActivity(workout: SwWorkout, catalogue: Catalogue, marker: string, timezone: string): StravaActivity | null {
  const rows = [marker, `Started: ${atom(workout.startedAt)}`];
  const exercises: string[] = [];
  const nativeSets: StravaSet[] = [];
  let exerciseCount = 0;
  let setCount = 0;
  for (const exercise of byOrder(workout.workoutExercises ?? [])) {
    const units = Array.isArray(exercise.units) ? exercise.units : [];
    const sets: string[] = [];
    const exerciseType = stravaExercise(catalogue.englishNames?.[exercise.exerciseId] ?? catalogue.names[exercise.exerciseId], catalogue.weightTypes[exercise.exerciseId]);
    for (const set of byOrder(exercise.sets ?? [])) {
      if (!finite(set.reps) || set.reps <= 0) {
        continue;
      }
      const values = [units.includes('TIME') ? `${set.reps / 1000} s` : `${set.reps} reps`];
      const native: StravaSet = { exercise_type: exerciseType };
      if (units.includes('TIME')) {
        native.duration = Math.max(1, Math.round(set.reps / 1000));
      } else {
        native.repetitions = Math.max(1, Math.round(set.reps));
      }
      if (finite(set.weight)) {
        values.push(`${catalogue.weightTypes[exercise.exerciseId] === 'ASSISTED_WEIGHT' ? 'assistance ' : ''}${set.weight} kg`);
        if (set.weight >= 0 && catalogue.weightTypes[exercise.exerciseId] !== 'ASSISTED_WEIGHT') {
          native.weight = set.weight;
        }
      }
      if (finite(set.rpe) && set.rpe > 0) {
        values.push(`RPE ${set.rpe}`);
      }
      const type = line(set.type, 100);
      if (type) {
        values.push(type.toLowerCase().replace(/_/g, ' '));
      }
      if (Array.isArray(set.bandWeights) && set.bandWeights.length > 0) {
        values.push(`bands: ${line(JSON.stringify(set.bandWeights), 50_000)}`);
      }
      if (finite(set.bodyweight) && set.bodyweight > 0) {
        values.push(`body weight ${set.bodyweight} kg`);
      }
      if (finite(set.timer) && set.timer > 0) {
        values.push(`timer ${set.timer / 1000} s`);
      }
      sets.push(`  ${sets.length + 1}. ${values.join(' · ')}`);
      nativeSets.push(native);
    }
    if (sets.length === 0) {
      continue;
    }
    exerciseCount++;
    setCount += sets.length;
    const kinds = [line(catalogue.weightTypes[exercise.exerciseId], 100), ...units.map((unit) => line(unit, 100))].filter(Boolean);
    exercises.push(`\n${exerciseCount}. ${exerciseName(catalogue, exercise.exerciseId)}${kinds.length > 0 ? ` (${kinds.join(', ')})` : ''}`);
    exercises.push(`Strava exercise: ${exerciseType}`);
    const exerciseNote = note(exercise.notes, 50_000);
    if (exerciseNote) {
      exercises.push(exerciseNote);
    }
    exercises.push(...sets);
  }
  if (setCount === 0) {
    return null;
  }
  if (!finite(workout.durationInMinutes) || !Number.isSafeInteger(Math.round(workout.durationInMinutes * 60)) || Math.round(workout.durationInMinutes * 60) < 1) {
    throw new StravaMappingError('the workout has no positive duration (required by Strava)');
  }
  rows.push(`Duration: ${workout.durationInMinutes} min`, `${exerciseCount} exercises, ${setCount} sets`);
  const workoutNote = note(workout.notes, 50_000);
  if (workoutNote) {
    rows.push('', workoutNote);
  }
  rows.push(...exercises);

  return {
    name: line(workout.name, MAX_TITLE) ?? 'SmartWorkout strength training',
    sport_type: 'WeightTraining',
    description: rows.join('\n'),
    file: {
      version: '1.0',
      // The form of Strava's example: whole seconds in UTC with a Z.
      start_time: new Date(Math.floor(workout.startedAt / 1000) * 1000).toISOString().replace('.000Z', 'Z'),
      utc_offset: Math.round((Date.parse(localStart(workout.startedAt, timezone).slice(0, 19) + 'Z') - Math.floor(workout.startedAt / 1000) * 1000) / 1000),
      elapsed_time: Math.round(workout.durationInMinutes * 60),
      creator: { name: 'Enduo SmartWorkout Agent' },
      sets: nativeSets,
    },
  };
}
