import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';

import { loadConfig } from '../src/config.ts';
import type { Config } from '../src/config.ts';
import { Store } from '../src/store.ts';
import { rateLimitReset, Strava, StravaActivityError, StravaAuthError, StravaError, StravaRateLimitError } from '../src/strava.ts';
import { stravaExternalId, stravaMarker } from '../src/strava-mapping.ts';
import type { StravaActivity } from '../src/strava-mapping.ts';

const marker = stravaMarker('sw-account', 'workout-1');
const activity: StravaActivity = {
  name: 'Strength', sport_type: 'WeightTraining', description: `${marker}\nMy notes`,
  file: { version: '1.0', start_time: '2026-11-19T12:00:00Z', utc_offset: 3600, elapsed_time: 3600, creator: { name: 'Enduo SmartWorkout Agent' }, sets: [{ exercise_type: 'BARBELL_BENCH_PRESS', repetitions: 5, weight: 80 }] },
};

describe('Strava API', () => {
  let config: Config;
  let store: Store;
  let strava: Strava;

  beforeEach(() => {
    config = loadConfig({ STATE_DIR: mkdtempSync(join(tmpdir(), 'smartworkout-strava-')), STRAVA_ENABLED: 'true', STRAVA_CLIENT_ID: '123', STRAVA_CLIENT_SECRET: 'CLIENT_SECRET', STRAVA_REFRESH_TOKEN: 'BOOTSTRAP_REFRESH' });
    store = new Store(config);
    store.saveStrava({ clientId: '123', accessToken: 'ACCESS', refreshToken: 'LATEST_REFRESH', expiresAt: Date.now() + 3600000, athleteId: '42' });
    strava = new Strava(config, store);
  });

  afterEach(() => {
    mock.restoreAll();
    rmSync(config.stateDir, { recursive: true, force: true });
  });

  it('refreshes with the latest stored token and persists the rotated token with private permissions', async () => {
    store.saveStrava({ ...store.strava()!, expiresAt: 0 });
    mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
      assert.equal(url, 'https://www.strava.com/oauth/token');
      assert.equal(init.redirect, 'error');
      assert.equal((init.body as URLSearchParams).get('refresh_token'), 'LATEST_REFRESH');
      assert.equal((init.body as URLSearchParams).get('client_secret'), 'CLIENT_SECRET');
      return Response.json({ access_token: 'NEW_ACCESS', refresh_token: 'ROTATED_REFRESH', expires_at: Math.floor(Date.now() / 1000) + 21600 });
    });

    assert.equal(await strava.accessToken(), 'NEW_ACCESS');
    assert.equal(store.strava()?.refreshToken, 'ROTATED_REFRESH');
    assert.equal(statSync(join(config.stateDir, 'strava.json')).mode & 0o777, 0o600);
    assert.equal(await new Strava(config, store).accessToken(), 'NEW_ACCESS');
  });

  it('bootstraps from ENV once, verifies the athlete and then uses the stored session', async () => {
    store.remove('strava.json');
    let refreshes = 0;
    mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
      if (url.endsWith('/oauth/token')) {
        refreshes++;
        assert.equal((init.body as URLSearchParams).get('refresh_token'), 'BOOTSTRAP_REFRESH');
        return Response.json({ access_token: 'NEW_ACCESS', refresh_token: 'ROTATED_REFRESH', expires_at: Math.floor(Date.now() / 1000) + 21600 });
      }
      assert.equal(url, 'https://www.strava.com/api/v3/athlete');
      assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer NEW_ACCESS');
      return Response.json({ id: 42 });
    });

    assert.equal(await strava.account(), '42');
    assert.equal(await new Strava(config, store).account(), '42');
    assert.equal(store.strava()?.athleteId, '42');
    assert.equal(refreshes, 1);
  });

  it('uploads a real JSON file with native sets, a stable external id and WeightTraining type', async () => {
    mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
      assert.equal(url, 'https://www.strava.com/api/v3/uploads');
      assert.equal(init.method, 'POST');
      assert.equal(init.redirect, 'error');
      assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer ACCESS');
      assert.equal((init.headers as Record<string, string>)['Content-Type'], undefined);
      const form = init.body as FormData;
      assert.equal(form.get('data_type'), 'json');
      assert.equal(form.get('sport_type'), 'WeightTraining');
      assert.equal(form.get('external_id'), stravaExternalId(marker));
      assert.equal(form.get('description'), activity.description);
      const file = form.get('file') as File;
      assert.equal(file.name, stravaExternalId(marker));
      assert.equal(file.type, 'application/json');
      assert.deepEqual(JSON.parse(await file.text()), activity.file);
      return Response.json({ id: 1234, id_str: '1234', activity_id: null, error: null }, { status: 201 });
    });

    assert.deepEqual(await strava.createUpload(activity, marker), { id: '1234', activityId: null, failed: false, duplicate: false, error: null });
  });

  it('polls an upload without reuploading and keeps full string ids', async () => {
    mock.method(globalThis, 'fetch', async (url: string) => {
      assert.equal(url, 'https://www.strava.com/api/v3/uploads/1234');
      return Response.json({ id: 1234, activity_id_str: '12345678987654321', activity_id: 1, error: null });
    });

    assert.deepEqual(await strava.getUpload('1234'), { id: '1234', activityId: '12345678987654321', failed: false, duplicate: false, error: null });
  });

  it('reconciles uploads by exact external id and paginates the search', async () => {
    const pages: string[] = [];
    mock.method(globalThis, 'fetch', async (address: string) => {
      const url = new URL(address);
      pages.push(url.searchParams.get('page')!);
      assert.equal(url.pathname, '/api/v3/athlete/activities');
      assert.equal(url.searchParams.get('per_page'), '100');
      return url.searchParams.get('page') === '1'
        ? Response.json(Array.from({ length: 100 }, (_, i) => ({ id: i + 1, external_id: 'unrelated.json' })))
        : Response.json([{ id: 1234, external_id: stravaExternalId(marker), private: true }]);
    });

    assert.equal(await strava.findActivity(marker, Date.now()), '1234');
    assert.deepEqual(pages, ['1', '2']);
  });

  it('updates metadata without trying to replace native sets or deleting the activity', async () => {
    mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
      assert.equal(url, 'https://www.strava.com/api/v3/activities/1234');
      assert.equal(init.method, 'PUT');
      assert.deepEqual(Object.fromEntries(init.body as URLSearchParams), { name: activity.name, description: activity.description, sport_type: 'WeightTraining' });
      return Response.json({ id: 1234 });
    });

    await strava.updateActivity('1234', activity);
  });

  it('refreshes once after 401 and retries with the new access token', async () => {
    let attempts = 0;
    mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
      if (url.endsWith('/oauth/token')) {
        return Response.json({ access_token: 'REPLACED', refresh_token: 'ROTATED', expires_at: Math.floor(Date.now() / 1000) + 21600 });
      }
      attempts++;
      if (attempts === 1) {
        return new Response('', { status: 401 });
      }
      assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer REPLACED');
      return Response.json({ id: 42 });
    });

    assert.equal(await strava.account(true), '42');
    assert.equal(attempts, 2);
  });

  it('validates the OAuth callback state, target and scopes before exchanging the code', async () => {
    const authorize = new URL(strava.authorizationUrl('STATE'));
    assert.equal(authorize.searchParams.get('scope'), 'activity:read_all,activity:write');
    assert.equal(authorize.searchParams.has('client_secret'), false);
    const fetch = mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
      if (url.endsWith('/oauth/token')) {
        assert.equal((init.body as URLSearchParams).get('code'), 'CODE');
        return Response.json({ access_token: 'NEW', refresh_token: 'ROTATED', expires_at: Math.floor(Date.now() / 1000) + 21600, athlete: { id: 42 } });
      }
      return Response.json({ id: 42 });
    });
    const callback = 'http://localhost/strava/callback?state=STATE&code=CODE&scope=read,activity:read_all,activity:write';
    for (const bad of [callback.replace('STATE', 'WRONG'), callback.replace('localhost', 'other.test'), callback.replace(',activity:write', '')]) {
      await assert.rejects(strava.authorize(bad, 'STATE'), StravaAuthError);
    }
    assert.equal(fetch.mock.callCount(), 0);
    await strava.authorize(callback, 'STATE');
    assert.equal(store.strava()?.refreshToken, 'ROTATED');
  });

  it('classifies failures and never echoes tokens, response bodies or transport errors', async () => {
    for (const [status, type] of [[403, StravaAuthError], [503, StravaError], [422, StravaActivityError]] as const) {
      mock.method(globalThis, 'fetch', async () => new Response('PRIVATE_WORKOUT ACCESS CLIENT_SECRET', { status }));
      await assert.rejects(strava.updateActivity('1', activity), (error: unknown) => error instanceof type && !error.message.includes('PRIVATE') && !error.message.includes('CLIENT_SECRET'));
    }
    mock.method(globalThis, 'fetch', async () => { throw new Error('PRIVATE_TOKEN'); });
    await assert.rejects(strava.getUpload('1'), (error: unknown) => error instanceof StravaError && !error.message.includes('PRIVATE'));
    mock.method(globalThis, 'fetch', async () => Response.json({ error: 'PRIVATE_WORKOUT', id: 1 }));
    assert.equal((await strava.getUpload('1')).failed, true);
  });

  it('knows its verified athlete without asking Strava on every pass, and asks when told to verify', async () => {
    const urls: string[] = [];
    mock.method(globalThis, 'fetch', async (url: string) => {
      urls.push(url);
      return Response.json({ id: 42 });
    });

    for (let pass = 0; pass < 5; pass++) {
      assert.equal(await new Strava(config, store).account(), '42');
    }
    assert.deepEqual(urls, []);
    assert.equal(await strava.account(true), '42');
    assert.deepEqual(urls, ['https://www.strava.com/api/v3/athlete']);
  });

  it('keeps the athlete across its own refresh, but verifies a new authorization', async () => {
    store.saveStrava({ ...store.strava()!, expiresAt: 0 });
    const urls: string[] = [];
    mock.method(globalThis, 'fetch', async (url: string) => {
      urls.push(url);
      return url.endsWith('/oauth/token')
        ? Response.json({ access_token: 'NEW', refresh_token: 'ROTATED', expires_at: Math.floor(Date.now() / 1000) + 21600, athlete: { id: 7 } })
        : Response.json({ id: 43 });
    });

    assert.equal(await strava.account(), '42');
    assert.deepEqual(urls, ['https://www.strava.com/oauth/token']);

    await strava.authorize(`${config.stravaRedirectUri}?state=STATE&code=CODE&scope=read,activity:read_all,activity:write`, 'STATE');
    assert.equal(urls.at(-1), 'https://www.strava.com/api/v3/athlete');
    assert.equal(store.strava()?.athleteId, '43');
  });

  it('stops contacting Strava after a 429 until its limit resets', async () => {
    let calls = 0;
    mock.method(globalThis, 'fetch', async () => {
      calls++;
      return new Response('', { status: 429, headers: { 'X-RateLimit-Limit': '200,2000', 'X-RateLimit-Usage': '12,300', 'X-ReadRateLimit-Limit': '100,1000', 'X-ReadRateLimit-Usage': '5,1000' } });
    });

    await assert.rejects(strava.getUpload('1'), (error: unknown) => error instanceof StravaRateLimitError && error.first && /daily/.test(error.message));
    await assert.rejects(strava.getUpload('1'), (error: unknown) => error instanceof StravaRateLimitError && !error.first);
    await assert.rejects(strava.findActivity(marker, Date.now()), StravaRateLimitError);
    assert.equal(calls, 1);
  });

  it('waits for the next quarter hour or, when a daily limit is used up, for midnight UTC', () => {
    const now = Date.parse('2026-11-20T16:47:10Z');
    const headers = (usage: string, read: string) => new Headers({ 'X-RateLimit-Limit': '200,2000', 'X-RateLimit-Usage': usage, 'X-ReadRateLimit-Limit': '100,1000', 'X-ReadRateLimit-Usage': read });

    assert.deepEqual(rateLimitReset(headers('200,900', '100,800'), now), { until: Date.parse('2026-11-20T17:00:05Z'), daily: false });
    assert.deepEqual(rateLimitReset(headers('20,1100', '20,1000'), now), { until: Date.parse('2026-11-21T00:00:05Z'), daily: true });
    assert.deepEqual(rateLimitReset(headers('20,2000', '20,900'), now), { until: Date.parse('2026-11-21T00:00:05Z'), daily: true });
    assert.deepEqual(rateLimitReset(new Headers(), now), { until: Date.parse('2026-11-20T17:00:05Z'), daily: false });
  });

  it("gives Strava's reason for a failed upload as plain, bounded text", async () => {
    mock.method(globalThis, 'fetch', async () => Response.json({ id: 1, error: 'Invalid&nbsp;<b>exercise_type</b>: &quot;FOO&quot;\n&lt;br&gt;line two', status: 'There was an error processing your activity.' }));
    assert.deepEqual(await strava.getUpload('1'), { id: '1', activityId: null, failed: true, duplicate: false, error: 'Invalid exercise_type : "FOO" line two' });

    mock.method(globalThis, 'fetch', async () => Response.json({ id: 1, error: `<p>${'x'.repeat(1000)}</p>` }));
    assert.equal(Array.from((await strava.getUpload('1')).error ?? '').length, 300);

    mock.method(globalThis, 'fetch', async () => Response.json({ id: 1, error: '<br>' }));
    assert.equal((await strava.getUpload('1')).error, 'no reason given');
  });
});
