'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faReply,
  faThumbsUp,
  faMedal,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type UserActivityKind = 'topic' | 'reply' | 'reaction' | 'badge';

type UserActivityRowProps = {
  kind: UserActivityKind;
  topicTitle?: string;
  topicHref?: string;
  excerpt?: string;
  badgeName?: string;
  createdAt: Date | string;
  className?: string;
};

const KIND_META: Record<UserActivityKind, { icon: IconDefinition; verb: string; iconClass: string }> = {
  topic:    { icon: faPen,      verb: 'started a topic',     iconClass: 'text-primary bg-primary-subtle' },
  reply:    { icon: faReply,    verb: 'replied to',          iconClass: 'text-info bg-info-subtle' },
  reaction: { icon: faThumbsUp, verb: 'reacted to',          iconClass: 'text-success bg-success-subtle' },
  badge:    { icon: faMedal,    verb: 'earned the badge',    iconClass: 'text-warning bg-warning-subtle' },
};

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function UserActivityRow({
  kind,
  topicTitle,
  topicHref,
  excerpt,
  badgeName,
  createdAt,
  className,
}: UserActivityRowProps) {
  const meta = KIND_META[kind];

  return (
    <li
      className={cn(
        'flex items-start gap-3 border-b border-border last:border-b-0 px-3 py-3',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          meta.iconClass,
        )}
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={meta.icon} className="w-3 h-3" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-secondary">
          {meta.verb}{' '}
          {kind === 'badge' ? (
            <span className="font-semibold text-text-primary">{badgeName}</span>
          ) : topicHref ? (
            <a
              href={topicHref}
              className="font-medium text-text-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
            >
              {topicTitle}
            </a>
          ) : (
            <span className="font-medium text-text-primary">{topicTitle}</span>
          )}
        </p>
        {excerpt && (
          <p className="mt-0.5 text-xs text-text-secondary line-clamp-2 leading-relaxed">{excerpt}</p>
        )}
      </div>

      <time className="shrink-0 text-xs text-text-secondary tabular-nums" dateTime={new Date(createdAt).toISOString()}>
        {timeAgo(createdAt)}
      </time>
    </li>
  );
}
