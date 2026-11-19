import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { loadConfig } from '../src/config.ts';

describe('loadConfig', () => {
  it('names itself in the User-Agent of both services by default', () => {
    const config = loadConfig({ APP_VERSION: '1.2.3' });

    assert.equal(config.userAgent, 'enduo-smartworkout-agent/1.2.3 (+https://github.com/sklimaszewski/enduo-smartworkout-agent)');
    assert.equal(config.smartworkoutUserAgent, config.userAgent);
  });

  it('takes the User-Agent of each service from the environment', () => {
    const config = loadConfig({
      SMARTWORKOUT_USER_AGENT: ' SmartWorkout/1634 CFNetwork/3860.700.2 Darwin/25.6.0 ',
      ENDUO_USER_AGENT: 'my-sync/1.0',
    });

    assert.equal(config.smartworkoutUserAgent, 'SmartWorkout/1634 CFNetwork/3860.700.2 Darwin/25.6.0');
    assert.equal(config.userAgent, 'my-sync/1.0');
  });

  it('reads the wanted languages of exercise names, English by default', () => {
    assert.deepEqual(loadConfig({}).exerciseLanguages, ['en']);
    assert.deepEqual(loadConfig({ EXERCISE_LANGUAGE: 'PL, en, pl, pt_BR, ??' }).exerciseLanguages, ['pl', 'en', 'pt-br']);
    assert.deepEqual(loadConfig({ EXERCISE_LANGUAGE: ' ' }).exerciseLanguages, ['en']);
  });

  it('keeps Strava disabled by default and reads its opt-in configuration', () => {
    assert.equal(loadConfig({}).stravaEnabled, false);
    assert.equal(loadConfig({ STRAVA_ENABLED: 'false' }).stravaEnabled, false);
    assert.equal(loadConfig({ STRAVA_ENABLED: '0' }).stravaEnabled, false);
    const config = loadConfig({ STRAVA_ENABLED: ' TRUE ', STRAVA_CLIENT_ID: ' 123 ', STRAVA_CLIENT_SECRET: ' secret ', STRAVA_REFRESH_TOKEN: ' refresh ', STRAVA_TIMEZONE: 'Europe/Warsaw' });

    assert.equal(config.stravaEnabled, true);
    assert.equal(config.stravaClientId, '123');
    assert.equal(config.stravaClientSecret, 'secret');
    assert.equal(config.stravaRefreshToken, 'refresh');
    assert.equal(config.stravaTimezone, 'Europe/Warsaw');
    assert.throws(() => loadConfig({ STRAVA_ENABLED: 'yes' }), /STRAVA_ENABLED/);
    assert.throws(() => loadConfig({ STRAVA_ENABLED: '1', STRAVA_TIMEZONE: 'Wrong/Zone' }), RangeError);
  });
});
