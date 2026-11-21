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
  it('exports ordered native sets and no description', () => {
    const mapped = toStravaActivity(workout(), catalogue, 'Europe/Warsaw')!;

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
    // Neither the source id nor any detail of the workout goes into a description.
    assert.equal('description' in mapped, false);
    assert.equal('streams' in mapped.file, false);
    assert.equal('active_time' in mapped.file, false);
  });

  it('maps by English catalogue names even when exercise names are displayed in Polish', () => {
    const translated = catalogueIn({ translations: { plank: { en: 'Side Plank', pl: 'Deska bokiem' } }, weightTypes: {} }, ['pl']);
    const mapped = toStravaActivity(workout({ workoutExercises: [{ exerciseId: 'plank', units: ['TIME'], sets: [{ reps: 30000 }] }] }), translated, 'UTC')!;

    assert.equal(mapped.file.sets[0]?.exercise_type, 'SIDE_PLANK');
  });

  it('recognizes documented exercise types and common app names without guessing custom movements', () => {
    for (const code of STRAVA_EXERCISES) {
      assert.equal(stravaExercise(code.replace(/_/g, ' ')), code, code);
    }
    assert.equal(stravaExercise('Bench Press (Barbell)'), 'BARBELL_BENCH_PRESS');
    assert.equal(stravaExercise('Bench Press', 'BARBELL'), 'BARBELL_BENCH_PRESS');
    assert.equal(stravaExercise('Dumbbell Curl'), 'STANDING_DUMBBELL_BICEPS_CURL');
    assert.equal(stravaExercise('Wide Grip Lat Pulldown'), 'LAT_PULLDOWN');
    assert.equal(stravaExercise('Dumbbell Bent Over Row'), 'BENT_OVER_DUMBBELL_ROW');
    assert.equal(stravaExercise('Machine Reverse Flyes'), 'MACHINE_REAR_DELT_REVERSE_FLY');
    assert.equal(stravaExercise('Dumbbell Bulgarian Squat'), 'DUMBBELL_BULGARIAN_SPLIT_SQUATS');
    for (const [name, code] of [
      ['One-Arm Cable Lateral Raise', 'CABLE_LATERAL_RAISE'], ['Rope Triceps Pushdown', 'CABLE_TRICEPS_PUSHDOWN'],
      ['Kneeling Cable Abs Crunches', 'CABLE_CRUNCH'], ['Dumbbell Neutral Grip Incline Bench Row', 'CHEST_SUPPORTED_ROW'],
      ['One-Arm Cable Row', 'SEATED_CABLE_ROW'], ['Cable Face Pull', 'FACE_PULL'], ['Smith Calf Raises', 'STANDING_CALF_RAISE'],
      ['Close Grip Bench Press', 'CLOSE_GRIP_BARBELL_BENCH_PRESS'], ['Plate-Loaded Chest Press', 'MACHINE_CHEST_PRESS'],
      ['Seated Arnold Dumbbell Press', 'ARNOLD_PRESS'], ['Hanging Straight Leg Raise', 'HANGING_LEG_RAISE'],
    ]) {
      assert.equal(stravaExercise(name), code, name);
    }
    assert.equal(stravaExercise('Something I invented'), 'TOTAL_BODY_GENERIC');
    assert.equal(stravaExercise(undefined), 'TOTAL_BODY_GENERIC');
  });

  it('falls back to the generic type of the movement a name tells, and only then to the whole body', () => {
    for (const [name, code] of [
      ['Landmine Meadows Row Variation', 'ROW_GENERIC'], ['Single Leg Machine Calf Press Thing', 'CALF_RAISE_GENERIC'],
      ['Cable Y Lateral Raises', 'LATERAL_RAISE_GENERIC'], ['Weighted Triceps Dips on Bench', 'TRICEPS_EXTENSION_GENERIC'],
      ['Seated Leg Curls Single', 'LEG_CURL_GENERIC'], ['Spider Curls', 'CURL_GENERIC'], ['Pec Deck Flyes', 'FLYE_GENERIC'],
      ['Wide Neutral Pull-Downs', 'LAT_PULLDOWN'], ['Weighted Chin-Ups', 'PULL_UP_GENERIC'], ['Captain Chair Knee Raises', 'LEG_RAISE_GENERIC'],
      ['Hack Machine Squats', 'SQUAT_GENERIC'], ['Incline Smith Bench Press', 'BENCH_PRESS_GENERIC'], ['Banded Shrugs', 'SHRUG_GENERIC'],
      ['Rowing Erg', 'TOTAL_BODY_GENERIC'], ['Curling Stone Throw', 'TOTAL_BODY_GENERIC'],
    ]) {
      const type = stravaExercise(name);
      assert.equal(type, code, name);
      assert.ok(STRAVA_EXERCISES.has(type), type);
    }
  });

  it('preserves source values without Enduo caps and omits invalid or incomplete sets', () => {
    const mapped = toStravaActivity(workout({ workoutExercises: [{ exerciseId: 'bench', sets: [{ reps: 0 }, { reps: 1200, weight: 700 }, { reps: NaN }] }] }), catalogue, 'UTC')!;

    assert.deepEqual(mapped.file.sets, [{ exercise_type: 'BARBELL_BENCH_PRESS', repetitions: 1200, weight: 700 }]);
    assert.equal(toStravaActivity(workout({ workoutExercises: [] }), catalogue, 'UTC'), null);
    for (const duration of [undefined, 0, -1, Infinity]) {
      assert.throws(() => toStravaActivity(workout({ durationInMinutes: duration }), catalogue, 'UTC'), StravaMappingError);
    }
  });

  it('uses the UTC offset at the workout date, including DST and fractional time zones', () => {
    assert.equal(localStart(Date.UTC(2026, 0, 15, 12), 'Europe/Warsaw'), '2026-01-15T13:00:00+01:00');
    assert.equal(localStart(Date.UTC(2026, 6, 15, 12), 'Europe/Warsaw'), '2026-07-15T14:00:00+02:00');
    assert.equal(localStart(Date.UTC(2026, 0, 15, 12), 'Asia/Kathmandu'), '2026-01-15T17:45:00+05:45');
    assert.equal(toStravaActivity(workout({ startedAt: Date.UTC(2026, 6, 15, 12) }), catalogue, 'Europe/Warsaw')?.file.utc_offset, 7200);
    assert.equal(toStravaActivity(workout(), catalogue, 'America/New_York')?.file.utc_offset, -18000);
  });

  it('cleans text and derives stable public identifiers without exposing source account ids', () => {
    const mapped = toStravaActivity(workout({ name: ' Strength\u0000\nA ', notes: 'Note\u202e\u0007' }), catalogue, 'UTC')!;

    assert.equal(mapped.name, 'Strength A');
    assert.equal(marker.includes('account-1'), false);
    assert.equal(stravaMarker('account-1', 'workout-1'), marker);
    assert.notEqual(stravaMarker('account-2', 'workout-1'), marker);
    assert.match(stravaExternalId(marker), /^smartworkout-[a-f0-9]{64}\.json$/);
  });
});
