// Enduo SmartWorkout Agent (unofficial): sends finished SmartWorkout workouts to Enduo.
//
//   enduo-smartworkout run                     the service: one pass every POLL_SECONDS (default command)
//   enduo-smartworkout setup                   sign in to SmartWorkout and Enduo; skips what is already done
//   enduo-smartworkout setup --smartworkout    give it a new SmartWorkout session
//   enduo-smartworkout setup --enduo           sign in to Enduo again
//   enduo-smartworkout setup --strava          connect optional Strava export
//   enduo-smartworkout once [--dry-run]        one pass now; --dry-run prints what would be sent
//   enduo-smartworkout status                  both sign-ins and the sync state
//   enduo-smartworkout health                  exit 0 while the service loop is alive (Docker healthcheck)

import { statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadConfig } from './config.ts';
import type { Config } from './config.ts';
import { deviceLogin, Enduo, enduoToken } from './enduo.ts';
import { runTargets } from './runner.ts';
import { SmartWorkout } from './smartworkout.ts';
import { Store } from './store.ts';
import { Strava } from './strava.ts';
import { catalogueGaps } from './strava-mapping.ts';

const log = (line: string): void => console.log(`${new Date().toISOString().slice(0, 19)}Z ${line}`);

let stopping = false;
let wake: (() => void) | null = null;
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    stopping = true;
    wake?.();
  });
}

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    wake = () => {
      clearTimeout(timer);
      resolve();
    };
  });
}

/** Reads one line; with a terminal the typed text is not shown (it is a token). */
async function askSecret(question: string): Promise<string> {
  process.stdout.write(question);
  const stdin = process.stdin;
  if (!stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of stdin) {
      chunks.push(chunk as Buffer);
      if (Buffer.concat(chunks).includes(10)) {
        break;
      }
    }
    return Buffer.concat(chunks).toString('utf8').split(/\r?\n/)[0]?.trim() ?? '';
  }

  return new Promise((resolve) => {
    let value = '';
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (chunk: string): void => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          process.stdout.write('\n');
          resolve(value.trim());
          return;
        }
        if (char === '\u0003') {
          process.exit(130);
        }
        value = char === '\u007f' ? value.slice(0, -1) : value + char;
      }
    };
    stdin.on('data', onData);
  });
}

async function setupSmartworkout(config: Config, store: Store, force: boolean): Promise<void> {
  const smartworkout = new SmartWorkout(config, store);
  if (store.smartworkout() !== null && !force) {
    try {
      const user = await smartworkout.user();
      log(`SmartWorkout: signed in as ${user.userName ?? 'unknown'}.`);
      return;
    } catch (error) {
      log(`SmartWorkout: the stored session does not work (${(error as Error).message}); give a new one.`);
    }
  }

  console.log(
    [
      '',
      'SmartWorkout signs in only with Google or Apple, so this container cannot sign in by itself.',
      'Give it the session of the app: the access token and the refresh token (docs/smartworkout-api.md, section 2).',
      'Signing out in the app ends this session too.',
      '',
    ].join('\n'),
  );
  const accessToken = (process.env.SMARTWORKOUT_ACCESS_TOKEN ?? '').trim() || (await askSecret('SmartWorkout access token: '));
  const refreshToken = (process.env.SMARTWORKOUT_REFRESH_TOKEN ?? '').trim() || (await askSecret('SmartWorkout refresh token: '));
  if (accessToken === '' || refreshToken === '') {
    throw new Error('Both tokens are needed.');
  }

  await smartworkout.refresh({ accessToken, refreshToken, expiresAt: 0, savedAt: new Date().toISOString() });
  const user = await smartworkout.user();
  log(`SmartWorkout: signed in as ${user.userName ?? 'unknown'} (${user.workoutCount ?? '?'} workouts).`);
}

async function setupEnduo(config: Config, store: Store, force: boolean): Promise<void> {
  const token = enduoToken(store);
  if (token !== null && !force) {
    try {
      const me = (await new Enduo(config, token).callTool('whoami')) as { user?: { email?: string }; scopes?: string[] };
      log(`Enduo (${config.enduoUrl}): ${me.user?.email ?? 'signed in'}, scopes: ${(me.scopes ?? []).join(' ')}.`);
      return;
    } catch (error) {
      if (process.env.ENDUO_TOKEN) {
        throw new Error(`ENDUO_TOKEN does not work: ${(error as Error).message}`, { cause: error });
      }
      log(`Enduo: the stored token does not work (${(error as Error).message}); signing in again.`);
    }
  }

  const result = await deviceLogin(config, store);
  if (result !== 'signed_in') {
    throw new Error(result === 'denied' ? 'The sign-in was denied in Enduo.' : 'The code expired before it was approved; run setup again.');
  }
  log(`Enduo: signed in (${config.enduoUrl}).`);
}

