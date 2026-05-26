'use client';
// TODO M4: resource columns (room / person / lane) with multi-calendar overlay.
// For M1 we ship a labelled placeholder.

import { cn } from '@/libs/utils/cn';

type ResourceViewProps = {
  className?: string;
};

export function ResourceView({ className }: ResourceViewProps) {
  return (
    <div
      role="region"
      aria-label="Resource view"
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-16 px-4 text-center',
        className,
      )}
    >
      <p className="text-sm font-medium text-text-primary">Resource view</p>
      <p className="text-xs text-text-secondary max-w-sm">
        One column per resource (room, person, lane) with conflict detection
        lands in M4.
        {/* TODO M4: render `resources` prop as horizontal columns sharing the time grid. */}
      </p>
    </div>
  );
}
