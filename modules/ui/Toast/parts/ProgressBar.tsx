'use client';
// modules/ui/Toast/parts/ProgressBar.tsx
//
// Countdown progress bar shown along the bottom edge of an auto-dismissing
// toast. Driven entirely by inline `width %` — no JS animation needed.

import { cn } from '@/libs/utils/cn';

export type ProgressBarProps = {
  /** Remaining percentage (0–100). */
  progress: number;
  /** Tailwind background utility for the filled portion. */
  colorClass: string;
};

export function ProgressBar({ progress, colorClass }: ProgressBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
      <div
        className={cn('h-full rounded-full transition-none', colorClass)}
        style={{ width: `${progress}%`, opacity: 0.5 }}
        aria-hidden="true"
      />
    </div>
  );
}
