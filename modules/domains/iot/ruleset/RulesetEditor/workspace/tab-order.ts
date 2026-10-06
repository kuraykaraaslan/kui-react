/**
 * The order of the flow tabs. Kept in this browser (`kui-ruleset-tab-order`), one list for flows and one for
 * subflows. A tab not in the list goes last, in the host's order; when storage is blocked the host's order is used.
 */

export const TAB_ORDER_KEY = 'kui-ruleset-tab-order';

export type TabKind = 'flow' | 'subflow';

export type TabOrder = { flows?: string[]; subflows?: string[] };

type OrderStorage = Pick<Storage, 'getItem' | 'setItem'>;

const field = (kind: TabKind) => (kind === 'subflow' ? 'subflows' : 'flows') as keyof TabOrder;

function defaultStorage(): OrderStorage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

/** `list` in the saved order; what the saved list lacks follows in its own order */
export function orderTabs<T extends { id: string }>(list: T[], saved: string[] | null | undefined): T[] {
  const rank = (id: string) => { const i = Array.isArray(saved) ? saved.indexOf(id) : -1; return i < 0 ? 1e6 : i; };
  return list.map((x, i) => [x, i] as const).sort((a, b) => rank(a[0].id) - rank(b[0].id) || a[1] - b[1]).map((p) => p[0]);
}

/** `id` moved to index `to` (clamped) of `ids`; the same list when `id` is not in it */
export function placeId(ids: string[], id: string, to: number): string[] {
  const from = ids.indexOf(id);
  if (from < 0) return ids;
  const next = ids.slice();
  next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, id);
  return next;
}

/** the saved order, or `{}` when there is none or storage is blocked */
export function readTabOrder(getStorage: () => OrderStorage | null = defaultStorage): TabOrder {
  try {
    const raw: unknown = JSON.parse(getStorage()?.getItem(TAB_ORDER_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return {};
    const o = raw as Record<string, unknown>;
    const ids = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : undefined);
    return { flows: ids(o.flows), subflows: ids(o.subflows) };
  } catch {
    return {};
  }
}

/** false when the browser cannot keep it */
export function writeTabOrder(order: TabOrder, getStorage: () => OrderStorage | null = defaultStorage): boolean {
  try {
    const s = getStorage();
    if (!s) return false;
    s.setItem(TAB_ORDER_KEY, JSON.stringify(order));
    return true;
  } catch {
    return false;
  }
}

/** the order after `id` of `kind` was put at index `to` among the tabs `shown` (in the order they are shown) */
export function reorder(order: TabOrder, kind: TabKind, shown: string[], id: string, to: number): TabOrder {
  return { ...order, [field(kind)]: placeId(shown, id, to) };
}

export function savedFor(order: TabOrder, kind: TabKind): string[] | undefined {
  return order[field(kind)];
}
