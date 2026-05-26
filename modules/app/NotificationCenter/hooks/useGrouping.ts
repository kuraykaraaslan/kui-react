'use client';
// ─── useGrouping — M2 stub ───────────────────────────────────────────────────
// M2 will group notifications by source ("GitHub · 3 new") or by time bucket
// (Today / Yesterday / Last 7 days / Older). For M1 we just return the input
// untouched so the panel renders a flat list.

import type { Notification } from '../types';

export type GroupingMode = 'source' | 'time' | 'none';

// TODO M2: implement source + time grouping. Return shape:
//   { key: string; label: string; items: Notification[] }[]
export function useGrouping(
  notifications: Notification[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _mode: GroupingMode = 'none',
): Notification[] {
  return notifications;
}
