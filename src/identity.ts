// Whose data the sync state describes: the Enduo server, the Enduo account and the SmartWorkout account it was
// built from. A state built for other accounts is never applied (store.ts). Pure functions only.

import { createHash } from 'node:crypto';

export interface SyncIdentity {
  /** Origin of the Enduo server the workouts are sent to, e.g. "https://api.enduo.app". */
  enduo: string;
  /** Id of the Enduo account the token belongs to (`whoami`). */
  enduoAccount: string;
  /** Id of the SmartWorkout account of the session; "sha256:…" of the user name when SmartWorkout gives no id. */
  smartworkoutAccount: string;
}

export const sha256 = (text: string): string => createHash('sha256').update(text).digest('hex');

/** Scheme, host and port of an address, lower case. */
export function serverOrigin(url: string): string {
  try {
    return new URL(url).origin.toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/**
 * The user id a SmartWorkout access token names (the "sub" of the JWT), or null when it has none. The token is
 * only read, not verified: it is the session this container holds, and the id only ties the state to it.
 */
export function tokenSubject(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[1] === undefined) {
    return null;
  }
  try {
    const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as { sub?: unknown } | null;
    const subject = typeof claims?.sub === 'number' ? String(claims.sub) : claims?.sub;

    return typeof subject === 'string' && subject.trim() !== '' && subject.length <= 200 ? subject.trim() : null;
  } catch {
    return null;
  }
}

/** The identity a state file carries, or null when it carries none or one that cannot be read. */
export function readIdentity(value: unknown): SyncIdentity | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const { enduo, enduoAccount, smartworkoutAccount } = value as Record<string, unknown>;

  return typeof enduo === 'string' && typeof enduoAccount === 'string' && typeof smartworkoutAccount === 'string'
    ? { enduo, enduoAccount, smartworkoutAccount }
    : null;
}

/** What makes a state another one's: "Enduo server", "Enduo account", "SmartWorkout account"; null when it is ours. */
export function difference(stored: SyncIdentity, current: SyncIdentity): string | null {
  if (stored.enduo !== current.enduo) {
    return 'Enduo server';
  }
  if (stored.enduoAccount !== current.enduoAccount) {
    return 'Enduo account';
  }

  return stored.smartworkoutAccount === current.smartworkoutAccount ? null : 'SmartWorkout account';
}
