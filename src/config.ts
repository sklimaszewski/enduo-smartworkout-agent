// Everything the container reads from the environment, in one place.

import { hostname } from 'node:os';

export interface Config {
  /** Address of the Enduo API, without a trailing slash. */
  enduoUrl: string;
  mcpUrl: string;
  smartworkoutUrl: string;
  /** The volume with sign-ins and sync states. */
  stateDir: string;
  /** How often SmartWorkout is asked for new workouts. */
  pollMs: number;
  /** On the first run, workouts that started at most this many days ago are sent; older ones are skipped. */
  backfillDays: number;
  /** Name of the container in Enduo (its personal access token). */
  name: string;
  version: string;
  /**
   * Languages of the exercise names, most wanted first (EXERCISE_LANGUAGE, e.g. "pl,en"). A name missing in all of
   * them falls back to English, then to any language the exercise has.
   */
  exerciseLanguages: string[];
  /** User-Agent of the calls to SmartWorkout (SMARTWORKOUT_USER_AGENT), e.g. the one of the iOS app. */
  smartworkoutUserAgent: string;
  /** User-Agent of the calls to Enduo (ENDUO_USER_AGENT). */
  userAgent: string;
  /** Optional export to Strava; disabled unless STRAVA_ENABLED is true. */
  stravaEnabled: boolean;
  stravaClientId: string | null;
  stravaClientSecret: string | null;
  /** Used only to establish a session; the rotated token on the volume takes precedence. */
  stravaRefreshToken: string | null;
  stravaRedirectUri: string;
  /** Zone used to calculate the display offset (SmartWorkout only supplies a timestamp). */
  stravaTimezone: string;
}

export const PROJECT_URL = 'https://github.com/sklimaszewski/enduo-smartworkout-agent';

/** The only scope the container needs: strength_session_log. */
export const ENDUO_SCOPES = 'write:strength';

function text(value: string | undefined): string | null {
  const trimmed = (value ?? '').trim();

  return trimmed === '' ? null : trimmed;
}

function number(value: string | undefined, fallback: number, min: number): number {
  const parsed = Number(value);

  return value !== undefined && value.trim() !== '' && Number.isFinite(parsed) && parsed >= min ? parsed : fallback;
}

function languages(value: string | undefined): string[] {
  const list = (value ?? '')
    .split(/[\s,]+/)
    .map((language) => language.trim().toLowerCase().replace('_', '-'))
    .filter((language) => /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/.test(language));

  return list.length > 0 ? [...new Set(list)] : ['en'];
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const enduoUrl = (text(env.ENDUO_URL) ?? 'https://api.enduo.app').replace(/\/+$/, '');
  const version = text(env.APP_VERSION) ?? 'dev';
  const userAgent = `enduo-smartworkout-agent/${version} (+${PROJECT_URL})`;
  const enabled = text(env.STRAVA_ENABLED)?.toLowerCase() ?? 'false';
  if (!['true', 'false', '1', '0'].includes(enabled)) {
    throw new Error('STRAVA_ENABLED must be true, false, 1 or 0.');
  }
  const stravaTimezone = text(env.STRAVA_TIMEZONE) ?? 'UTC';
  if (enabled === 'true' || enabled === '1') {
    // Refuse a misspelled zone before any activity is sent with the wrong local time.
    new Intl.DateTimeFormat('en', { timeZone: stravaTimezone }).format();
  }

  return {
    enduoUrl,
    mcpUrl: text(env.ENDUO_MCP_URL) ?? `${enduoUrl}/mcp`,
    smartworkoutUrl: (text(env.SMARTWORKOUT_URL) ?? 'https://api.smartworkout.app').replace(/\/+$/, ''),
    stateDir: text(env.STATE_DIR) ?? '/data',
    pollMs: number(env.POLL_SECONDS, 300, 30) * 1000,
    backfillDays: number(env.BACKFILL_DAYS, 90, 0),
    name: text(env.ENDUO_CLIENT_NAME) ?? `SmartWorkout Agent (${hostname()})`,
    version,
    exerciseLanguages: languages(env.EXERCISE_LANGUAGE),
    smartworkoutUserAgent: text(env.SMARTWORKOUT_USER_AGENT) ?? userAgent,
    userAgent: text(env.ENDUO_USER_AGENT) ?? userAgent,
    stravaEnabled: enabled === 'true' || enabled === '1',
    stravaClientId: text(env.STRAVA_CLIENT_ID),
    stravaClientSecret: text(env.STRAVA_CLIENT_SECRET),
    stravaRefreshToken: text(env.STRAVA_REFRESH_TOKEN),
    stravaRedirectUri: text(env.STRAVA_REDIRECT_URI) ?? 'http://localhost/strava/callback',
    stravaTimezone,
  };
}
