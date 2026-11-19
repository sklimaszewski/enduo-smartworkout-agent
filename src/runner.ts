// Each destination has its own state and failure handling. Always give both a pass, even when one is down.

import type { Config } from './config.ts';
import { EnduoAuthError } from './enduo.ts';
import { SmartWorkoutAuthError } from './smartworkout.ts';
import type { Store } from './store.ts';
import { StravaAuthError } from './strava.ts';
import { runStravaPass } from './strava-sync.ts';
import type { StravaActivities } from './strava-sync.ts';
import { runPass, summary } from './sync.ts';
import type { EnduoTools, PassOptions, WorkoutSource } from './sync.ts';

/** False means at least one destination failed; `once` then exits with a failure status. */
export async function runTargets(config: Config, store: Store, source: WorkoutSource, enduo: EnduoTools | null, strava: StravaActivities | null, options: PassOptions & { reportEmpty?: boolean }): Promise<boolean> {
  let success = true;
  const failed = (target: string, error: unknown): void => {
    success = false;
    const message = error instanceof Error ? error.message : 'unknown error';
    const signedOut = error instanceof SmartWorkoutAuthError || error instanceof EnduoAuthError || error instanceof StravaAuthError;
    options.log(`${target}: ${signedOut ? 'signed out' : 'pass failed, will retry'}: ${message}`);
  };
  // Establish Strava's boundary before Enduo's potentially long first backfill.
  if (config.stravaEnabled && strava !== null) {
    try {
      const result = await runStravaPass(config, store, source, strava, options);
      if (options.dryRun || result.sent + result.skipped + result.pending > 0) {
        options.log(`Strava ${options.dryRun ? 'dry run' : 'pass'} done: ${result.sent} ${options.dryRun ? 'to send' : 'sent'}, ${result.skipped} skipped, ${result.pending} processing, ${result.ignored} with nothing to send.`);
      }
    } catch (error) {
      failed('Strava', error);
    }
  }
  try {
    const result = await runPass(config, store, source, enduo, options);
    if (options.reportEmpty || options.dryRun || result.sent + result.skipped > 0) {
      options.log(`${options.dryRun ? 'Dry run' : 'Pass'} done: ${summary(result, options.dryRun)}.`);
    }
  } catch (error) {
    failed('Enduo', error);
  }

  return success;
}
