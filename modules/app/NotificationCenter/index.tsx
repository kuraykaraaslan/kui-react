'use client';
// ─── NotificationCenter — M1 ─────────────────────────────────────────────────
// Sibling of NotificationSystem (toast layer). This is the **inbox / activity
// feed**: persistent notifications, mark-read, mark-all-read, empty state.
// M2-M6 (filter tabs / grouping / per-notification actions / realtime /
// preferences / full a11y) land on the same surface and are noted as
// `// TODO M*` markers alongside their hooks/parts.

import { useState, useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import { Bell } from './parts/Bell';
import { Panel } from './parts/Panel';
import { useNotifications } from './hooks/useNotifications';
import { useUnreadCount } from './hooks/useUnreadCount';
import {
  DEFAULT_MESSAGES,
  type NotificationCenterMessages,
  type NotificationCenterProps,
  type Notification,
} from './types';

export { Bell } from './parts/Bell';
export type { BellProps } from './parts/Bell';
export type {
  Notification,
  NotificationVariant,
  NotificationCenterProps,
  NotificationCenterMessages,
} from './types';

export function NotificationCenter({
  notifications,
  unreadCount: unreadCountOverride,
  trigger = 'popover',
  onMarkRead,
  onMarkAllRead,
  messages,
  className,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);

  const sorted = useNotifications(notifications);
  const unreadCount = useUnreadCount(notifications, unreadCountOverride);

  const mergedMessages: NotificationCenterMessages = {
    ...DEFAULT_MESSAGES,
    ...(messages ?? {}),
  };

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className={cn('relative inline-block', className)}>
      {/* `data-nc-trigger` lets the Panel ignore clicks that originate on the
          bell — without this the bell's own onClick would race with the
          panel's outside-click dismiss. */}
      <span data-nc-trigger>
        <Bell
          unreadCount={unreadCount}
          open={open}
          onToggle={toggle}
          ariaLabel={mergedMessages.bellLabel}
          unreadSuffix={mergedMessages.unreadSuffix}
        />
      </span>
      <Panel
        open={open}
        onClose={close}
        notifications={sorted}
        unreadCount={unreadCount}
        messages={mergedMessages}
        onMarkRead={onMarkRead}
        onMarkAllRead={onMarkAllRead}
        trigger={trigger}
      />
    </div>
  );
}
