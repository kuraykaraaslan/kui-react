'use client';
// ─── useUnreadCount — M1 ─────────────────────────────────────────────────────
// Derives the unread count from `notifications` unless the caller passes an
// explicit override (e.g. from a server-side counter).

import { useMemo } from 'react';
import type { Notification } from '../types';

export function useUnreadCount(
  notifications: Notification[],
  override?: number,
): number {
  return useMemo(() => {
    if (typeof override === 'number') return Math.max(0, override);
    return notifications.reduce((n, item) => (item.read ? n : n + 1), 0);
  }, [notifications, override]);
}
