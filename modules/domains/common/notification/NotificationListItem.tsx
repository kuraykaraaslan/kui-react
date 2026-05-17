'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faMessage,
  faShoppingBag,
  faTriangleExclamation,
  faCircleCheck,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type NotificationKind = 'order' | 'message' | 'system' | 'alert' | 'success' | 'social';

type NotificationListItemProps = {
  kind: NotificationKind;
  title: string;
  body?: string;
  createdAt: Date | string;
  read?: boolean;
  href?: string;
  className?: string;
  onMarkRead?: () => void;
};

const KIND_META: Record<NotificationKind, { icon: IconDefinition; tone: string }> = {
  order:   { icon: faShoppingBag,         tone: 'bg-primary-subtle text-primary' },
  message: { icon: faMessage,             tone: 'bg-info-subtle text-info' },
  system:  { icon: faBell,                tone: 'bg-surface-overlay text-text-secondary' },
  alert:   { icon: faTriangleExclamation, tone: 'bg-warning-subtle text-warning' },
  success: { icon: faCircleCheck,         tone: 'bg-success-subtle text-success' },
  social:  { icon: faUser,                tone: 'bg-secondary/10 text-secondary' },
};

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotificationListItem({
  kind,
  title,
  body,
  createdAt,
  read,
  href,
  className,
  onMarkRead,
}: NotificationListItemProps) {
  const meta = KIND_META[kind];
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        'group relative flex items-start gap-3 border-b border-border last:border-b-0 px-4 py-3 transition-colors',
        !read && 'bg-primary-subtle/30',
        href && 'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus',
        className,
      )}
    >
      {!read && (
        <span
          aria-hidden="true"
          className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"
        />
      )}

      <span
        className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', meta.tone)}
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={meta.icon} className="w-4 h-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className={cn('text-sm leading-snug', read ? 'text-text-secondary' : 'font-semibold text-text-primary')}>
          {title}
        </p>
        {body && (
          <p className="mt-0.5 text-xs text-text-secondary line-clamp-2 leading-relaxed">{body}</p>
        )}
        <time
          className="mt-1 inline-block text-[11px] text-text-secondary tabular-nums"
          dateTime={new Date(createdAt).toISOString()}
        >
          {timeAgo(createdAt)}
        </time>
      </div>

      {!read && onMarkRead && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onMarkRead(); }}
          className="shrink-0 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:underline focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
        >
          Mark read
        </button>
      )}
    </Wrapper>
  );
}
