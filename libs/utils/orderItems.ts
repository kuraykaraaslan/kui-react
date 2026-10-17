// Ordering for contributed items (menu items, tabs, commands, top-bar controls).
//
// `order` works like CSS `order`: a missing value counts as 0, lower comes first,
// and ties keep the order the items were given in. Groups rank by the lowest
// `order` among their items, ties again by first appearance, so a list where no
// item sets `order` or `group` comes back exactly as it went in.

export type Orderable = { order?: number };

function orderOf(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** Stable sort by `order` (missing = 0). Returns a new array. */
export function sortByOrder<T>(items: readonly T[], getOrder: (item: T) => number | undefined = (i) => (i as Orderable).order): T[] {
  return items
    .map((item, index) => ({ item, index, order: orderOf(getOrder(item)) }))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map((entry) => entry.item);
}

export type OrderedGroup<T> = { group: string | undefined; items: T[] };

/**
 * Buckets items by group and orders both the groups and the items inside them.
 * Items without a group share one unnamed group.
 */
export function groupByOrder<T>(
  items: readonly T[],
  getGroup: (item: T) => string | undefined,
  getOrder: (item: T) => number | undefined = (i) => (i as Orderable).order,
): OrderedGroup<T>[] {
  const buckets = new Map<string | undefined, { first: number; rank: number; items: T[] }>();
  items.forEach((item, index) => {
    const key = getGroup(item);
    const order = orderOf(getOrder(item));
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.items.push(item);
      bucket.rank = Math.min(bucket.rank, order);
    } else {
      buckets.set(key, { first: index, rank: order, items: [item] });
    }
  });
  return [...buckets.entries()]
    .sort(([, a], [, b]) => a.rank - b.rank || a.first - b.first)
    .map(([group, bucket]) => ({ group, items: sortByOrder(bucket.items, getOrder) }));
}
