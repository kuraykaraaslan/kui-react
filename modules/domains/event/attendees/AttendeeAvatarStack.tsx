'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';

type StackedAttendee = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type AttendeeAvatarStackProps = {
  attendees: StackedAttendee[];
  totalCount: number;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function AttendeeAvatarStack({
  attendees,
  totalCount,
  maxVisible = 5,
  size = 'md',
  className,
}: AttendeeAvatarStackProps) {
  const visible = attendees.slice(0, maxVisible);
  const remainder = totalCount - visible.length;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <ul className="flex -space-x-2" aria-label={`${totalCount} attendees`}>
        {visible.map((a) => (
          <li key={a.id} className="rounded-full ring-2 ring-surface-raised">
            <Avatar src={a.avatarUrl} name={a.name} size={size} />
          </li>
        ))}
        {remainder > 0 && (
          <li
            className={cn(
              'inline-flex items-center justify-center rounded-full ring-2 ring-surface-raised bg-surface-overlay text-text-secondary font-semibold tabular-nums select-none',
              size === 'sm' && 'h-8 w-8 text-xs',
              size === 'md' && 'h-10 w-10 text-xs',
              size === 'lg' && 'h-12 w-12 text-sm',
            )}
            aria-hidden="true"
          >
            +{remainder > 99 ? '99' : remainder}
          </li>
        )}
      </ul>
      <span className="text-sm text-text-secondary tabular-nums">
        <span className="font-semibold text-text-primary">{totalCount.toLocaleString()}</span> going
      </span>
    </div>
  );
}
