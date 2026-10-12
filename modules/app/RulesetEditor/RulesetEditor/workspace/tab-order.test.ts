import { describe, expect, it } from 'vitest';
import { orderTabs, placeId, readTabOrder, reorder, savedFor, TAB_ORDER_KEY, writeTabOrder } from './tab-order';

const tabs = (...ids: string[]) => ids.map((id) => ({ id }));
const ids = (l: { id: string }[]) => l.map((x) => x.id);

describe('orderTabs', () => {
  it('follows the saved order and puts the unknown last in host order', () => {
    expect(ids(orderTabs(tabs('a', 'b', 'c', 'd'), ['c', 'a']))).toEqual(['c', 'a', 'b', 'd']);
  });
  it('keeps the host order without a saved one', () => {
    expect(ids(orderTabs(tabs('a', 'b'), undefined))).toEqual(['a', 'b']);
    expect(ids(orderTabs(tabs('a', 'b'), null))).toEqual(['a', 'b']);
  });
  it('ignores saved ids that are gone', () => {
    expect(ids(orderTabs(tabs('a', 'b'), ['x', 'b', 'y']))).toEqual(['b', 'a']);
  });
});

describe('placeId', () => {
  it('moves an id to an index', () => {
    expect(placeId(['a', 'b', 'c'], 'a', 2)).toEqual(['b', 'c', 'a']);
    expect(placeId(['a', 'b', 'c'], 'c', 0)).toEqual(['c', 'a', 'b']);
  });
  it('clamps the index and ignores an unknown id', () => {
    expect(placeId(['a', 'b'], 'a', 99)).toEqual(['b', 'a']);
    expect(placeId(['a', 'b'], 'b', -4)).toEqual(['b', 'a']);
    expect(placeId(['a', 'b'], 'zz', 0)).toEqual(['a', 'b']);
  });
  it('does not change its argument', () => {
    const l = ['a', 'b'];
    placeId(l, 'a', 1);
    expect(l).toEqual(['a', 'b']);
  });
});

describe('reorder', () => {
  it('keeps the other kind as it was', () => {
    const o = reorder({ subflows: ['s1'] }, 'flow', ['a', 'b'], 'b', 0);
    expect(o).toEqual({ flows: ['b', 'a'], subflows: ['s1'] });
    expect(savedFor(o, 'flow')).toEqual(['b', 'a']);
    expect(savedFor(o, 'subflow')).toEqual(['s1']);
  });
});

describe('storage', () => {
  it('round trips', () => {
    const data = new Map<string, string>();
    const s = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
    expect(writeTabOrder({ flows: ['b', 'a'] }, () => s)).toBe(true);
    expect(data.has(TAB_ORDER_KEY)).toBe(true);
    expect(readTabOrder(() => s)).toEqual({ flows: ['b', 'a'], subflows: undefined });
  });
  it('is empty when storage is blocked, missing or broken', () => {
    const blocked = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
    expect(readTabOrder(() => blocked)).toEqual({});
    expect(readTabOrder(() => null)).toEqual({});
    expect(readTabOrder(() => ({ getItem: () => '{oops', setItem: () => undefined }))).toEqual({});
    expect(writeTabOrder({}, () => blocked)).toBe(false);
    expect(writeTabOrder({}, () => null)).toBe(false);
  });
  it('drops values that are not id lists', () => {
    expect(readTabOrder(() => ({ getItem: () => JSON.stringify({ flows: 'a', subflows: ['x', 3] }), setItem: () => undefined }))).toEqual({ flows: undefined, subflows: ['x'] });
  });
});
