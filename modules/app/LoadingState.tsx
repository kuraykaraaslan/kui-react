'use client';
import { cn } from '@/libs/utils/cn';
import {
  SkeletonAvatar,
  SkeletonCard,
  SkeletonLine,
  SkeletonTableRow,
  SkeletonText,
} from '@/modules/ui/Skeleton';
import { Spinner } from '@/modules/ui/Spinner';

type LoadingVariant = 'table' | 'form' | 'cards' | 'list' | 'detail' | 'spinner';

export function LoadingState({
  variant = 'spinner',
  rows = 5,
  cols = 4,
  cards = 3,
  className,
}: {
  variant?: LoadingVariant;
  rows?: number;
  cols?: number;
  cards?: number;
  className?: string;
}) {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center py-16', className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('w-full overflow-x-auto rounded-lg border border-border', className)} aria-busy="true" aria-label="Loading table">
        <table className="w-full text-sm">
          <thead className="bg-surface-sunken border-b border-border">
            <tr>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 rounded bg-surface-sunken animate-pulse w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface-base">
            {Array.from({ length: rows }, (_, i) => (
              <SkeletonTableRow key={i} cols={cols} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('grid gap-4', cards >= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2', className)}>
        {Array.from({ length: cards }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <ul className={cn('divide-y divide-border', className)} aria-busy="true" aria-label="Loading list">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-3 py-3 px-4">
            <SkeletonAvatar />
            <div className="flex-1 space-y-2">
              <SkeletonLine width="w-1/3" />
              <SkeletonLine width="w-2/3" />
            </div>
            <div className="h-4 w-12 rounded bg-surface-sunken animate-pulse" />
          </li>
        ))}
      </ul>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={cn('space-y-6', className)} aria-busy="true" aria-label="Loading detail">
        <div className="pb-4 border-b border-border space-y-3">
          <SkeletonLine width="w-1/4" />
          <SkeletonLine width="w-1/2" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-6 w-16 rounded-full bg-surface-sunken animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonLine width="w-1/4" />
              <SkeletonLine width="w-full" />
            </div>
          ))}
        </div>
        <SkeletonText lines={4} />
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={cn('space-y-5', className)} aria-busy="true" aria-label="Loading form">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLine width="w-1/4" />
            <div className="h-9 rounded-md bg-surface-sunken animate-pulse w-full" />
          </div>
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <div className="h-9 w-20 rounded-md bg-surface-sunken animate-pulse" />
          <div className="h-9 w-24 rounded-md bg-surface-sunken animate-pulse" />
        </div>
      </div>
    );
  }

  return null;
}
