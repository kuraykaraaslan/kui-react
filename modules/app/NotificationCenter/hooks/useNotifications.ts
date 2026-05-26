'use client';
// ─── useNotifications — M1 ───────────────────────────────────────────────────
// Identity hook around the controlled `notifications` prop. M1 just sorts the
// list newest-first; richer behaviour (filter / search / grouping) lands in
// M2 and is wired through useGrouping.

import { useMemo } from 'react';
import type { Notification } from '../types';

function toMillis(value: Notification['createdAt']): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

export function useNotifications(notifications: Notification[]): Notification[] {
  return useMemo(() => {
    // Stable, newest-first sort — leaves the caller's array untouched.
    return [...notifications].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  }, [notifications]);

  // TODO M2: apply FilterState (tab + search) before sorting.
  // TODO M3: hide archived; surface pinned at the top.
}
