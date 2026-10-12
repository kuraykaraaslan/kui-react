import { describe, expect, it } from 'vitest';
import {
  choicesOf, DURATION_UNITS, isMissingChoice, isValueParam, itemSpec, joinList, newRuleRow, numberFromText, parseJsonDraft,
  rowSchema, setField, splitDuration, splitList, toggleIn, toMs, valueOfKind, VALUE_KINDS,
} from './field-utils';
import type { ParamSpec } from '../catalog/types';

describe('duration', () => {
  it('splits into the largest unit that divides evenly', () => {
    expect([0, 250, 1000, 1500, 60000, 90000, 3600000, 7200000].map((ms) => splitDuration(ms))).toEqual([
      { amount: 0, unit: 'ms' }, { amount: 250, unit: 'ms' }, { amount: 1, unit: 's' }, { amount: 1500, unit: 'ms' },
      { amount: 1, unit: 'min' }, { amount: 90, unit: 's' }, { amount: 1, unit: 'h' }, { amount: 2, unit: 'h' },
    ]);
    expect(splitDuration(Number.NaN)).toEqual({ amount: 0, unit: 'ms' });
  });
  it('turns an amount and unit into milliseconds', () => {
    expect(DURATION_UNITS.map((u) => toMs(2, u.unit))).toEqual([2, 2000, 120000, 7200000]);
    expect(toMs(0.5, 's')).toBe(500);
    expect(toMs(1.0004, 'ms')).toBe(1);
  });
  it('round trips', () => {
    for (const ms of [1, 999, 1000, 61000, 3601000, 86400000]) {
      const { amount, unit } = splitDuration(ms);
      expect(toMs(amount, unit)).toBe(ms);
    }
  });
});

describe('lists and numbers', () => {
  it('splits comma text, trimming and skipping empties', () => {
    expect(splitList(' a, b ,, c ,')).toEqual(['a', 'b', 'c']);
    expect(splitList('')).toEqual([]);
    expect(joinList(['a', 2, 'c'])).toBe('a, 2, c');
    expect(joinList('x')).toBe('');
    expect(joinList(undefined)).toBe('');
  });
  it('reads number text', () => {
    expect(numberFromText('')).toBeUndefined();
    expect(numberFromText('  ')).toBeUndefined();
    expect(numberFromText('12.5')).toBe(12.5);
    expect(numberFromText('-3')).toBe(-3);
    expect(numberFromText('abc')).toBeNull();
    expect(numberFromText('1e3')).toBe(1000);
  });
  it('toggles a value in a list', () => {
    expect(toggleIn(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleIn(['a', 'b'], 'a')).toEqual(['b']);
    expect(toggleIn(undefined, 3)).toEqual([3]);
    expect(toggleIn('nope', 'a')).toEqual(['a']);
  });
});

describe('json drafts', () => {
  it('parses, treats empty as no value, and explains errors', () => {
    expect(parseJsonDraft('{"a":[1]}')).toEqual({ ok: true, value: { a: [1] } });
    expect(parseJsonDraft('  ')).toEqual({ ok: true, value: undefined });
    const bad = parseJsonDraft('{oops');
    expect(bad.ok).toBe(false);
    expect(bad.ok === false && bad.error.length).toBeGreaterThan(0);
  });
});

describe('value params', () => {
  it('recognises them and builds one per kind', () => {
    expect(isValueParam({ kind: 'num', v: 1 })).toBe(true);
    expect(isValueParam('x')).toBe(false);
    expect(isValueParam(null)).toBe(false);
    expect(isValueParam([])).toBe(false);
    expect(Object.fromEntries(VALUE_KINDS.map((k) => [k, valueOfKind(k)]))).toEqual({
      num: { kind: 'num', v: 0 }, str: { kind: 'str', v: '' }, bool: { kind: 'bool', v: true }, json: { kind: 'json', v: '' },
      path: { kind: 'path', v: 'msg.payload' }, expr: { kind: 'expr', v: '' }, env: { kind: 'env', v: '' }, now: { kind: 'now' },
    });
  });
});

describe('setField', () => {
  it('sets or removes a key on a copy', () => {
    const a = { x: 1, y: 2 };
    expect(setField(a, 'x', 5)).toEqual({ x: 5, y: 2 });
    expect(setField(a, 'y', undefined)).toEqual({ x: 1 });
    expect(a).toEqual({ x: 1, y: 2 });
  });
});

describe('rules fields', () => {
  const items: Record<string, ParamSpec> = {
    op: { type: 'enum', options: ['eq', 'gt'], default: 'gt' },
    value: { type: 'value', default: { kind: 'num', v: 1 } },
    label: { type: 'string' },
  };
  it('starts a row with the first option or the default', () => {
    expect(newRuleRow(items)).toEqual({ op: 'eq', value: { kind: 'num', v: 1 } });
  });
  it('does not share defaults between rows', () => {
    const a = newRuleRow(items) as { value: { v: number } };
    a.value.v = 9;
    expect((newRuleRow(items) as { value: { v: number } }).value.v).toBe(1);
  });
  it('tells a row schema from a single item spec', () => {
    expect(rowSchema({ items })).toBe(items);
    expect(rowSchema({ items: { type: 'enum', options: ['a'] } })).toEqual({});
    expect(rowSchema({})).toEqual({});
    expect(itemSpec({ items: { type: 'enum', options: ['a'] } })).toEqual({ type: 'enum', options: ['a'] });
    expect(itemSpec({ items })).toBeNull();
    expect(itemSpec({})).toBeNull();
  });
});

describe('choices', () => {
  const choices = { brokers: [{ value: 'lan', label: 'LAN broker' }, { value: 2, label: 'Cloud' }] };
  it('uses the host list of a source field', () => {
    expect(choicesOf({ type: 'source', source: 'brokers' }, choices)).toEqual(choices.brokers);
    expect(choicesOf({ type: 'source', source: 'other' }, choices)).toEqual([]);
    expect(choicesOf({ type: 'source', source: 'brokers' }, undefined)).toEqual([]);
  });
  it('uses the host list or the options of the items of a list field', () => {
    expect(choicesOf({ type: 'list', items: { type: 'string', source: 'brokers' } }, choices)).toEqual(choices.brokers);
    const enumItems: ParamSpec = { type: 'list', items: { type: 'enum', options: ['up', 'down'], option_labels: { up: 'Link up' } } };
    expect(choicesOf(enumItems, undefined)).toEqual([{ value: 'up', label: 'Link up' }, { value: 'down', label: 'down' }]);
  });
  it('lists the options of an enum', () => {
    expect(choicesOf({ type: 'enum', options: ['a', 1], option_labels: { a: 'Alpha' } }, undefined)).toEqual([{ value: 'a', label: 'Alpha' }, { value: 1, label: '1' }]);
  });
  it('finds a saved value the choices no longer offer', () => {
    expect(isMissingChoice('lan', choices.brokers)).toBe(false);
    expect(isMissingChoice('2', choices.brokers)).toBe(false);
    expect(isMissingChoice('gone', choices.brokers)).toBe(true);
    expect(isMissingChoice('', choices.brokers)).toBe(false);
    expect(isMissingChoice(undefined, [])).toBe(false);
  });
});
