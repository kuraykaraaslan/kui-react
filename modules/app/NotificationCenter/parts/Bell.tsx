'use client';
// ─── Bell — M1 ───────────────────────────────────────────────────────────────
// Bell trigger + unread badge. Controlled `open` so the parent
// (NotificationCenter / standalone Bell consumer) owns popover state.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
// TODO M4: swap to faBellSolid + animated pulse when realtime event arrives.

export type BellProps = {
  unreadCount: number;
  open?: boolean;
  onToggle?: () => void;
  ariaLabel?: string;
  unreadSuffix?: string;
  className?: string;
};

export function Bell({
  unreadCount,
  open = false,
  onToggle,
  ariaLabel = 'Notifications',
  unreadSuffix = 'unread notifications',
  className,
}: BellProps) {
  const hasUnread = unreadCount > 0;
  const display = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={
        hasUnread ? `${ariaLabel} (${unreadCount} ${unreadSuffix})` : ariaLabel
      }
      aria-haspopup="dialog"
      aria-expanded={open}
      className={cn(
        'relative inline-flex items-center justify-center w-9 h-9 rounded-md',
        'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        open && 'bg-surface-overlay text-text-primary',
        className,
      )}
    >
      <FontAwesomeIcon icon={faBell} className="w-4 h-4" aria-hidden="true" />
      {hasUnread && (
        <span
          aria-label={`${unreadCount} ${unreadSuffix}`}
          className={cn(
            'absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem]',
            'inline-flex items-center justify-center px-1 rounded-full',
            'text-[10px] font-semibold leading-none',
            'bg-error text-text-inverse border-2 border-surface-base',
            'tabular-nums',
          )}
        >
          {display}
        </span>
      )}
    </button>
  );
}
