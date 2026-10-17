import { describe, it, expect } from 'vitest';
import { groupByOrder, sortByOrder } from './orderItems';

describe('sortByOrder', () => {
  it('works like CSS order: missing is 0, lower first, ties keep input order', () => {
    const items = [
      { id: 'c', order: 2 },
      { id: 'a' },
      { id: 'n', order: -1 },
      { id: 'b' },
      { id: 'd', order: 2 },
    ];
    expect(sortByOrder(items).map((i) => i.id)).toEqual(['n', 'a', 'b', 'c', 'd']);
  });

  it('returns a new array and leaves the input alone', () => {
    const items = [{ order: 2 }, { order: 1 }];
    const sorted = sortByOrder(items);
    expect(sorted).not.toBe(items);
    expect(items[0].order).toBe(2);
  });

  it('treats a non-finite order as missing', () => {
    const items = [{ id: 'x', order: Number.NaN }, { id: 'y', order: -1 }];
    expect(sortByOrder(items).map((i) => i.id)).toEqual(['y', 'x']);
  });
});

describe('groupByOrder', () => {
  it('ranks groups by their lowest order and sorts inside each group', () => {
    const items = [
      { id: 'sign-out', group: 'session', order: 1000 },
      { id: 'settings', group: 'account', order: 200 },
      { id: 'profile', group: 'account', order: 100 },
      { id: 'dnd', group: 'status', order: 50 },
    ];
    const groups = groupByOrder(items, (i) => i.group);
    expect(groups.map((g) => g.group)).toEqual(['status', 'account', 'session']);
    expect(groups[1].items.map((i) => i.id)).toEqual(['profile', 'settings']);
  });

  it('without any order, keeps groups in order of first appearance', () => {
    const items = [
      { label: 'Go home', group: 'Navigation' },
      { label: 'New', group: 'Actions' },
      { label: 'Go back', group: 'Navigation' },
    ];
    const groups = groupByOrder(items, (i) => i.group);
    expect(groups.map((g) => g.group)).toEqual(['Navigation', 'Actions']);
    expect(groups[0].items.map((i) => i.label)).toEqual(['Go home', 'Go back']);
  });

  it('items without a group share one unnamed group', () => {
    const groups = groupByOrder([{ id: 1 }, { id: 2, group: 'x' }, { id: 3 }], (i: { group?: string }) => i.group);
    expect(groups).toHaveLength(2);
    expect(groups[0].group).toBeUndefined();
    expect(groups[0].items).toHaveLength(2);
  });
});
