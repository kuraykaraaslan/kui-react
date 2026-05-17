'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClock, faMessage } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';

export type AttendanceStatus = 'GOING' | 'MAYBE' | 'WAITLIST';

type AttendeeRowProps = {
  name: string;
  avatarUrl?: string | null;
  handle?: string;
  status: AttendanceStatus;
  checkedIn?: boolean;
  isFriend?: boolean;
  onMessage?: () => void;
  className?: string;
};

const STATUS_META: Record<AttendanceStatus, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  GOING:    { label: 'Going',    variant: 'success' },
  MAYBE:    { label: 'Maybe',    variant: 'warning' },
  WAITLIST: { label: 'Waitlist', variant: 'neutral' },
};

export function AttendeeRow({
  name,
  avatarUrl,
  handle,
  status,
  checkedIn,
  isFriend,
  onMessage,
  className,
}: AttendeeRowProps) {
  const meta = STATUS_META[status];
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b border-border last:border-b-0 px-4 py-3',
        className,
      )}
    >
      <Avatar src={avatarUrl} name={name} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
          {isFriend && (
            <Badge variant="primary" size="sm">Friend</Badge>
          )}
        </div>
        <p className="text-xs text-text-secondary">{handle ? `@${handle}` : ''}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {checkedIn && (
          <span className="inline-flex items-center gap-1 text-xs text-success">
            <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5" aria-hidden="true" />
            Checked in
          </span>
        )}
        {!checkedIn && status === 'GOING' && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-text-secondary">
            <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
            Not yet
          </span>
        )}
        <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
        {onMessage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            onClick={onMessage}
            aria-label={`Message ${name}`}
          >
            <FontAwesomeIcon icon={faMessage} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
