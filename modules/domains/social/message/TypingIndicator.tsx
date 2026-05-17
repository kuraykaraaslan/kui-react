'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';

type TypingIndicatorProps = {
  name: string;
  avatarUrl?: string | null;
  className?: string;
};

export function TypingIndicator({ name, avatarUrl, className }: TypingIndicatorProps) {
  return (
    <div
      className={cn('flex items-end gap-2 mt-3', className)}
      aria-live="polite"
      aria-label={`${name} is typing`}
    >
      <Avatar src={avatarUrl} name={name} size="sm" />
      <div className="flex flex-col items-start">
        <span className="mb-0.5 px-1 text-[11px] font-medium text-text-secondary">
          {name} is typing…
        </span>
        <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-overlay px-3.5 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-text-secondary animate-pulse [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-text-secondary animate-pulse [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-text-secondary animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
