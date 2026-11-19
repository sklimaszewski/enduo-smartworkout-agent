import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { atom, catalogueIn, MAX_EXERCISE_NAME, MAX_SESSION_NOTE, MAX_SET_NOTE, MAX_TITLE, pickName, problemWith, toSession, unknownExercises } from '../src/mapping.ts';
import type { Catalogue, SwWorkout } from '../src/mapping.ts';
import { latestByWorkout } from '../src/sync.ts';
import type { SwChange } from '../src/smartworkout.ts';

const catalogue: Catalogue = {
  names: { bench: 'Barbell Bench Press', plank: 'Plank', pullup: 'Assisted Pull Up', curl: 'Dumbbell Curl' },
  weightTypes: { bench: 'BARBELL', plank: 'BODYWEIGHT', pullup: 'ASSISTED_WEIGHT', curl: 'DUMBBELL' },
};

const set = (sequence: number, weight: number, reps: number, extra: Record<string, unknown> = {}) => ({
  id: `set-${sequence}`,
  sequence,
  weight,
  reps,
  type: 'NORMAL',
  rpe: null,
  timer: 120000,
  bandWeights: [],
  bodyweight: 85.5,
  ...extra,
});

const workout = (overrides: Partial<SwWorkout> = {}): SwWorkout => ({
  id: 'w-1',
  startedAt: Date.UTC(2026, 10, 13, 14, 35, 12, 456),
  durationInMinutes: 74,
  name: 'PULL B',
  notes: 'Felt strong',
  workoutExercises: [
    { exerciseId: 'curl', sequence: 1, units: ['WEIGHT', 'REPS'], notes: null, sets: [set(2, 15, 10), set(1, 15, 12)] },
    { exerciseId: 'bench', sequence: 0, units: ['WEIGHT', 'REPS'], notes: 'paused reps', sets: [set(1, 95, 6), set(2, 85, 8)] },
  ],
  ...overrides,
});

describe('toSession', () => {
  it('maps a workout to strength_session_log in the order of exercises and sets', () => {
    const session = toSession(workout(), 3, catalogue);

    assert.deepEqual(session, {
      started_at: '2026-11-13T14:35:12+00:00',
      duration_s: 4440,
      title: 'PULL B',
      note_md: 'Felt strong',
      idempotency_key: 'smartworkout:w-1:3',
      sets: [
        { exercise: 'Barbell Bench Press', reps: 6, weight_kg: 95, note: 'paused reps' },
        { exercise: 'Barbell Bench Press', reps: 8, weight_kg: 85 },
        { exercise: 'Dumbbell Curl', reps: 12, weight_kg: 15 },
        { exercise: 'Dumbbell Curl', reps: 10, weight_kg: 15 },
      ],
    });
  });

  it('reads the duration of a timed set from reps in milliseconds', () => {
    const session = toSession(workout({ workoutExercises: [{ exerciseId: 'plank', units: ['TIME'], sets: [set(1, 0, 45000)] }] }), 1, catalogue);

    assert.deepEqual(session?.sets, [{ exercise: 'Plank', duration_s: 45 }]);
  });

  it('turns RPE into RIR and marks warm-up sets', () => {
    const session = toSession(
      workout({ workoutExercises: [{ exerciseId: 'bench', units: ['WEIGHT', 'REPS'], sets: [set(1, 60, 10, { type: 'WARMUP' }), set(2, 100, 5, { rpe: 8.5 })] }] }),
      1,
      catalogue,
    );

    assert.deepEqual(session?.sets, [
      { exercise: 'Barbell Bench Press', reps: 10, weight_kg: 60, is_warmup: true },
      { exercise: 'Barbell Bench Press', reps: 5, weight_kg: 100, rir: 1.5 },
    ]);
  });

  it('keeps assistance out of the load and leaves other set types in the note', () => {
    const session = toSession(
      workout({ workoutExercises: [{ exerciseId: 'pullup', units: ['WEIGHT', 'REPS'], sets: [set(1, 20, 8), set(2, 0, 6, { type: 'DROP_SET' })] }] }),
      1,
      catalogue,
    );

    assert.deepEqual(session?.sets, [
      { exercise: 'Assisted Pull Up', reps: 8, note: 'assistance 20 kg' },
      { exercise: 'Assisted Pull Up', reps: 6, note: 'drop set' },
    ]);
  });

  it('leaves out a duration under a minute and sets without reps', () => {
    const session = toSession(
      workout({ durationInMinutes: 0, notes: '  ', workoutExercises: [{ exerciseId: 'bench', units: ['WEIGHT', 'REPS'], sets: [set(1, 95, 0), set(2, 95, 5)] }] }),
      1,
      catalogue,
    );

    assert.equal(session?.duration_s, undefined);
    assert.equal(session?.note_md, undefined);
    assert.equal(session?.sets.length, 1);
  });

  it('sends nothing for a workout without a completed set', () => {
    assert.equal(toSession(workout({ workoutExercises: [{ exerciseId: 'bench', units: ['WEIGHT', 'REPS'], sets: [set(1, 95, 0)] }] }), 1, catalogue), null);
  });

  it('names an exercise missing from the catalogue by its id and reports it', () => {
    const custom = workout({ workoutExercises: [{ exerciseId: 'mine', units: ['REPS'], sets: [set(1, 0, 10)] }] });

    assert.deepEqual(unknownExercises(custom, catalogue), ['mine']);
    assert.deepEqual(toSession(custom, 1, catalogue)?.sets, [{ exercise: 'SmartWorkout exercise mine', reps: 10 }]);
  });
});

