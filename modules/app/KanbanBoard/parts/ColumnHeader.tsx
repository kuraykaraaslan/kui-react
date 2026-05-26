'use client';
import { cn } from '@/libs/utils/cn';
import type { KanbanColumn } from '../types';

type ColumnHeaderProps<T> = {
  column: KanbanColumn<T>;
  count: number;
  className?: string;
};

export function ColumnHeader<T>({ column, count, className }: ColumnHeaderProps<T>) {
  // TODO M2: WIP limit badge ("3/5"), over-limit red tint, collapse toggle, color swatch.
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 px-3 py-2',
        'border-b border-border bg-surface-raised rounded-t-lg',
        className,
      )}
    >
      <h3 className="text-sm font-semibold text-text-primary truncate">
        {column.title}
      </h3>
      <span
        className={cn(
          'inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5',
          'text-[11px] font-medium rounded-full',
          'bg-surface-overlay text-text-secondary',
        )}
        aria-label={`${count} cards`}
      >
        {count}
      </span>
    </div>
  );
}
