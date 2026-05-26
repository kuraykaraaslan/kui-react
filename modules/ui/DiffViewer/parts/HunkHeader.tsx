'use client';
// modules/ui/DiffViewer/parts/HunkHeader.tsx
//
// Single-row hunk separator rendered as `@@ -oldStart,oldLines +newStart,newLines @@`.
// Used by both the unified and split views — same row height as `<DiffLine>`
// so the two panes stay vertically aligned.

import { cn } from '@/libs/utils/cn';
import type { Hunk } from '../types';

type HunkHeaderProps = {
  hunk: Hunk;
  /** When true, hides the @@ line numbers and just renders an ellipsis. */
  compact?: boolean;
  className?: string;
};

export function HunkHeader({ hunk, compact = false, className }: HunkHeaderProps) {
  const label = compact
    ? '…'
    : `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;
  return (
    <div
      role="separator"
      aria-label={`Hunk at line ${hunk.oldStart}`}
      className={cn(
        'px-3 py-1 font-mono text-xs text-text-secondary',
        'bg-surface-overlay border-y border-border select-none',
        className
      )}
    >
      {label}
    </div>
  );
}
