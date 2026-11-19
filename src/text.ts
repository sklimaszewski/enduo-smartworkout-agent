// Text that comes from SmartWorkout (names, notes) on its way to Enduo, where the coach, a language model, reads
// it. It is cleaned and bounded, never interpreted: no control or invisible characters, plain whitespace, and no
// more characters than a name or a note plausibly needs. Pure functions only.

/** Line breaks of every kind, and the other characters that move the cursor. */
const BREAKS = /\r\n?|[\n\v\f\u0085\u2028\u2029]/g;

/**
 * What a reader does not see: control characters (Cc), invisible formatting characters (Cf: zero width, direction
 * overrides, tags) and halves of a surrogate pair (Cs), which no JSON parser has to accept.
 */
const INVISIBLE = /[\p{Cc}\p{Cf}\p{Cs}]/gu;
const INVISIBLE_EXCEPT_NEWLINE = /(?!\n)[\p{Cc}\p{Cf}\p{Cs}]/gu;

/** At most `max` characters (code points, as Enduo counts them); a cut ends in an ellipsis. */
function cut(text: string, max: number): string {
  const characters = Array.from(text);

  return characters.length <= max ? text : `${characters.slice(0, Math.max(0, max - 1)).join('').trimEnd()}…`;
}

/** Enough of a text to fill `max` characters after cleaning, so a huge field costs no more than a large one. */
const bounded = (value: string, max: number): string => value.slice(0, max * 8 + 64);

/** A name or another text of one line: undefined when nothing visible is left. */
export function line(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const text = bounded(value, max).replace(BREAKS, ' ').replace(/\t/g, ' ').replace(INVISIBLE, '').replace(/\s+/gu, ' ').trim();

  return text === '' ? undefined : cut(text, max);
}

/** A note of several lines: the lines stay, with at most one empty line between two of them. */
export function note(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const text = bounded(value, max)
    .replace(BREAKS, '\n')
    .replace(/\t/g, ' ')
    .replace(INVISIBLE_EXCEPT_NEWLINE, '')
    .split('\n')
    .map((row) => row.replace(/\s+/gu, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text === '' ? undefined : cut(text, max);
}
