'use client';
// ─── NotificationItem — M1 ───────────────────────────────────────────────────
// Single feed row: variant icon (or actor avatar) + title + meta line
// (source · time-ago) + actor. Marks read on hover or click — caller decides
// via `onMarkRead`.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faCircleCheck,
  faTriangleExclamation,
  faCircleXmark,
  faAt,
  faGear,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { Notification, NotificationVariant } from '../types';

const VARIANT_ICON: Record<NotificationVariant, IconDefinition> = {
  info: faCircleInfo,
  success: faCircleCheck,
  warning: faTriangleExclamation,
  error: faCircleXmark,
  mention: faAt,
  system: faGear,
};

const VARIANT_COLOR: Record<NotificationVariant, string> = {
  info: 'bg-info-subtle text-info',
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  error: 'bg-error-subtle text-error',
  mention: 'bg-primary-subtle text-primary',
  system: 'bg-surface-overlay text-text-secondary',
};

function formatRelativeTime(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${Math.max(0, diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const diffDay = Math.floor(diff / 86400);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export type NotificationItemProps = {
  notification: Notification;
  onMarkRead?: (id: string) => void | Promise<void>;
  markReadLabel?: string;
};

export function NotificationItem({
  notification,
  onMarkRead,
  markReadLabel = 'Mark as read',
}: NotificationItemProps) {
  const variant: NotificationVariant = notification.variant ?? 'info';
  const icon = notification.icon ?? VARIANT_ICON[variant] ?? faBell;
  const isUnread = !notification.read;

  const handleActivate = () => {
    if (isUnread) onMarkRead?.(notification.id);
  };

  // TODO M3: render inline actions (View / Approve / Decline / Reply) here.
  // TODO M6: full keyboard nav (J/K, Enter, M, A) lives on the panel host.

  const RowTag = notification.href ? 'a' : 'div';
  const rowProps = notification.href
    ? { href: notification.href }
    : { role: 'button' as const, tabIndex: 0 };

  return (
    <li
      className={cn(
        'group relative flex gap-3 px-4 py-3 transition-colors',
        'border-b border-border last:border-b-0',
        'hover:bg-surface-overlay focus-within:bg-surface-overlay',
        isUnread && 'bg-primary-subtle/40',
      )}
      onMouseEnter={handleActivate}
    >
      {/* Unread dot — visually anchors the row. */}
      {isUnread && (
        <span
          aria-hidden="true"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary"
        />
      )}

      {/* Variant icon or actor avatar. */}
      <div className="shrink-0 mt-0.5">
        {notification.actorAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={notification.actorAvatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              VARIANT_COLOR[variant],
            )}
          >
            <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Title + message + meta. */}
      <RowTag
        {...rowProps}
        onClick={handleActivate}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (!notification.href && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleActivate();
          }
        }}
        className={cn(
          'flex-1 min-w-0 outline-none cursor-pointer',
          'focus-visible:ring-2 focus-visible:ring-border-focus rounded',
          notification.href && 'no-underline',
        )}
      >
        <p
          className={cn(
            'text-sm leading-snug',
            isUnread
              ? 'font-semibold text-text-primary'
              : 'font-medium text-text-secondary',
          )}
        >
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-text-secondary leading-snug mt-0.5 line-clamp-2">
            {notification.message}
          </p>
        )}
        <p className="flex flex-wrap items-center gap-x-1.5 mt-1 text-[11px] text-text-secondary">
          {notification.actor && (
            <span className="font-medium text-text-primary">{notification.actor}</span>
          )}
          {notification.actor && notification.source && <span aria-hidden="true">·</span>}
          {notification.source && <span>{notification.source}</span>}
          {(notification.actor || notification.source) && (
            <span aria-hidden="true">·</span>
          )}
          <time dateTime={new Date(notification.createdAt).toISOString()}>
            {formatRelativeTime(notification.createdAt)}
          </time>
        </p>
      </RowTag>

      {/* Mark-read affordance — visible on hover/focus when unread. */}
      {isUnread && onMarkRead && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          aria-label={markReadLabel}
          className={cn(
            'shrink-0 self-start w-6 h-6 rounded-md',
            'inline-flex items-center justify-center',
            'text-text-secondary hover:text-text-primary hover:bg-surface-base',
            'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            'transition-opacity',
          )}
        >
          <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
