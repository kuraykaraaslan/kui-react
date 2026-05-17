'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';

type ConversationListItemProps = {
  name: string;
  avatarUrl?: string | null;
  lastMessage: string;
  lastMessageAt: Date | string;
  unreadCount?: number;
  online?: boolean;
  active?: boolean;
  href?: string;
  className?: string;
};

function relative(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ConversationListItem({
  name,
  avatarUrl,
  lastMessage,
  lastMessageAt,
  unreadCount = 0,
  online,
  active,
  href,
  className,
}: ConversationListItemProps) {
  const Wrapper = href ? 'a' : 'div';
  const hasUnread = unreadCount > 0;

  return (
    <Wrapper
      {...(href ? { href } : {})}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex items-center gap-3 border-b border-border last:border-b-0 px-3 py-3 transition-colors',
        active ? 'bg-primary-subtle' : 'hover:bg-surface-overlay',
        href && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus',
        className,
      )}
    >
      <Avatar
        src={avatarUrl}
        name={name}
        size="md"
        status={online ? 'online' : undefined}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className={cn('text-sm truncate', hasUnread ? 'font-bold text-text-primary' : 'font-medium text-text-primary')}>
            {name}
          </p>
          <time
            className={cn('shrink-0 text-[11px] tabular-nums', hasUnread ? 'text-primary font-semibold' : 'text-text-secondary')}
            dateTime={new Date(lastMessageAt).toISOString()}
          >
            {relative(lastMessageAt)}
          </time>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p className={cn('flex-1 truncate text-xs', hasUnread ? 'text-text-primary' : 'text-text-secondary')}>
            {lastMessage}
          </p>
          {hasUnread && (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-fg tabular-nums">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
