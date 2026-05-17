'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble, faCheck } from '@fortawesome/free-solid-svg-icons';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read';

type MessageBubbleProps = {
  side: 'incoming' | 'outgoing';
  authorName?: string;
  avatarUrl?: string | null;
  body: string;
  sentAt: Date | string;
  status?: MessageDeliveryStatus;
  groupedWithPrevious?: boolean;
  className?: string;
};

function shortTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function MessageBubble({
  side,
  authorName,
  avatarUrl,
  body,
  sentAt,
  status,
  groupedWithPrevious,
  className,
}: MessageBubbleProps) {
  const isOutgoing = side === 'outgoing';

  return (
    <div
      className={cn(
        'flex items-end gap-2',
        isOutgoing ? 'flex-row-reverse' : 'flex-row',
        groupedWithPrevious ? 'mt-0.5' : 'mt-3',
        className,
      )}
    >
      {!isOutgoing && (
        <div className={cn('w-7', groupedWithPrevious && 'invisible')}>
          {!groupedWithPrevious && (
            <Avatar src={avatarUrl} name={authorName ?? '?'} size="sm" />
          )}
        </div>
      )}

      <div className={cn('max-w-[75%] flex flex-col', isOutgoing ? 'items-end' : 'items-start')}>
        {!groupedWithPrevious && !isOutgoing && authorName && (
          <p className="mb-0.5 px-1 text-[11px] font-medium text-text-secondary">{authorName}</p>
        )}
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2 text-sm leading-snug break-words',
            isOutgoing
              ? 'bg-primary text-primary-fg rounded-br-sm'
              : 'bg-surface-overlay text-text-primary rounded-bl-sm',
          )}
        >
          {body}
        </div>
        <p
          className={cn(
            'mt-1 inline-flex items-center gap-1 px-1 text-[10px] tabular-nums',
            isOutgoing ? 'text-text-secondary' : 'text-text-secondary',
          )}
        >
          <time dateTime={new Date(sentAt).toISOString()}>{shortTime(sentAt)}</time>
          {isOutgoing && status && (
            <FontAwesomeIcon
              icon={status === 'sent' ? faCheck : faCheckDouble}
              className={cn(
                'w-2.5 h-2.5',
                status === 'read' ? 'text-info' : 'text-text-disabled',
              )}
              aria-label={`Message ${status}`}
            />
          )}
        </p>
      </div>
    </div>
  );
}
