// A finished SmartWorkout workout → the arguments of Enduo's MCP tool `strength_session_log`.
// Pure functions only: everything they need comes in as arguments. Field meanings: docs/smartworkout-api.md.

import { line, note } from './text.ts';

export interface SwSet {
  id?: string;
  sequence?: number;
  weight?: number | null;
  type?: string | null;
  /** repetitions; for a TIME exercise the duration in milliseconds */
  reps?: number | null;
  rpe?: number | null;
  bandWeights?: unknown[] | null;
  timer?: number | null;
  bodyweight?: number | null;
}

export interface SwWorkoutExercise {
  exerciseId: string;
  sequence?: number;
  units?: string[] | null;
  notes?: string | null;
  sets?: SwSet[] | null;
}

export interface SwWorkout {
  id: string;
  /** ms since the epoch */
  startedAt: number;
  durationInMinutes?: number | null;
  name?: string | null;
  notes?: string | null;
  workoutExercises?: SwWorkoutExercise[] | null;
}

export interface EnduoSet {
  exercise: string;
  reps?: number;
  weight_kg?: number;
  duration_s?: number;
  rir?: number;
  is_warmup?: boolean;
  note?: string;
}

export interface EnduoSession {
  started_at: string;
  duration_s?: number;
  title?: string;
  note_md?: string;
  sets: EnduoSet[];
  idempotency_key: string;
}

export interface Catalogue {
  names: Record<string, string>;
  /** Canonical names for matching external exercise catalogues, independent of EXERCISE_LANGUAGE. */
  englishNames?: Record<string, string>;
  weightTypes: Record<string, string>;
}

/** Limits of strength_session_log (StrengthSessionInput / StrengthSetInput in enduo-api). */
const MAX_SETS = 300;
const MAX_REPS = 1000;
const MAX_WEIGHT_KG = 600;
const MAX_SET_DURATION_S = 7200;
const MIN_SESSION_S = 60;
const MAX_SESSION_S = 21_600;

/**
 * Text of SmartWorkout is cut to what a name or a note plausibly needs, well inside what strength_session_log
 * takes (exercise 200, title 300, note of a set 2000, note of the session 50 000 characters): the coach, a
 * language model, reads it later, and a longer text there is more likely an accident or an abuse than a note.
 */
export const MAX_EXERCISE_NAME = 120;
export const MAX_TITLE = 120;
export const MAX_EXERCISE_NOTE = 300;
export const MAX_SET_NOTE = 500;
export const MAX_SESSION_NOTE = 2000;
/** The id of a workout goes into the idempotency key (200 characters) and into the state. */
const MAX_ID = 150;

export const byOrder = <T extends { sequence?: number }>(items: T[]): T[] =>
  items.map((item, index) => ({ item, index })).sort((a, b) => (a.item.sequence ?? a.index) - (b.item.sequence ?? b.index) || a.index - b.index).map(({ item }) => item);

/** ISO 8601 with an offset and without fractions: the format strength_session_log validates (DATE_ATOM). */
export function atom(ms: number): string {
  return new Date(Math.floor(ms / 1000) * 1000).toISOString().replace('.000Z', '+00:00');
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const isList = (value: unknown): value is unknown[] | null | undefined => value === null || value === undefined || Array.isArray(value);

/**
 * What keeps a workout of the change log from being read, or null when it has the shape toSession needs. The
 * answer names the field, never what is in it.
 */
export function problemWith(workout: unknown): string | null {
  if (!isObject(workout)) {
    return 'it is not an object';
  }
  if (typeof workout.id !== 'string' || workout.id === '' || workout.id.length > MAX_ID) {
    return 'it has no usable id';
  }
  if (typeof workout.startedAt !== 'number' || !Number.isFinite(workout.startedAt) || workout.startedAt <= 0 || workout.startedAt > 8.64e15) {
    return 'its start is not a time';
  }
  if (!isList(workout.workoutExercises)) {
    return 'its exercises are not a list';
  }
  for (const exercise of workout.workoutExercises ?? []) {
    if (!isObject(exercise) || typeof exercise.exerciseId !== 'string' || exercise.exerciseId === '') {
      return 'one of its exercises has no id';
    }
    if (!isList(exercise.sets) || (exercise.sets ?? []).some((set) => !isObject(set))) {
      return 'the sets of one of its exercises cannot be read';
    }
  }

  return null;
}

/**
 * The name of an exercise in the first of `languages` it has ("pt" also takes "pt-BR"), else in English, else in
 * any language. SmartWorkout names its catalogue in English; an exercise the athlete added carries the language
 * the app was in.
 */
export function pickName(translations: Record<string, string>, languages: string[]): string | undefined {
  const entries = Object.entries(translations).map(([language, name]) => [language.toLowerCase(), name.trim()] as const).filter(([, name]) => name !== '');
  for (const wanted of [...languages, 'en']) {
    const found = entries.find(([language]) => language === wanted) ?? entries.find(([language]) => language.split('-')[0] === wanted.split('-')[0]);
    if (found) {
      return found[1];
    }
  }

  return entries[0]?.[1];
}

/** The catalogue in the languages the athlete wants. */
export function catalogueIn(cache: { translations: Record<string, Record<string, string>>; weightTypes: Record<string, string> }, languages: string[]): Catalogue {
  const names: Record<string, string> = {};
  const englishNames: Record<string, string> = {};
  for (const [id, translations] of Object.entries(cache.translations)) {
    const name = pickName(translations, languages);
    if (name !== undefined) {
      names[id] = name;
    }
    const english = Object.entries(translations).find(([language]) => language.toLowerCase() === 'en')?.[1];
    if (typeof english === 'string' && english.trim() !== '') {
      englishNames[id] = english.trim();
    }
  }

  return { names, englishNames, weightTypes: cache.weightTypes };
}

/** Name Enduo sees: the name from the catalogue in the wanted language; an exercise missing from it keeps its id visible. */
export function exerciseName(catalogue: Catalogue, exerciseId: string): string {
  return line(catalogue.names[exerciseId], MAX_EXERCISE_NAME) ?? line(`SmartWorkout exercise ${exerciseId}`, MAX_EXERCISE_NAME) ?? 'SmartWorkout exercise';
}

/** A count SmartWorkout sent (repetitions, milliseconds); 0 when it is not a number. */
const count = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0);

