import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { loadConfig } from '../src/config.ts';
import type { Config } from '../src/config.ts';
import { EnduoError } from '../src/enduo.ts';
import type { SwWorkout } from '../src/mapping.ts';
import { runTargets } from '../src/runner.ts';
import type { SwChange, SwSyncPage } from '../src/smartworkout.ts';
import { Store } from '../src/store.ts';
import { StravaActivityError, StravaAuthError, StravaError } from '../src/strava.ts';
import type { StravaUpload } from '../src/strava.ts';
import type { StravaActivity } from '../src/strava-mapping.ts';
import { runStravaPass } from '../src/strava-sync.ts';
import type { StravaActivities } from '../src/strava-sync.ts';
import type { EnduoTools, WorkoutSource } from '../src/sync.ts';

class Source implements WorkoutSource {
  accountId = 'sw-1';
  changes: SwChange[] = [];
  stuck = false;
  resync = false;
  async account(): Promise<string> { return this.accountId; }
  async exercises() { return { translations: { bench: { en: 'Barbell Bench Press' } }, weightTypes: { bench: 'BARBELL' } }; }
  async workoutChanges(_client: string, cursor: number): Promise<SwSyncPage> {
    if (this.resync && cursor > 0) {
      return { changes: [], nextCursor: 0, hasMore: false, serverEpoch: null, requiresFullSnapshot: true };
    }
    return { changes: this.changes.slice(cursor), nextCursor: this.stuck ? cursor : this.changes.length, hasMore: this.stuck, serverEpoch: 'epoch', requiresFullSnapshot: false };
  }
  add(id: string, revision = 1, overrides: Partial<SwWorkout> = {}): void {
    const workout: SwWorkout = {
      id, startedAt: Date.now() + 1000, durationInMinutes: 60, name: 'PRIVATE_WORKOUT', notes: 'PRIVATE_NOTE',
      workoutExercises: [{ exerciseId: 'bench', units: ['REPS', 'WEIGHT'], sets: [{ reps: 5, weight: 80 }] }], ...overrides,
    };
    this.changes.push({ sequence: this.changes.length + 1, workoutId: id, operation: 'upsert', serverRevision: revision, changedAtMs: Date.now(), workout });
  }
}

class Destination implements StravaActivities {
  accountId = 'strava-1';
  failure: Error | null = null;
  creates: Array<{ activity: StravaActivity; marker: string }> = [];
  updates: string[] = [];
  polls: string[] = [];
  existing = new Map<string, string>();
  processing = false;
  loseResponse = false;
  refuse = new Set<string>();
  uploadResult: StravaUpload | null = null;
  async account(): Promise<string> {
    if (this.failure) { throw this.failure; }
    return this.accountId;
  }
  async findActivity(marker: string): Promise<string | null> { return this.existing.get(marker) ?? null; }
  async createUpload(activity: StravaActivity, marker: string): Promise<StravaUpload> {
    if (this.refuse.has(activity.name)) { throw new StravaActivityError('Strava refused this activity (422).'); }
    this.creates.push({ activity, marker });
    const id = String(this.creates.length);
    if (this.loseResponse) {
      this.existing.set(marker, id);
      this.loseResponse = false;
      throw new StravaError('Strava is not reachable.');
    }
    return { id: `upload-${id}`, activityId: this.processing ? null : id, failed: false, duplicate: false };
  }
  async getUpload(id: string): Promise<StravaUpload> {
    this.polls.push(id);
    return this.uploadResult ?? { id, activityId: this.processing ? null : id.replace('upload-', ''), failed: false, duplicate: false };
  }
  async updateActivity(id: string): Promise<void> { this.updates.push(id); }
}

