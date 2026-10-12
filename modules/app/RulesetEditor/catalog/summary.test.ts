import { describe, expect, it } from 'vitest';
import { formatDurationMs, formatValue, summaryOf } from './summary';
import type { BlockDecl } from './types';

const decl: BlockDecl = {
  type: 'action.demo', title: 'Demo',
  summary: '${channel} ${mode} for ${hold} on ${days}',
  params: {
    channel: { type: 'source', default: 3 },
    mode: { type: 'enum', options: ['high', 'low'], option_labels: { high: 'Upper' }, default: 'high' },
    hold: { type: 'duration', default: 60000 },
    days: { type: 'weekdays' },
  },
};

describe('formatDurationMs', () => {
  it('picks a readable unit', () => {
    expect([250, 1000, 1500, 60000, 90000, 3600000, 5400000].map(formatDurationMs)).toEqual(['250 ms', '1 s', '1.5 s', '1 min', '1.5 min', '1 h', '1.5 h']);
    expect(formatDurationMs(Number.NaN)).toBe('NaN');
  });
});

describe('formatValue', () => {
  it('writes value params and plain values for people', () => {
    expect(formatValue({ kind: 'path', v: 'msg.payload' })).toBe('msg.payload');
    expect(formatValue({ kind: 'num', v: 5 })).toBe('5');
    expect(formatValue({ kind: 'now' })).toBe('now');
    expect(formatValue({ kind: 'str', v: '' })).toBe('—');
    expect(formatValue({ kind: 'json', v: { a: 1 } })).toBe('{"a":1}');
    expect(formatValue({ kind: 'json', v: '{"a":1}' })).toBe('{"a":1}');
    expect(formatValue({ a: 1 })).toBe('{"a":1}');
    expect(formatValue(7)).toBe('7');
  });
});

describe('summaryOf', () => {
  it('fills the template from the params, with defaults, labels and units', () => {
    expect(summaryOf(decl, { days: [1, 3, 7] })).toBe('3 Upper for 1 min on Mon Wed Sun');
    expect(summaryOf(decl, { channel: 'adc1', mode: 'low', hold: 2500, days: [] })).toBe('adc1 low for 2.5 s on ');
  });
  it('shows a dash for an empty value', () => {
    expect(summaryOf(decl, { channel: '', days: undefined })).toBe('— Upper for 1 min on —');
  });
  it('is empty for a block without a template or an unknown block', () => {
    expect(summaryOf({ params: {} }, {})).toBe('');
    expect(summaryOf(undefined, {})).toBe('');
  });
  it('hides secrets, writes bools and lists', () => {
    const d: BlockDecl = { type: 'a.b', title: 'x', summary: '${pw} ${flag} ${list} ${n}', params: { pw: { type: 'secret' }, flag: { type: 'bool' }, list: { type: 'list' } } };
    expect(summaryOf(d, { pw: 'x', flag: true, list: ['a', { kind: 'num', v: 2 }], n: 4 })).toBe('•••• on a, 2 4');
    expect(summaryOf(d, { pw: { $secret: true }, flag: false })).toBe('•••• off — —');
  });
  it('treats a key ending in _ms as a duration', () => {
    expect(summaryOf({ summary: 'wait ${delay_ms}', params: {} }, { delay_ms: 1500 })).toBe('wait 1.5 s');
  });
});
