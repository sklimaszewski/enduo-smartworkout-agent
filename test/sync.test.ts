import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, it } from 'node:test';

import { loadConfig } from '../src/config.ts';
import type { Config } from '../src/config.ts';
import { EnduoAuthError, EnduoError, EnduoToolError } from '../src/enduo.ts';
import { SmartWorkoutError } from '../src/smartworkout.ts';
import type { SwSyncPage } from '../src/smartworkout.ts';
import { Store } from '../src/store.ts';
import { runPass } from '../src/sync.ts';
import type { EnduoTools, WorkoutSource } from '../src/sync.ts';

const HOUR = 3_600_000;

/** The change log of a SmartWorkout account in memory; the cursor is the number of changes already read. */
class FakeSmartWorkout implements WorkoutSource {
  accountId = 'sw-user-1';
  changes: unknown[] = [];
  cursors: number[] = [];
  stuck = false;

  async account(): Promise<string> {
    return this.accountId;
  }

  async exercises(): Promise<{ translations: Record<string, Record<string, string>>; weightTypes: Record<string, string> }> {
    return { translations: { bench: { en: 'Barbell Bench Press' } }, weightTypes: { bench: 'BARBELL' } };
  }

  async workoutChanges(_clientInstanceId: string, cursor: number): Promise<SwSyncPage> {
    this.cursors.push(cursor);

    return {
      changes: this.changes.slice(cursor),
      nextCursor: this.stuck ? cursor : this.changes.length,
      serverEpoch: 'epoch-1',
      hasMore: this.stuck,
      requiresFullSnapshot: false,
    };
  }
}

class FakeEnduo implements EnduoTools {
  accountId = 'enduo-account-a';
  calls: Array<Record<string, unknown>> = [];
  /** Idempotency keys Enduo refuses as invalid. */
  refuse = new Set<string>();
  failure: Error | null = null;

  async account(): Promise<string> {
    return this.accountId;
  }

  async callTool(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    assert.equal(name, 'strength_session_log');
    if (this.failure !== null) {
      throw this.failure;
    }
    if (this.refuse.has(String(args.idempotency_key))) {
      throw new EnduoToolError('Invalid input. sets[0].reps: This value should be between 0 and 1000.');
    }
    this.calls.push(args);

    return { activity_id: 'activity-1' };
  }

  keys(): string[] {
    return this.calls.map((call) => String(call.idempotency_key));
  }
}

const workout = (id: string, overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  id,
  startedAt: Date.now() - 24 * HOUR,
  durationInMinutes: 60,
  name: `Session ${id}`,
  notes: null,
  workoutExercises: [{ exerciseId: 'bench', sequence: 0, units: ['WEIGHT', 'REPS'], sets: [{ sequence: 1, weight: 80, reps: 5, type: 'NORMAL' }] }],
  ...overrides,
});

let sequence = 0;
const change = (work: Record<string, unknown>, serverRevision = 1): Record<string, unknown> => ({
  sequence: ++sequence,
  workoutId: work.id,
  operation: 'upsert',
  serverRevision,
  changedAtMs: Date.now(),
  workout: work,
});

