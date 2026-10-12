import { describe, expect, it } from 'vitest';
import { clockMs, isProblem, plainMsg, typeName } from './format';

describe('debug message formats', () => {
  it('writes the time with milliseconds in local time', () => {
    const ts = new Date(2026, 9, 12, 7, 5, 9, 42).getTime() / 1000;
    expect(clockMs(ts)).toBe('07:05:09.042');
    expect(clockMs(ts + 0.5)).toMatch(/^07:05:09\.5\d\d$/);
    expect(clockMs(undefined)).toMatch(/^\d\d:\d\d:\d\d\.000$/);
  });
  it('names the type of a value', () => {
    expect(typeName(null)).toBe('null');
    expect(typeName(undefined)).toBe('null');
    expect(typeName([1, 2])).toBe('array[2]');
    expect(typeName({ a: 1 })).toBe('object');
    expect(typeName('x')).toBe('string');
    expect(typeName(3)).toBe('number');
    expect(typeName(true)).toBe('boolean');
  });
  it('drops the engine fields of an error message and leaves other values alone', () => {
    expect(plainMsg({ a: 1, _msgid: 'x', _run: 2, _hops: 3, event: {}, b: 2 })).toEqual({ a: 1, b: 2 });
    expect(plainMsg('text')).toBe('text');
    expect(plainMsg([1])).toEqual([1]);
    expect(plainMsg(null)).toBeNull();
  });
  it('knows a problem', () => {
    expect(isProblem({ kind: 'error' })).toBe(true);
    expect(isProblem({ kind: 'warn' })).toBe(true);
    expect(isProblem({ kind: 'msg' })).toBe(false);
  });
});
