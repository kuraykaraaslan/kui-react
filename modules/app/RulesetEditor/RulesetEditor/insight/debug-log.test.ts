import { describe, expect, it } from 'vitest';
import { RING_MAX, emptyLog, exportFileName, exportText, filterLog, messageText, readNew } from './debug-log';
import type { DebugMessage } from './types';

const m = (seq: number, kind: DebugMessage['kind'] = 'msg', extra: Partial<DebugMessage> = {}): DebugMessage => ({ seq, ts: 1000 + seq, node: 'n1', kind, msg: { v: seq }, ...extra });

describe('readNew', () => {
  it('reads only what is beyond lastSeq', () => {
    const a = readNew(emptyLog, [m(1), m(2)], false);
    expect(a.lastSeq).toBe(2);
    const b = readNew(a, [m(1), m(2), m(3)], false);
    expect(b.items.map((x) => x.seq)).toEqual([1, 2, 3]);
  });
  it('reads nothing while paused and catches up on resume', () => {
    const a = readNew(emptyLog, [m(1)], false);
    const paused = readNew(a, [m(1), m(2), m(3)], true);
    expect(paused).toBe(a);
    expect(readNew(paused, [m(1), m(2), m(3)], false).items.map((x) => x.seq)).toEqual([1, 2, 3]);
  });
  it('keeps the last 300', () => {
    const ring = Array.from({ length: 450 }, (_, i) => m(i + 1));
    const l = readNew(emptyLog, ring, false);
    expect(l.items).toHaveLength(RING_MAX);
    expect(l.items[0].seq).toBe(151);
    expect(l.items.at(-1)!.seq).toBe(450);
  });
});

describe('filterLog', () => {
  const items = [m(1), m(2, 'error', { text: 'x' }), m(3, 'warn', { text: 'w' }), m(4, 'msg', { node: 'n2' })];
  it('filters by kind', () => {
    expect(filterLog(items, 'all')).toHaveLength(4);
    expect(filterLog(items, 'problem').map((x) => x.seq)).toEqual([2, 3]);
    expect(filterLog(items, 'msg').map((x) => x.seq)).toEqual([1, 4]);
  });
  it('filters by the selected block', () => {
    expect(filterLog(items, 'msg', { selected: 'n2' }).map((x) => x.seq)).toEqual([4]);
  });
});

describe('export', () => {
  it('writes head and value, errors as text', () => {
    expect(messageText(m(1, 'msg', { topic: 't' }), 'Gate')).toBe(`${new Date(1001000).toISOString()}  Gate  topic t\nmsg = {\n  "v": 1\n}`);
    expect(messageText(m(2, 'error', { text: 'bad' }), 'Gate')).toContain('msg = bad');
  });
  it('joins with a blank line, ends with a newline, empty gives empty', () => {
    const t = exportText([m(1, 'warn', { text: 'a' }), m(2, 'warn', { text: 'b' })], () => 'N');
    expect(t.endsWith('b\n')).toBe(true);
    expect(t.split('\n\n')).toHaveLength(2);
    expect(exportText([])).toBe('');
  });
  it('names the file after the chain', () => {
    expect(exportFileName('boiler')).toBe('debug-boiler.txt');
    expect(exportFileName(undefined)).toBe('debug-flow.txt');
  });
});
