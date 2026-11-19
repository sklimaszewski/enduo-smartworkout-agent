import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { line, note } from '../src/text.ts';

describe('line', () => {
  it('removes control and invisible characters and collapses whitespace', () => {
    assert.equal(line('  Bench\tPress\r\n(paused)\u0000\u001b[31m ', 100), 'Bench Press (paused)[31m');
    assert.equal(line('Pull\u200b\u200eUp\u202e\u2066 \u00a0 wide\ufeff', 100), 'PullUp wide');
    assert.equal(line('a\u2028b\u2029c\u0085d', 100), 'a b c d');
    assert.equal(line(`Row${String.fromCodePoint(0xe0041, 0xe0042)}`, 100), 'Row');
  });

  it('drops half a surrogate pair and keeps a whole one', () => {
    assert.equal(line('Squat \ud83d', 100), 'Squat');
    assert.equal(line('Squat \ud83d\udcaa', 100), 'Squat \ud83d\udcaa');
  });

  it('cuts a long text with an ellipsis, counting characters and not code units', () => {
    assert.equal(line('abcdefghij', 10), 'abcdefghij');
    assert.equal(line('abcdefghijk', 10), 'abcdefghi…');
    assert.equal(line('\ud83d\udcaa'.repeat(6), 5), `${'\ud83d\udcaa'.repeat(4)}…`);
    assert.equal(Array.from(line('x'.repeat(100_000), 120) ?? '').length, 120);
  });

  it('gives nothing for a text without a visible character, or for something that is no text', () => {
    assert.equal(line(' \u0007\u200b\n ', 10), undefined);
    assert.equal(line(null, 10), undefined);
    assert.equal(line({ toString: () => 'x' }, 10), undefined);
  });
});

describe('note', () => {
  it('keeps the lines of a note and at most one empty line between them', () => {
    assert.equal(note('Felt strong.\r\n\r\n\r\n\r\n  Next time:\tmore  weight \u0000\n', 100), 'Felt strong.\n\nNext time: more weight');
  });

  it('cuts a long note with an ellipsis instead of dropping it', () => {
    const cut = note('word '.repeat(10_000), 2000) ?? '';

    assert.equal(Array.from(cut).length <= 2000, true);
    assert.equal(cut.endsWith('…'), true);
    assert.equal(cut.startsWith('word word'), true);
  });
});