async function setupStrava(config: Config, store: Store, force: boolean): Promise<void> {
  const strava = new Strava(config, store);
  if (store.strava()?.clientId === config.stravaClientId && !force) {
    try {
      log(`Strava: signed in as athlete ${await strava.account(true)}.`);
      return;
    } catch {
      log('Strava: the stored session does not work; signing in again.');
    }
  }
  if (config.stravaRefreshToken !== null) {
    log(`Strava: signed in as athlete ${await strava.connect()}.`);
    return;
  }
  const state = crypto.randomUUID();
  console.log(`\nOpen this address in your browser and approve both activity permissions:\n\n${strava.authorizationUrl(state)}\n`);
  console.log('The final localhost page may not open. Copy its complete address from the browser and paste it here. No listening port is needed.');
  await strava.authorize(await askSecret('Strava redirect address (hidden): '), state);
  log(`Strava: signed in as athlete ${await strava.account(true)}.`);
}

function heartbeat(store: Store): void {
  try {
    store.ensure();
    writeFileSync(join(store.dir, 'heartbeat'), new Date().toISOString());
  } catch {
    // health reports it
  }
}

async function serve(config: Config, store: Store): Promise<void> {
  log(`Enduo SmartWorkout Agent ${config.version}: Enduo ${config.enduoUrl}, a pass every ${config.pollMs / 1000} s.`);
  let waitingSaid = false;
  // One Strava client for the whole run: it remembers a rate limit and keeps away from Strava until it resets.
  const strava = config.stravaEnabled ? new Strava(config, store) : null;
  while (!stopping) {
    heartbeat(store);
    const token = enduoToken(store);
    if (store.smartworkout() === null || token === null) {
      if (!waitingSaid) {
        log('Waiting for setup: run `enduo-smartworkout setup` in this container.');
        waitingSaid = true;
      }
      await pause(15_000);
      continue;
    }
    waitingSaid = false;

    await runTargets(config, store, new SmartWorkout(config, store), new Enduo(config, token), strava, { log });
    await pause(config.pollMs);
  }
  log('Stopped.');
}

async function status(config: Config, store: Store): Promise<void> {
  const session = store.smartworkout();
  if (session === null) {
    console.log('SmartWorkout: not signed in.');
  } else {
    try {
      const user = await new SmartWorkout(config, store).user();
      const left = Math.round((store.smartworkout()!.expiresAt - Date.now()) / 86_400_000);
      console.log(`SmartWorkout: ${user.userName ?? 'signed in'}, access token valid for ${left} more days (refreshed automatically).`);
    } catch (error) {
      console.log(`SmartWorkout: ${(error as Error).message}`);
    }
  }

  const token = enduoToken(store);
  if (token === null) {
    console.log('Enduo: not signed in.');
  } else {
    try {
      const me = (await new Enduo(config, token).callTool('whoami')) as { user?: { email?: string }; scopes?: string[] };
      console.log(`Enduo (${config.enduoUrl}): ${me.user?.email ?? 'signed in'}, scopes: ${(me.scopes ?? []).join(' ')}.`);
    } catch (error) {
      console.log(`Enduo: ${(error as Error).message}`);
    }
  }

  const state = store.sync();
  const skipped = Object.keys(state.skipped).length;
  console.log(
    state.cursor === null
      ? 'Sync: not run yet.'
      : `Sync: last pass ${state.lastSyncAt ?? 'never'}, cursor ${state.cursor}, ${Object.keys(state.sent).length} workouts handled` +
          `${skipped > 0 ? `, ${skipped} of them skipped (unreadable or refused by Enduo; tried again when they change)` : ''}.`,
  );
  if (!config.stravaEnabled) {
    console.log('Strava: disabled (STRAVA_ENABLED=false).');
  } else {
    try {
      console.log(`Strava: enabled, athlete ${await new Strava(config, store).account(true)}, time zone ${config.stravaTimezone}.`);
    } catch (error) {
      console.log(`Strava: ${(error as Error).message}`);
    }
    const stravaState = store.read<{ sinceMs?: number; lastSyncAt?: string; activities?: object; pending?: object }>('strava-sync.json');
    console.log(stravaState?.sinceMs === undefined ? 'Strava sync: not run yet; history will not be sent.' :
      `Strava sync: workouts from ${new Date(stravaState.sinceMs).toISOString()}, last pass ${stravaState.lastSyncAt ?? 'never'}, ` +
      `${Object.keys(stravaState.activities ?? {}).length} activities, ${Object.keys(stravaState.pending ?? {}).length} uploads pending.`);
  }
}

