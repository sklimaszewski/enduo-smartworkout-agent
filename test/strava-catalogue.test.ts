import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it, mock } from 'node:test';

import { loadConfig } from '../src/config.ts';
import type { Catalogue, SwWorkout } from '../src/mapping.ts';
import { SmartWorkout } from '../src/smartworkout.ts';
import { Store } from '../src/store.ts';
import { STRAVA_EXERCISE_BY_ID } from '../src/strava-catalogue.ts';
import { STRAVA_EXERCISES } from '../src/strava-exercises.ts';
import { catalogueGaps, stravaExerciseOf, toStravaActivity } from '../src/strava-mapping.ts';

// Barbell Bench Press in SmartWorkout's catalogue.
const BENCH = 'dba6c9ac-e99c-4486-5c88-7ff4403c4608';

describe('Strava table of the SmartWorkout catalogue', () => {
  afterEach(() => mock.restoreAll());

  it('holds only documented Strava types, for ids of the catalogue', () => {
    const entries = Object.entries(STRAVA_EXERCISE_BY_ID);
    assert.ok(entries.length > 1000);
    for (const [id, type] of entries) {
      assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, id);
      assert.ok(STRAVA_EXERCISES.has(type), `${id}: ${type}`);
    }
    assert.equal(STRAVA_EXERCISE_BY_ID[BENCH], 'BARBELL_BENCH_PRESS');
  });

  it('takes the type of a catalogue exercise from the table, whatever its name, and matches other exercises by name', () => {
    assert.equal(stravaExerciseOf(BENCH, 'Wyciskanie sztangi leżąc'), 'BARBELL_BENCH_PRESS');
    assert.equal(stravaExerciseOf('own-exercise', 'Seated Cable Row'), 'SEATED_CABLE_ROW');
    assert.equal(stravaExerciseOf('own-exercise', 'Something I invented'), 'TOTAL_BODY_GENERIC');
    for (const id of ['__proto__', 'constructor', 'toString']) {
      assert.equal(stravaExerciseOf(id, undefined), 'TOTAL_BODY_GENERIC', id);
    }

    const catalogue: Catalogue = { names: { [BENCH]: 'Wyciskanie sztangi leżąc' }, weightTypes: { [BENCH]: 'BARBELL' } };
    const workout: SwWorkout = { id: 'w', startedAt: Date.UTC(2026, 10, 19, 12), durationInMinutes: 30, workoutExercises: [{ exerciseId: BENCH, units: ['WEIGHT', 'REPS'], sets: [{ reps: 5, weight: 80 }] }] };
    assert.deepEqual(toStravaActivity(workout, catalogue, 'UTC')?.file.sets, [{ exercise_type: 'BARBELL_BENCH_PRESS', repetitions: 5, weight: 80 }]);
  });

  it('reports public exercises the table lacks, an athlete\'s own exercises and ids that left the catalogue', () => {
    const gaps = catalogueGaps([
      { id: BENCH, name: 'Barbell Bench Press', weightType: 'BARBELL', isPublic: true },
      { id: 'new-public', name: 'Seated Cable Row', weightType: 'MACHINE', isPublic: true },
      { id: 'own', name: 'My own row', weightType: null, isPublic: false },
    ]);

    assert.deepEqual(gaps.missing, [{ id: 'new-public', name: 'Seated Cable Row', type: 'SEATED_CABLE_ROW' }]);
    assert.deepEqual(gaps.own, [{ id: 'own', name: 'My own row', type: 'ROW_GENERIC' }]);
    assert.equal(gaps.stale.length, Object.keys(STRAVA_EXERCISE_BY_ID).length - 1);
    assert.equal(gaps.stale.includes(BENCH), false);
  });

  it('reads the whole catalogue with English names first and without caching it', async () => {
    const config = loadConfig({ STATE_DIR: mkdtempSync(join(tmpdir(), 'smartworkout-catalogue-')) });
    const store = new Store(config);
    store.saveSmartworkout({ accessToken: 'ACCESS', refreshToken: 'REFRESH', expiresAt: Date.now() + 60 * 86_400_000, savedAt: new Date().toISOString() });
    let calls = 0;
    mock.method(globalThis, 'fetch', async (url: string) => {
      calls++;
      assert.equal(url, 'https://api.smartworkout.app/Exercise');
      return Response.json([
        { id: 'a', translations: { pl: 'Wiosłowanie', en: 'Row' }, weightType: 'BARBELL', isPublic: true },
        { id: 'b', translations: { pl: 'Odwodzenie ramion' }, isPublic: false },
        { translations: { en: 'No id' } },
      ]);
    });
    try {
      const smartworkout = new SmartWorkout(config, store);
      assert.deepEqual(await smartworkout.catalogue(), [
        { id: 'a', name: 'Row', weightType: 'BARBELL', isPublic: true },
        { id: 'b', name: 'Odwodzenie ramion', weightType: null, isPublic: false },
      ]);
      await smartworkout.catalogue();
      assert.equal(calls, 2);
    } finally {
      rmSync(config.stateDir, { recursive: true, force: true });
    }
  });
});
