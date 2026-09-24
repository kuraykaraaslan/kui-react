'use client';
import Link from 'next/link';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faComment,
  faUserPlus,
  faAt,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import type { NotificationWithActor, NotificationType } from '@/modules/domains/social/types';

const TYPE_CONFIG: Record<NotificationType, { icon: typeof faHeart; iconClass: string; label: string }> = {
  LIKE:    { icon: faHeart,    iconClass: 'text-error',    label: 'liked your post'    },
  COMMENT: { icon: faComment,  iconClass: 'text-primary',  label: 'commented on your post' },
  FOLLOW:  { icon: faUserPlus, iconClass: 'text-success',  label: 'started following you'   },
  MENTION: { icon: faAt,       iconClass: 'text-info',     label: 'mentioned you'       },
  SHARE:   { icon: faShare,    iconClass: 'text-secondary', label: 'shared your post'   },
};

function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const diffDay = Math.floor(diff / 86400);
  if (diffDay < 7)  return `${diffDay}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type SocialNotificationItemProps = {
  notification: NotificationWithActor;
  onClick?: (notificationId: string) => void;
  className?: string;
};

export function SocialNotificationItem({ notification, onClick, className }: SocialNotificationItemProps) {
  const { icon, iconClass } = TYPE_CONFIG[notification.type];
  const { actor } = notification;

  return (
    <div
      role="listitem"
      onClick={() => onClick?.(notification.notificationId)}
      className={cn(
        'flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer',
        !notification.isRead && 'bg-primary-subtle/40',
        'hover:bg-surface-overlay',
        className
      )}
    >
      {/* Actor avatar with type icon overlay */}
      <div className="relative shrink-0">
        <Avatar
          src={actor?.avatar ?? undefined}
          name={actor?.name ?? 'User'}
          size="md"
        />
        <span
          className={cn(
            'absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-base border-2 border-surface-base flex items-center justify-center',
          )}
        >
          <FontAwesomeIcon icon={icon} className={cn('w-2.5 h-2.5', iconClass)} aria-hidden="true" />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary leading-snug">
          {actor && (
            <Link
              href={`/theme/social/profile/${actor.userId}`}
              className="font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
              onClick={(e) => e.stopPropagation()}
            >
              {actor.name}
            </Link>
          )}{' '}
          {notification.message}
        </p>
        {notification.createdAt && (
          <p className="text-xs text-text-secondary mt-0.5">{formatRelativeTime(notification.createdAt)}</p>
        )}
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" aria-label="Unread" />
      )}
    </div>
  );
}