function mapSet(set: SwSet, exercise: SwWorkoutExercise, name: string, weightType: string | undefined): EnduoSet | null {
  const units = Array.isArray(exercise.units) ? exercise.units : [];
  const out: EnduoSet = { exercise: name };
  const notes: string[] = [];

  if (units.includes('TIME')) {
    const seconds = Math.round(count(set.reps) / 1000);
    if (seconds < 1) {
      return null;
    }
    out.duration_s = Math.min(seconds, MAX_SET_DURATION_S);
  } else {
    const reps = Math.round(count(set.reps));
    if (reps < 1) {
      return null;
    }
    out.reps = Math.min(reps, MAX_REPS);
  }

  const weight = typeof set.weight === 'number' && Number.isFinite(set.weight) ? set.weight : 0;
  if (weight > 0) {
    if (weightType === 'ASSISTED_WEIGHT') {
      // SmartWorkout's weight is the assistance here, not a load: Enduo would count it as one.
      notes.push(`assistance ${weight} kg`);
    } else {
      out.weight_kg = Math.min(weight, MAX_WEIGHT_KG);
    }
  }
  if (Array.isArray(set.bandWeights) && set.bandWeights.length > 0) {
    const bands = line(set.bandWeights.map((band) => (typeof band === 'object' ? JSON.stringify(band) : String(band))).join(', '), 100);
    if (bands) {
      notes.push(`bands: ${bands}`);
    }
  }

  if (typeof set.rpe === 'number' && Number.isFinite(set.rpe) && set.rpe > 0) {
    out.rir = Math.max(0, Math.min(9.5, 10 - set.rpe));
  }
  const type = (line(set.type, 40) ?? 'NORMAL').toUpperCase();
  if (/warm/i.test(type)) {
    out.is_warmup = true;
  }
  if (type !== 'NORMAL' && out.is_warmup !== true) {
    notes.push(type.toLowerCase().replace(/_/g, ' '));
  }
  if (notes.length > 0) {
    out.note = notes.join('; ');
  }

  return out;
}

/**
 * The call for one workout, or null when it has no set worth sending (an empty or aborted workout).
 * `revision` is SmartWorkout's serverRevision: an edited workout gets a new idempotency key and is sent again,
 * and strength_session_log replaces the sets it sent before.
 */
export function toSession(workout: SwWorkout, revision: number, catalogue: Catalogue): EnduoSession | null {
  const sets: EnduoSet[] = [];
  for (const exercise of byOrder(workout.workoutExercises ?? [])) {
    const name = exerciseName(catalogue, exercise.exerciseId);
    const exerciseNote = line(exercise.notes, MAX_EXERCISE_NOTE);
    let first = true;
    for (const set of byOrder(exercise.sets ?? [])) {
      const mapped = mapSet(set, exercise, name, catalogue.weightTypes[exercise.exerciseId]);
      if (mapped === null) {
        continue;
      }
      if (first && exerciseNote) {
        mapped.note = mapped.note ? `${exerciseNote}; ${mapped.note}` : exerciseNote;
      }
      const setNote = line(mapped.note, MAX_SET_NOTE);
      if (setNote) {
        mapped.note = setNote;
      } else {
        delete mapped.note;
      }
      first = false;
      sets.push(mapped);
    }
  }
  if (sets.length === 0) {
    return null;
  }

  const session: EnduoSession = {
    started_at: atom(workout.startedAt),
    sets: sets.slice(0, MAX_SETS),
    idempotency_key: `smartworkout:${workout.id}:${revision}`,
  };
  const seconds = Math.round(count(workout.durationInMinutes) * 60);
  if (seconds >= MIN_SESSION_S) {
    session.duration_s = Math.min(seconds, MAX_SESSION_S);
  }
  const title = line(workout.name, MAX_TITLE);
  if (title) {
    session.title = title;
  }
  const sessionNote = note(workout.notes, MAX_SESSION_NOTE);
  if (sessionNote) {
    session.note_md = sessionNote;
  }

  return session;
}

/** Exercise ids of a workout the catalogue does not know (an exercise the athlete added since it was cached). */
export function unknownExercises(workout: SwWorkout, catalogue: Catalogue): string[] {
  return (workout.workoutExercises ?? []).map((exercise) => exercise.exerciseId).filter((id) => !(id in catalogue.names));
}
