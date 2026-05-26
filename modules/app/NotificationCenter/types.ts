// ─── NotificationCenter — types (M1) ─────────────────────────────────────────
// Sibling of the toast layer (modules/app/NotificationSystem.tsx). This is the
// **inbox / activity feed**: persistent, mark-read, grouped, filterable.
// M2-M6 stubs live alongside their hooks as `// TODO M*` markers.

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type NotificationVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'mention'
  | 'system';

export type Notification = {
  id: string;
  title: string;
  message?: string;
  /** ISO string or Date — rendered as time-ago. */
  createdAt: string | Date;
  /** Read state — drives unread badge + dimming. */
  read?: boolean;
  /** Optional source label ("GitHub", "Stripe", ...). */
  source?: string;
  /** Optional actor name ("Ada Lovelace"). */
  actor?: string;
  /** Optional actor avatar URL. Falls back to FA icon when absent. */
  actorAvatar?: string;
  /** Visual variant — picks icon + color. */
  variant?: NotificationVariant;
  /** Optional FA icon override (defaults to variant icon). */
  icon?: IconDefinition;
  /** Optional deep-link URL. */
  href?: string;
  // TODO M3: actions[], snoozedUntil, archived, pinned, muted
  // TODO M2: tags[] for filter tabs (mentions / assigned / following)
};

// TODO M2: NotificationGroup ({ key: string; label: string; items: Notification[] })
// TODO M2: FilterState ({ tab: 'all' | 'unread' | 'mentions' | 'assigned'; search: string })

export type NotificationCenterMessages = {
  bellLabel: string;        // "Notifications"
  panelTitle: string;       // "Inbox"
  unreadSuffix: string;     // "unread notifications"
  markAllRead: string;      // "Mark all as read"
  markRead: string;         // "Mark as read"
  emptyTitle: string;       // "You're all caught up"
  emptyMessage: string;     // "New notifications will appear here."
  // TODO M2: filterAll, filterUnread, filterMentions, filterAssigned, searchPlaceholder
  // TODO M3: snooze, archive, mute, pin, viewAll
  // TODO M5: preferences
};

export const DEFAULT_MESSAGES: NotificationCenterMessages = {
  bellLabel: 'Notifications',
  panelTitle: 'Inbox',
  unreadSuffix: 'unread notifications',
  markAllRead: 'Mark all as read',
  markRead: 'Mark as read',
  emptyTitle: "You're all caught up",
  emptyMessage: 'New notifications will appear here.',
};

export type NotificationCenterProps = {
  /** Controlled notification list — caller owns the data source. */
  notifications: Notification[];
  /** Explicit unread count override; otherwise derived from `notifications`. */
  unreadCount?: number;
  /** Popover (default) anchors to the bell; drawer slides from the side. */
  trigger?: 'popover' | 'drawer';
  /** Called when a single notification is marked read (hover or click). */
  onMarkRead?: (id: string) => void | Promise<void>;
  /** Called when the toolbar "Mark all as read" button is clicked. */
  onMarkAllRead?: () => void | Promise<void>;
  /** Optional i18n overrides — undefined keys fall back to DEFAULT_MESSAGES. */
  messages?: Partial<NotificationCenterMessages>;
  /** Optional className for the bell trigger wrapper. */
  className?: string;
  // TODO M2: groupBy ('source' | 'time' | 'none'), filters, search
  // TODO M3: onArchive, onSnooze, onMuteSource, onPin
  // TODO M4: realtime adapter ({ url, protocol }), enableBrowserPush, enableSound
  // TODO M5: onSync, preferencesHref, onPreferencesOpen
  // TODO M6: onTelemetry, full keyboard nav
};