describe('runPass', () => {
  let config: Config;
  let store: Store;
  let smartworkout: FakeSmartWorkout;
  let enduo: FakeEnduo;
  let lines: string[];
  const pass = () => runPass(config, store, smartworkout, enduo, { log: (text) => lines.push(text) });
  const stored = (): Record<string, any> => JSON.parse(readFileSync(join(config.stateDir, 'sync.json'), 'utf8'));
  const keptAside = (): string[] => readdirSync(config.stateDir).filter((name) => name.endsWith('.other-account.json'));

  beforeEach(() => {
    config = loadConfig({ STATE_DIR: mkdtempSync(join(tmpdir(), 'enduo-smartworkout-')), ENDUO_URL: 'https://api.enduo.test' });
    store = new Store(config);
    smartworkout = new FakeSmartWorkout();
    enduo = new FakeEnduo();
    lines = [];
  });

  it('sends the finished workouts and writes down whose state it is', async () => {
    smartworkout.changes = [change(workout('w-1')), change(workout('w-2'))];

    const result = await pass();

    assert.deepEqual(result, { sent: 2, skipped: 0, ignored: 0 });
    assert.deepEqual(enduo.keys(), ['smartworkout:w-1:1', 'smartworkout:w-2:1']);
    assert.deepEqual(stored().identity, { enduo: 'https://api.enduo.test', enduoAccount: 'enduo-account-a', smartworkoutAccount: 'sw-user-1' });
    assert.equal(stored().cursor, 2);
    assert.equal(statSync(join(config.stateDir, 'sync.json')).mode & 0o777, 0o600);

    assert.deepEqual(await pass(), { sent: 0, skipped: 0, ignored: 0 });
    assert.deepEqual(smartworkout.cursors, [0, 2]);
  });

  for (const [what, switchAccount] of [
    ['Enduo account', () => (enduo.accountId = 'enduo-account-b')],
    ['SmartWorkout account', () => (smartworkout.accountId = 'sw-user-2')],
    ['Enduo server', () => (config = { ...config, mcpUrl: 'https://other.enduo.test/mcp' })],
  ] as const) {
    it(`does not apply a state built for another ${what}: it starts over and keeps the old file aside`, async () => {
      smartworkout.changes = [change(workout('w-1'))];
      await pass();
      const before = stored();

      switchAccount();
      enduo.calls = [];
      smartworkout.cursors = [];
      const result = await pass();

      // Nothing of the old state is used: the log is read from its start and the workout goes to the new account.
      assert.deepEqual(smartworkout.cursors, [0]);
      assert.deepEqual(enduo.keys(), ['smartworkout:w-1:1']);
      assert.equal(result.sent, 1);
      assert.notEqual(stored().clientInstanceId, before.clientInstanceId);
      assert.notDeepEqual(stored().identity, before.identity);

      const [kept, ...more] = keptAside();
      assert.equal(more.length, 0);
      assert.deepEqual(JSON.parse(readFileSync(join(config.stateDir, kept!), 'utf8')), before);
      assert.equal(statSync(join(config.stateDir, kept!)).mode & 0o777, 0o600);
      assert.equal(lines.filter((text) => text.includes(`belongs to another ${what}`)).length, 1);

      // The new state is this pair's own: the next pass uses it.
      await pass();
      assert.equal(keptAside().length, 1);
      assert.deepEqual(enduo.keys(), ['smartworkout:w-1:1']);
    });
  }

  it('takes a state of a version that named no accounts for the current ones, and says so once', async () => {
    smartworkout.changes = [change(workout('w-1')), change(workout('w-2'))];
    writeFileSync(
      join(config.stateDir, 'sync.json'),
      JSON.stringify({ clientInstanceId: 'old-client', cursor: 1, serverEpoch: 'epoch-1', backfillFromMs: 0, sent: { 'w-1': 1 }, lastSyncAt: null }),
    );

    await pass();
    await pass();

    assert.deepEqual(enduo.keys(), ['smartworkout:w-2:1']);
    assert.equal(stored().clientInstanceId, 'old-client');
    assert.equal(stored().identity.enduoAccount, 'enduo-account-a');
    assert.equal(keptAside().length, 0);
    assert.equal(lines.filter((text) => text.includes('names no accounts')).length, 1);
  });

  it('skips a workout it cannot read, sends the next one and moves on', async () => {
    smartworkout.changes = [
      change(workout('w-bad', { startedAt: 'yesterday', name: 'PRIVATE NAME', notes: 'PRIVATE NOTE' })),
      change(workout('w-odd', { workoutExercises: [{ exerciseId: 'bench', sets: ['PRIVATE SET'] }] })),
      null,
      { sequence: 99, operation: 'upsert', workout: workout('w-lost') },
      change(workout('w-good')),
    ];

    const result = await pass();

    assert.deepEqual(result, { sent: 1, skipped: 4, ignored: 0 });
    assert.deepEqual(enduo.keys(), ['smartworkout:w-good:1']);
    assert.equal(stored().cursor, 5);
    assert.equal(stored().skipped['w-bad'].reason, 'unreadable');
    assert.equal(stored().skipped['w-bad'].revision, 1);
    assert.equal(stored().skipped['w-odd'].reason, 'unreadable');
    assert.equal(lines.some((text) => text.startsWith('Skipped workout w-bad (revision 1): its start is not a time')), true);
    assert.equal(lines.some((text) => text.includes('PRIVATE')), false);
  });

  it('does not try a skipped workout again until it changes in SmartWorkout', async () => {
    smartworkout.changes = [change(workout('w-bad', { startedAt: null })), change(workout('w-refused'))];
    enduo.refuse.add('smartworkout:w-refused:1');
    assert.equal((await pass()).skipped, 2);

    // SmartWorkout hands out the same changes again (a full resync): nothing is sent, said or counted twice.
    store.saveSync({ ...store.sync(), cursor: 0 });
    enduo.refuse.clear();
    lines = [];
    assert.deepEqual(await pass(), { sent: 0, skipped: 0, ignored: 0 });
    assert.deepEqual(enduo.keys(), []);
    assert.deepEqual(lines, []);

    // A newer revision of each is a new try.
    smartworkout.changes.push(change(workout('w-bad'), 2), change(workout('w-refused'), 2));
    assert.deepEqual(await pass(), { sent: 2, skipped: 0, ignored: 0 });
    assert.deepEqual(enduo.keys(), ['smartworkout:w-bad:2', 'smartworkout:w-refused:2']);
    assert.deepEqual(stored().skipped, {});
  });

  it('skips a workout Enduo refuses as invalid and sends the next one', async () => {
    smartworkout.changes = [change(workout('w-1', { startedAt: Date.now() - 48 * HOUR })), change(workout('w-2'))];
    enduo.refuse.add('smartworkout:w-1:1');

    const result = await pass();

    assert.deepEqual(result, { sent: 1, skipped: 1, ignored: 0 });
    assert.deepEqual(enduo.keys(), ['smartworkout:w-2:1']);
    assert.equal(stored().skipped['w-1'].reason, 'refused');
    assert.equal(lines.some((text) => text.startsWith('Skipped workout w-1 (revision 1): Enduo refused it (Invalid input. sets[0].reps')), true);
  });

  for (const [what, failure] of [
    ['Enduo is not reachable or answers 429 or 5xx', new EnduoError('Enduo MCP answered 503: ')],
    ['Enduo refuses the token', new EnduoAuthError('Enduo refused the token (401)')],
    ['the network fails', new TypeError('fetch failed')],
  ] as const) {
    it(`stops the pass when ${what}, gives up on nothing and repeats it`, async () => {
      smartworkout.changes = [change(workout('w-1')), change(workout('w-2'))];
      enduo.failure = failure;

      await assert.rejects(pass(), failure);
      assert.deepEqual(store.sync().sent, {});
      assert.deepEqual(store.sync().skipped, {});
      assert.equal(store.sync().cursor, null);

      enduo.failure = null;
      assert.deepEqual(await pass(), { sent: 2, skipped: 0, ignored: 0 });
    });
  }

  it('stops instead of asking for ever when SmartWorkout does not move the cursor', async () => {
    smartworkout.changes = [change(workout('w-1'))];
    smartworkout.stuck = true;

    await assert.rejects(pass(), SmartWorkoutError);
    assert.deepEqual(smartworkout.cursors, [0]);
  });

  it('changes nothing in a dry run, not even a state of another account', async () => {
    smartworkout.changes = [change(workout('w-1'))];
    await pass();
    const before = readFileSync(join(config.stateDir, 'sync.json'), 'utf8');

    enduo.accountId = 'enduo-account-b';
    enduo.calls = [];
    const result = await runPass(config, store, smartworkout, enduo, { log: (text) => lines.push(text), dryRun: true });

    assert.equal(result.sent, 1);
    assert.deepEqual(enduo.calls, []);
    assert.equal(readFileSync(join(config.stateDir, 'sync.json'), 'utf8'), before);
    assert.equal(keptAside().length, 0);
    assert.equal(lines.some((text) => text.startsWith('Would send')), true);
  });

  it('shows what a first run would send when a dry run has no Enduo sign-in to check the state against', async () => {
    smartworkout.changes = [change(workout('w-1'))];
    await pass();

    const result = await runPass(config, store, smartworkout, null, { log: (text) => lines.push(text), dryRun: true });

    assert.equal(result.sent, 1);
    assert.equal(stored().cursor, 1);
  });
});
