import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { catalogueIn } from '../src/mapping.ts';
import type { Catalogue, SwWorkout } from '../src/mapping.ts';
import { STRAVA_EXERCISES } from '../src/strava-exercises.ts';
import { localStart, StravaMappingError, stravaExercise, stravaExternalId, stravaMarker, toStravaActivity } from '../src/strava-mapping.ts';

const catalogue: Catalogue = {
  names: { bench: 'Barbell Bench Press', plank: 'Plank', assisted: 'Assisted Pull Up', custom: 'My custom exercise' },
  weightTypes: { bench: 'BARBELL', plank: 'BODYWEIGHT', assisted: 'ASSISTED_WEIGHT' },
};
const workout = (overrides: Partial<SwWorkout> = {}): SwWorkout => ({
  id: 'workout-1', startedAt: Date.UTC(2026, 10, 19, 12, 30), durationInMinutes: 60.5, name: 'Strength A', notes: 'Felt strong\nNext time: more weight',
  workoutExercises: [
    { exerciseId: 'plank', sequence: 2, units: ['TIME'], sets: [{ reps: 45_000 }] },
    { exerciseId: 'bench', sequence: 1, units: ['WEIGHT', 'REPS'], notes: 'Paused reps', sets: [
      { sequence: 2, reps: 5, weight: 80, rpe: 8.5, type: 'DROP_SET', bandWeights: [{ color: 'red', weight: 5 }], timer: 120000, bodyweight: 85.5 },
      { sequence: 1, reps: 10, weight: 40, type: 'WARMUP' },
    ] },
    { exerciseId: 'assisted', sequence: 3, units: ['REPS', 'WEIGHT'], sets: [{ reps: 8, weight: 20 }] },
    { exerciseId: 'custom', sequence: 4, units: ['REPS'], sets: [{ reps: 12, weight: 0 }] },
  ],
  ...overrides,
});
const marker = stravaMarker('account-1', 'workout-1');

describe('Strava JSON strength mapping', () => {
  it('exports ordered native sets and keeps the remaining source data in the description', () => {
    const mapped = toStravaActivity(workout(), catalogue, marker, 'Europe/Warsaw')!;

    assert.equal(mapped.name, 'Strength A');
    assert.equal(mapped.sport_type, 'WeightTraining');
    assert.deepEqual(mapped.file, {
      version: '1.0', start_time: '2026-11-19T12:30:00Z', utc_offset: 3600, elapsed_time: 3630,
      creator: { name: 'Enduo SmartWorkout Agent' },
      sets: [
        { exercise_type: 'BARBELL_BENCH_PRESS', repetitions: 10, weight: 40 },
        { exercise_type: 'BARBELL_BENCH_PRESS', repetitions: 5, weight: 80 },
        { exercise_type: 'PLANK_GENERIC', duration: 45 },
        { exercise_type: 'MACHINE_ASSISTED_PULL_UP', repetitions: 8 },
        { exercise_type: 'TOTAL_BODY_GENERIC', repetitions: 12, weight: 0 },
      ],
    });
    for (const text of [marker, 'Paused reps', 'Felt strong\nNext time: more weight', 'RPE 8.5', 'warmup', 'drop set', '"color":"red"', 'assistance 20 kg', 'body weight 85.5 kg', 'timer 120 s', 'My custom exercise']) {
      assert.ok(mapped.description.includes(text), text);
    }
    assert.equal('streams' in mapped.file, false);
    assert.equal('active_time' in mapped.file, false);
  });

  it('maps by English catalogue names even when exercise names are displayed in Polish', () => {
    const translated = catalogueIn({ translations: { plank: { en: 'Side Plank', pl: 'Deska bokiem' } }, weightTypes: {} }, ['pl']);
    const mapped = toStravaActivity(workout({ workoutExercises: [{ exerciseId: 'plank', units: ['TIME'], sets: [{ reps: 30000 }] }] }), translated, marker, 'UTC')!;

    assert.equal(mapped.file.sets[0]?.exercise_type, 'SIDE_PLANK');
    assert.ok(mapped.description.includes('Deska bokiem'));
  });

  it('recognizes documented exercise types and common app names without guessing custom movements', () => {
    for (const code of STRAVA_EXERCISES) {
      assert.equal(stravaExercise(code.replace(/_/g, ' ')), code, code);
    }
    assert.equal(stravaExercise('Bench Press (Barbell)'), 'BARBELL_BENCH_PRESS');
    assert.equal(stravaExercise('Bench Press', 'BARBELL'), 'BARBELL_BENCH_PRESS');
    assert.equal(stravaExercise('Dumbbell Curl'), 'STANDING_DUMBBELL_BICEPS_CURL');
    assert.equal(stravaExercise('Something I invented'), 'TOTAL_BODY_GENERIC');
    assert.equal(stravaExercise(undefined), 'TOTAL_BODY_GENERIC');
  });

  it('preserves source values without Enduo caps and omits invalid or incomplete sets', () => {
    const mapped = toStravaActivity(workout({ workoutExercises: [{ exerciseId: 'bench', sets: [{ reps: 0 }, { reps: 1200, weight: 700 }, { reps: NaN }] }] }), catalogue, marker, 'UTC')!;

    assert.deepEqual(mapped.file.sets, [{ exercise_type: 'BARBELL_BENCH_PRESS', repetitions: 1200, weight: 700 }]);
    assert.equal(toStravaActivity(workout({ workoutExercises: [] }), catalogue, marker, 'UTC'), null);
    for (const duration of [undefined, 0, -1, Infinity]) {
      assert.throws(() => toStravaActivity(workout({ durationInMinutes: duration }), catalogue, marker, 'UTC'), StravaMappingError);
    }
  });

  it('uses the UTC offset at the workout date, including DST and fractional time zones', () => {
    assert.equal(localStart(Date.UTC(2026, 0, 15, 12), 'Europe/Warsaw'), '2026-01-15T13:00:00+01:00');
    assert.equal(localStart(Date.UTC(2026, 6, 15, 12), 'Europe/Warsaw'), '2026-07-15T14:00:00+02:00');
    assert.equal(localStart(Date.UTC(2026, 0, 15, 12), 'Asia/Kathmandu'), '2026-01-15T17:45:00+05:45');
    assert.equal(toStravaActivity(workout({ startedAt: Date.UTC(2026, 6, 15, 12) }), catalogue, marker, 'Europe/Warsaw')?.file.utc_offset, 7200);
    assert.equal(toStravaActivity(workout(), catalogue, marker, 'America/New_York')?.file.utc_offset, -18000);
  });

  it('cleans text and derives stable public identifiers without exposing source account ids', () => {
    const mapped = toStravaActivity(workout({ name: ' Strength\u0000\nA ', notes: 'Note\u202e\u0007' }), catalogue, marker, 'UTC')!;

    assert.equal(mapped.name, 'Strength A');
    assert.equal(mapped.description.includes('\u202e'), false);
    assert.equal(marker.includes('account-1'), false);
    assert.equal(stravaMarker('account-1', 'workout-1'), marker);
    assert.notEqual(stravaMarker('account-2', 'workout-1'), marker);
    assert.match(stravaExternalId(marker), /^smartworkout-[a-f0-9]{64}\.json$/);
  });
});