function health(config: Config, store: Store): number {
  try {
    const age = Date.now() - statSync(join(store.dir, 'heartbeat')).mtimeMs;

    return age < config.pollMs + 180_000 ? 0 : 1;
  } catch {
    return 1;
  }
}

/** How the Strava table compares with SmartWorkout's catalogue now; exit 1 when public exercises are missing. */
async function stravaExercises(config: Config, store: Store): Promise<number> {
  const gaps = catalogueGaps(await new SmartWorkout(config, store).catalogue());
  console.log(gaps.missing.length === 0
    ? 'Every public exercise of SmartWorkout has a Strava type in src/strava-catalogue.ts.'
    : `${gaps.missing.length} public exercises are not in src/strava-catalogue.ts. Until they are, their names give these types;\ncheck them and add the lines to the table:\n${gaps.missing.map((row) => `  '${row.id}': '${row.type}', // ${row.name}`).join('\n')}`);
  if (gaps.own.length > 0) {
    console.log(`\nYour own exercises, matched by name:\n${gaps.own.map((row) => `  ${row.name} → ${row.type}`).join('\n')}`);
  }
  if (gaps.stale.length > 0) {
    console.log(`\n${gaps.stale.length} ids of the table are no longer in the catalogue: ${gaps.stale.join(', ')}`);
  }

  return gaps.missing.length === 0 ? 0 : 1;
}

async function main(argv: string[]): Promise<number> {
  const config = loadConfig();
  const store = new Store(config);
  const [command = 'run', ...flags] = argv;

  switch (command) {
    case 'run':
      await serve(config, store);
      return 0;
    case 'setup': {
      const only = flags.includes('--smartworkout') ? 'smartworkout' : flags.includes('--enduo') ? 'enduo' : flags.includes('--strava') ? 'strava' : null;
      if (only === null || only === 'smartworkout') {
        await setupSmartworkout(config, store, only === 'smartworkout');
      }
      if (only === null || only === 'enduo') {
        await setupEnduo(config, store, only === 'enduo');
      }
      if (only === 'strava' || (only === null && config.stravaEnabled)) {
        await setupStrava(config, store, only === 'strava');
      }
      const missing = [store.smartworkout() === null ? 'SmartWorkout' : null, enduoToken(store) === null ? 'Enduo' : null].filter(Boolean);
      console.log(
        missing.length > 0
          ? `\nStill missing: ${missing.join(' and ')}. Run \`enduo-smartworkout setup\` again.`
          : '\nReady. The service picks it up within 15 seconds; `enduo-smartworkout status` shows the state.',
      );
      return 0;
    }
    case 'once': {
      const dryRun = flags.includes('--dry-run');
      const token = enduoToken(store);
      if (!dryRun && token === null) {
        throw new Error('Not signed in to Enduo: run `enduo-smartworkout setup`.');
      }
      // A dry run asks Enduo too, but only whose token it is: the state is used only for the accounts it was built from.
      const success = await runTargets(config, store, new SmartWorkout(config, store), token === null ? null : new Enduo(config, token), config.stravaEnabled ? new Strava(config, store) : null, { log, dryRun, reportEmpty: true });
      return success ? 0 : 1;
    }
    case 'status':
      await status(config, store);
      return 0;
    case 'health':
      return health(config, store);
    case 'strava-exercises':
      return stravaExercises(config, store);
    default:
      console.log('Commands: run, setup [--smartworkout|--enduo|--strava], once [--dry-run], status, strava-exercises, health');
      return command === 'help' ? 0 : 2;
  }
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error: unknown) => {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  },
);
