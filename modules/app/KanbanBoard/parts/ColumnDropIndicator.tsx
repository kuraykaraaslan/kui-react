'use client';
import { cn } from '@/libs/utils/cn';

type ColumnDropIndicatorProps = {
  /** When true, render as a visible drop line between cards. */
  active: boolean;
  className?: string;
};

/**
 * Thin horizontal line shown between cards (or above the first / below the last)
 * to hint at the insertion index during a drag. M1: simple `bg-primary` line.
 */
export function ColumnDropIndicator({ active, className }: ColumnDropIndicatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'mx-1 my-0.5 h-0.5 rounded-full transition-colors',
        active ? 'bg-primary' : 'bg-transparent',
        className,
      )}
    />
  );
}