describe('text of SmartWorkout', () => {
  const length = (text: string | undefined): number => Array.from(text ?? '').length;

  it('is cleaned of control characters and extra whitespace before it is sent', () => {
    const session = toSession(
      workout({
        name: ' PULL\tB\u0000\n',
        notes: 'Felt strong.\r\n\r\n\r\n\u001b[2JNext:   more\u0007 weight',
        workoutExercises: [{ exerciseId: 'mine\u0000\n2', units: ['REPS'], notes: 'slow\n\tnegatives', sets: [set(1, 0, 10, { type: 'DROP_SET\n' })] }],
      }),
      1,
      catalogue,
    );

    assert.equal(session?.title, 'PULL B');
    assert.equal(session?.note_md, 'Felt strong.\n\n[2JNext: more weight');
    assert.deepEqual(session?.sets, [{ exercise: 'SmartWorkout exercise mine 2', reps: 10, note: 'slow negatives; drop set' }]);
  });

  it('is cut to what a name or a note needs, with an ellipsis, inside the limits of Enduo', () => {
    const long = 'lorem ipsum '.repeat(10_000);
    const session = toSession(
      workout({
        name: long,
        notes: long,
        workoutExercises: [{ exerciseId: 'long', units: ['REPS'], notes: long, sets: [set(1, 0, 10, { type: long, bandWeights: [{ text: long }] })] }],
      }),
      1,
      { names: { long }, weightTypes: {} },
    );

    for (const [text, max] of [
      [session?.title, MAX_TITLE],
      [session?.note_md, MAX_SESSION_NOTE],
      [session?.sets[0]?.exercise, MAX_EXERCISE_NAME],
      [session?.sets[0]?.note, MAX_SET_NOTE],
    ] as const) {
      assert.equal(length(text) > max - 60 && length(text) <= max, true, `${length(text)} of ${max}`);
      assert.equal(text?.startsWith('lorem ipsum'), true);
    }
    assert.equal(session?.note_md?.endsWith('…'), true);
    assert.equal(session?.sets[0]?.exercise.endsWith('…'), true);
    assert.equal(MAX_EXERCISE_NAME <= 200 && MAX_TITLE <= 300 && MAX_SET_NOTE <= 2000 && MAX_SESSION_NOTE <= 50_000, true);
  });

  it('never makes a workout unreadable: odd values are left out', () => {
    const session = toSession(
      workout({
        name: 42 as unknown as string,
        notes: { text: 'x' } as unknown as string,
        durationInMinutes: 'long' as unknown as number,
        workoutExercises: [
          { exerciseId: 'bench', units: 'REPS' as unknown as string[], notes: 7 as unknown as string, sets: [set(1, 'heavy' as unknown as number, 5, { type: 9, rpe: 'hard', bandWeights: 'red' })] },
        ],
      }),
      1,
      catalogue,
    );

    assert.deepEqual(session, { started_at: '2026-11-13T14:35:12+00:00', idempotency_key: 'smartworkout:w-1:1', sets: [{ exercise: 'Barbell Bench Press', reps: 5 }] });
  });
});

