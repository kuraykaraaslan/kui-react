'use client';
// modules/ui/DiffViewer/parts/DiffLine.tsx
//
// Single diff row — left line-number gutter (old + new), a `+`/`-`/` ` sign
// column, then the line content. Background colour is driven by `type`:
//   add    → bg-success-subtle
//   remove → bg-error-subtle
//   context → no background
//
// Pixel-identical to the EJS sibling at
// modules/ui/DiffViewer/partials/_line.ejs.

import { cn } from '@/libs/utils/cn';
import type { Change } from '../types';

type DiffLineProps = {
  change: Change;
  /** When 'split-old' / 'split-new', renders only the relevant side's number. */
  variant?: 'unified' | 'split-old' | 'split-new';
  className?: string;
};

const ROW_BG: Record<Change['type'], string> = {
  add: 'bg-success-subtle',
  remove: 'bg-error-subtle',
  context: 'bg-surface-base',
};

const SIGN: Record<Change['type'], string> = {
  add: '+',
  remove: '-',
  context: ' ',
};

const SIGN_FG: Record<Change['type'], string> = {
  add: 'text-success',
  remove: 'text-error',
  context: 'text-text-disabled',
};

export function DiffLine({ change, variant = 'unified', className }: DiffLineProps) {
  // Split view: when the change is on the *other* side, render a placeholder
  // row so the two columns line up by index.
  const isSplitOld = variant === 'split-old';
  const isSplitNew = variant === 'split-new';
  const isOtherSide =
    (isSplitOld && change.type === 'add') ||
    (isSplitNew && change.type === 'remove');

  if (isOtherSide) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'grid grid-cols-[3rem_1rem_1fr] font-mono text-xs leading-5',
          'bg-surface-overlay border-l border-border',
          className
        )}
      >
        <span className="text-right pr-2 text-text-disabled select-none">&nbsp;</span>
        <span className="text-center text-text-disabled select-none">&nbsp;</span>
        <span>&nbsp;</span>
      </div>
    );
  }

  // Unified shows both gutters; split shows only the relevant side.
  const showOldNumber = variant === 'unified' || isSplitOld;
  const showNewNumber = variant === 'unified' || isSplitNew;
  const gridCols =
    variant === 'unified'
      ? 'grid-cols-[3rem_3rem_1rem_1fr]'
      : 'grid-cols-[3rem_1rem_1fr]';

  return (
    <div
      data-diff-type={change.type}
      className={cn(
        'grid font-mono text-xs leading-5 border-l-2',
        gridCols,
        ROW_BG[change.type],
        change.type === 'add' && 'border-l-success',
        change.type === 'remove' && 'border-l-error',
        change.type === 'context' && 'border-l-transparent',
        className
      )}
    >
      {showOldNumber && (
        <span
          aria-label={change.oldLine != null ? `Old line ${change.oldLine}` : undefined}
          className="text-right pr-2 text-text-disabled select-none border-r border-border"
        >
          {change.oldLine ?? ''}
        </span>
      )}
      {showNewNumber && (
        <span
          aria-label={change.newLine != null ? `New line ${change.newLine}` : undefined}
          className="text-right pr-2 text-text-disabled select-none border-r border-border"
        >
          {change.newLine ?? ''}
        </span>
      )}
      <span aria-hidden="true" className={cn('text-center select-none', SIGN_FG[change.type])}>
        {SIGN[change.type]}
      </span>
      <span className="pl-2 pr-3 whitespace-pre text-text-primary">
        {change.content || ' '}
      </span>
    </div>
  );
}