describe('Strava sync', () => {
  let config: Config;
  let store: Store;
  let source: Source;
  let target: Destination;
  let logs: string[];
  const pass = (dryRun = false) => runStravaPass(config, store, source, target, { log: (line) => logs.push(line), dryRun });
  const state = () => store.read<any>('strava-sync.json')!;

  beforeEach(() => {
    config = loadConfig({ STATE_DIR: mkdtempSync(join(tmpdir(), 'smartworkout-strava-sync-')), STRAVA_ENABLED: 'true', STRAVA_CLIENT_ID: '123' });
    store = new Store(config);
    source = new Source();
    target = new Destination();
    logs = [];
  });
  afterEach(() => rmSync(config.stateDir, { recursive: true, force: true }));

  it('does absolutely nothing when disabled, even when credentials or services are missing', async () => {
    target.failure = new Error('must not be called');
    source.account = async () => { throw new Error('must not be called'); };

    assert.deepEqual(await runStravaPass({ ...config, stravaEnabled: false }, store, source, target, { log: () => {} }), { sent: 0, skipped: 0, ignored: 0, pending: 0 });
    assert.deepEqual(readdirSync(config.stateDir), []);
  });

  it('pins the first-run boundary, excludes all history and later exports only new workouts', async () => {
    source.add('old', 1, { startedAt: Date.now() - 86400000 });
    assert.equal((await pass()).ignored, 1);
    assert.equal(target.creates.length, 0);
    const since = state().sinceMs;

    source.add('new');
    assert.equal((await pass()).sent, 1);
    assert.equal(target.creates.length, 1);
    assert.equal(state().activities.new, '1');
    assert.equal(state().sinceMs, since);
    assert.equal(state().cursor, 2);
    assert.equal((await pass()).sent, 0);
    assert.equal(target.creates.length, 1);

    // Even an edit of a historical workout does not backfill it.
    source.add('old', 2, { startedAt: Date.now() + 1000 });
    await pass();
    assert.equal(target.creates.length, 1);
    assert.equal(logs.some((line) => /PRIVATE_WORKOUT|PRIVATE_NOTE/.test(line)), false);
  });

  it('keeps the enable boundary even if Strava is initially unavailable', async () => {
    target.failure = new StravaAuthError('not connected');
    await assert.rejects(pass(), StravaAuthError);
    const since = state().sinceMs;
    source.add('new');
    target.failure = null;

    assert.equal((await pass()).sent, 1);
    assert.equal(state().sinceMs, since);
  });

  it('persists an async upload, checks it on the next pass and does not reupload', async () => {
    await pass();
    source.add('new');
    target.processing = true;

    assert.equal((await pass()).pending, 1);
    assert.equal(state().pending.new.uploadId, 'upload-1');
    assert.equal(state().cursor, 0);
    assert.equal(state().revisions.new, undefined);
    assert.equal((await pass()).pending, 1);
    assert.equal(target.creates.length, 1);

    target.processing = false;
    assert.equal((await pass()).sent, 1);
    assert.deepEqual(target.polls, ['upload-1', 'upload-1']);
    assert.equal(state().activities.new, '1');
    assert.deepEqual(state().pending, {});
    assert.equal(state().cursor, 1);
  });

  it('recovers a lost upload response by external id and sends nothing twice', async () => {
    await pass();
    source.add('new');
    target.loseResponse = true;
    await assert.rejects(pass(), StravaError);
    assert.equal(state().cursor, 0);
    assert.equal(state().pending.new.uploadId, null);

    assert.equal((await pass()).sent, 1);
    assert.equal(target.creates.length, 1);
    assert.deepEqual(target.updates, ['1']);
    assert.equal(state().activities.new, '1');
  });

  it('edits metadata of the same activity and never deletes it or creates a second copy', async () => {
    await pass();
    source.add('new');
    await pass();
    source.add('new', 2, { name: 'New name' });
    await pass();

    assert.equal(target.creates.length, 1);
    assert.deepEqual(target.updates, ['1', '1']);
    assert.equal(state().revisions.new, 2);
    source.changes.push({ sequence: 3, workoutId: 'new', operation: 'delete', serverRevision: 3, changedAtMs: Date.now() });
    await pass();
    assert.equal(state().activities.new, '1');
    assert.equal(target.creates.length, 1);
  });

  it('skips a refused or unreadable revision, continues and retries only after an edit', async () => {
    await pass();
    source.add('bad', 1, { durationInMinutes: null });
    source.add('refused', 1, { name: 'refuse-me' });
    source.add('good');
    target.refuse.add('refuse-me');
    assert.deepEqual(await pass(), { sent: 1, skipped: 2, ignored: 0, pending: 0 });
    assert.equal(state().cursor, 3);

    source.add('bad', 2);
    assert.equal((await pass()).sent, 1);
    assert.equal(state().revisions.bad, 2);
  });

  it('reconciles duplicate uploads by exact source id, leaving unrelated activities untouched', async () => {
    await pass();
    source.add('new');
    target.processing = true;
    await pass();
    target.uploadResult = { id: 'upload-1', activityId: null, failed: true, duplicate: true };
    target.existing.set(target.creates[0]!.marker, '1');
    assert.equal((await pass()).sent, 1);
    assert.equal(state().activities.new, '1');
    assert.equal(target.creates.length, 1);

    source.add('another');
    await pass();
    target.existing.clear();
    assert.equal((await pass()).skipped, 1);
    assert.equal(state().activities.another, undefined);
    assert.deepEqual(target.updates, ['1']);
    assert.deepEqual(state().pending, {});
  });

  it('skips a failed async file and continues instead of retrying the same bad revision forever', async () => {
    await pass();
    source.add('new');
    target.processing = true;
    await pass();
    target.uploadResult = { id: 'upload-1', activityId: null, failed: true, duplicate: false };
    assert.equal((await pass()).skipped, 1);
    assert.deepEqual(state().pending, {});
    assert.equal(state().cursor, 1);
  });

  for (const which of ['Strava', 'SmartWorkout']) {
    it(`isolates state after changing the ${which} account`, async () => {
      await pass();
      source.add('new');
      await pass();
      if (which === 'Strava') { target.accountId = 'strava-2'; } else { source.accountId = 'sw-2'; }
      source.changes = [];
      await pass();

      assert.deepEqual(state().activities, {});
      assert.equal(readdirSync(config.stateDir).filter((name) => name.endsWith('.other-account.json')).length, 1);
      source.add('new');
      await pass();
      assert.equal(target.creates.length, 2);
      assert.equal(state().activities.new, '2');
    });
  }

  it('does not change or archive any file, connect to Strava or send uploads in a dry run', async () => {
    await pass();
    store.saveStrava({ clientId: '123', accessToken: 'ACCESS', refreshToken: 'REFRESH', expiresAt: 0, athleteId: target.accountId });
    source.add('new');
    const before = readFileSync(join(config.stateDir, 'strava-sync.json'), 'utf8');
    target.failure = new Error('Strava must not be contacted');

    assert.equal((await pass(true)).sent, 1);
    assert.equal(target.creates.length, 0);
    assert.equal(readFileSync(join(config.stateDir, 'strava-sync.json'), 'utf8'), before);
    assert.equal(logs.some((line) => line.startsWith('Would send to Strava')), true);
  });

  it('resyncs a changed server epoch without duplicating activities and refuses a stuck cursor', async () => {
    await pass();
    source.add('new');
    await pass();
    source.resync = true;
    assert.equal((await pass()).sent, 0);
    assert.equal(target.creates.length, 1);
    source.resync = false;
    source.add('later');
    source.stuck = true;
    await assert.rejects(pass(), /did not move the cursor/);
  });

  it('gives both destinations a pass when either one fails, and keeps their state independent', async () => {
    await pass();
    source.add('new');
    const enduo: EnduoTools = { account: async () => 'enduo-1', callTool: async () => { throw new EnduoError('offline'); } };
    const options = { log: (line: string) => logs.push(line) };
    assert.equal(await runTargets(config, store, source, enduo, target, options), false);
    assert.equal(state().activities.new, '1');
    assert.deepEqual(store.sync().sent, {});

    let calls = 0;
    enduo.callTool = async () => { calls++; return { activity_id: 'enduo-activity' }; };
    target.failure = new StravaError('offline');
    assert.equal(await runTargets(config, store, source, enduo, target, options), false);
    assert.equal(calls, 1);
    assert.equal(store.sync().sent.new, 1);
    assert.equal(state().activities.new, '1');
  });
});