describe('problemWith', () => {
  it('finds nothing in a workout as SmartWorkout sends it', () => {
    assert.equal(problemWith(workout()), null);
    assert.equal(problemWith(workout({ workoutExercises: null })), null);
  });

  it('names what keeps a workout from being read, never its content', () => {
    assert.equal(problemWith('SECRET'), 'it is not an object');
    assert.equal(problemWith(workout({ id: '' })), 'it has no usable id');
    assert.equal(problemWith(workout({ id: 'x'.repeat(500) })), 'it has no usable id');
    assert.equal(problemWith(workout({ startedAt: Number.NaN })), 'its start is not a time');
    assert.equal(problemWith(workout({ startedAt: 1e300 })), 'its start is not a time');
    assert.equal(problemWith({ ...workout(), workoutExercises: 'SECRET' }), 'its exercises are not a list');
    assert.equal(problemWith({ ...workout(), workoutExercises: [{ sets: [] }] }), 'one of its exercises has no id');
    assert.equal(problemWith({ ...workout(), workoutExercises: [{ exerciseId: 'bench', sets: [null] }] }), 'the sets of one of its exercises cannot be read');
  });
});

describe('pickName', () => {
  it('takes the first wanted language the exercise has', () => {
    assert.equal(pickName({ en: 'Plank', pl: 'Deska' }, ['pl', 'en']), 'Deska');
    assert.equal(pickName({ en: 'Plank', pl: 'Deska' }, ['de', 'pl']), 'Deska');
  });

  it('matches a regional variant by its language', () => {
    assert.equal(pickName({ en: 'Plank', 'pt-BR': 'Prancha' }, ['pt']), 'Prancha');
    assert.equal(pickName({ en: 'Plank', PT: 'Prancha' }, ['pt-br']), 'Prancha');
  });

  it('falls back to English, then to any name the exercise has', () => {
    assert.equal(pickName({ en: 'Plank' }, ['pl']), 'Plank');
    assert.equal(pickName({ pl: 'Odwodzenie ramion' }, ['en']), 'Odwodzenie ramion');
    assert.equal(pickName({ en: '  ' }, ['en']), undefined);
  });
});

describe('catalogueIn', () => {
  it('names every exercise in the wanted language and keeps the load types', () => {
    const catalogue = catalogueIn({ translations: { a: { en: 'Plank', pl: 'Deska' }, b: { en: 'Dumbbell Curl' } }, weightTypes: { b: 'DUMBBELL' } }, ['pl']);

    assert.deepEqual(catalogue, { names: { a: 'Deska', b: 'Dumbbell Curl' }, englishNames: { a: 'Plank', b: 'Dumbbell Curl' }, weightTypes: { b: 'DUMBBELL' } });
  });
});

describe('atom', () => {
  it('drops milliseconds and writes the offset', () => {
    assert.equal(atom(Date.UTC(2026, 0, 2, 3, 4, 5, 999)), '2026-01-02T03:04:05+00:00');
  });
});

describe('latestByWorkout', () => {
  const change = (sequence: number, workoutId: string, startedAt: number, operation = 'upsert'): SwChange => ({
    sequence,
    workoutId,
    operation,
    serverRevision: sequence,
    changedAtMs: 0,
    workout: operation === 'upsert' ? workout({ id: workoutId, startedAt }) : null,
  });

  it('keeps the newest change of each workout, ordered by start', () => {
    const latest = latestByWorkout([change(3, 'b', 200), change(1, 'a', 300), change(2, 'b', 200), change(4, 'c', 100, 'delete')]);

    assert.deepEqual(
      latest.map((item) => [item.workoutId, item.sequence]),
      [
        ['c', 4],
        ['b', 3],
        ['a', 1],
      ],
    );
  });
});
