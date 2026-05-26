'use client';
// ─── Panel — M1 ──────────────────────────────────────────────────────────────
// Dropdown panel anchored to the Bell trigger. M1 only supports `trigger="popover"`;
// the `drawer` variant routes through the same panel for now and is upgraded
// to a real side-drawer in M3 alongside per-notification actions.

import { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import type { Notification, NotificationCenterMessages } from '../types';
import { NotificationItem } from './NotificationItem';
import { EmptyState } from './EmptyState';
import { BulkActions } from './BulkActions';
import { FilterTabs } from './FilterTabs';
import { GroupHeader } from './GroupHeader';
import { PreferencesLink } from './PreferencesLink';

export type PanelProps = {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  messages: NotificationCenterMessages;
  onMarkRead?: (id: string) => void | Promise<void>;
  onMarkAllRead?: () => void | Promise<void>;
  trigger?: 'popover' | 'drawer';
};

export function Panel({
  open,
  onClose,
  notifications,
  unreadCount,
  messages,
  onMarkRead,
  onMarkAllRead,
  trigger = 'popover',
}: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Outside click + Escape dismiss ────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      const target = e.target as Node | null;
      if (panelRef.current && target && !panelRef.current.contains(target)) {
        // Only close if click is outside the trigger as well — host wraps both
        // bell + panel in a relative container, and the bell toggle handles
        // its own click. Cheap heuristic: check for a [data-nc-trigger] ancestor.
        const isTrigger =
          target instanceof Element && target.closest('[data-nc-trigger]');
        if (!isTrigger) onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isEmpty = notifications.length === 0;
  // TODO M2: render FilterTabs above the list with active state + counts.
  // TODO M2: render GroupHeader rows between notification groups.
  // TODO M5: render PreferencesLink in the panel footer.
  // Render the M2/M5 stubs so they tree-shake but stay imported in M1.
  void FilterTabs;
  void GroupHeader;
  void PreferencesLink;

  // M1: popover + drawer share the same panel surface; M3 swaps drawer to a
  // side-anchored sheet. The `trigger` value here only nudges the alignment.
  const drawerLike = trigger === 'drawer';

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={messages.panelTitle}
      aria-live="polite"
      className={cn(
        'absolute z-[70] mt-2 right-0',
        'w-[22rem] max-w-[calc(100vw-1rem)]',
        'rounded-lg border border-border bg-surface-base shadow-xl',
        'overflow-hidden',
        drawerLike && 'w-[24rem]',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-surface-raised">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold text-text-primary truncate">
            {messages.panelTitle}
          </h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-1.5 h-5 rounded-full bg-error text-text-inverse text-[10px] font-semibold tabular-nums">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <BulkActions
            unreadCount={unreadCount}
            onMarkAllRead={onMarkAllRead}
            markAllReadLabel={messages.markAllRead}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              'inline-flex items-center justify-center w-7 h-7 rounded-md',
              'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'transition-colors',
            )}
          >
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Body */}
      {isEmpty ? (
        <EmptyState title={messages.emptyTitle} message={messages.emptyMessage} />
      ) : (
        <ul className="max-h-[28rem] overflow-y-auto divide-y divide-border">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
              markReadLabel={messages.markRead}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
