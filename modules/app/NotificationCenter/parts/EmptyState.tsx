'use client';
// ─── EmptyState — M1 ─────────────────────────────────────────────────────────
// Shown inside the panel when the notifications array is empty.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export type EmptyStateProps = {
  title: string;
  message: string;
  className?: string;
};

export function EmptyState({ title, message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-10 gap-3',
        className,
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-overlay">
        <FontAwesomeIcon
          icon={faBell}
          className="w-5 h-5 text-text-secondary"
          aria-hidden="true"
        />
      </div>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      <p className="text-xs text-text-secondary leading-snug max-w-[22ch]">
        {message}
      </p>
    </div>
  );
}
