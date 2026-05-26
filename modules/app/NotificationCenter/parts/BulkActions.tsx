'use client';
// ─── BulkActions — M1 (Mark all read) ────────────────────────────────────────
// Toolbar row inside the panel header. M5 will add Archive all + Mute source.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export type BulkActionsProps = {
  unreadCount: number;
  onMarkAllRead?: () => void | Promise<void>;
  markAllReadLabel: string;
  className?: string;
};

export function BulkActions({
  unreadCount,
  onMarkAllRead,
  markAllReadLabel,
  className,
}: BulkActionsProps) {
  const disabled = unreadCount === 0 || !onMarkAllRead;
  // TODO M5: archive-all, mute-source, preferences button.
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={() => onMarkAllRead?.()}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md',
          'text-xs font-medium',
          'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          'transition-colors',
        )}
      >
        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" />
        <span>{markAllReadLabel}</span>
      </button>
    </div>
  );
}
