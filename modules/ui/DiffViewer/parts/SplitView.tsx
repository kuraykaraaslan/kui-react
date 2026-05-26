'use client';
// modules/ui/DiffViewer/parts/SplitView.tsx
//
// Yan yana iki kolon — left = old, right = new. Hunks are flattened into
// aligned row-pairs so each visual row spans both panes and stays in sync
// vertically. Horizontal scroll is synced through `useScrollSync`.

import { useRef } from 'react';
import { cn } from '@/libs/utils/cn';
import { HunkHeader } from './HunkHeader';
import { DiffLine } from './DiffLine';
import { useScrollSync } from '../hooks/useScrollSync';
import type { Change, Hunk } from '../types';

type SplitViewProps = {
  hunks: Hunk[];
  className?: string;
};

/**
 * Pair each change with its mirror on the opposite side. Removals pair with
 * a phantom "empty" on the right, adds with a phantom on the left, and
 * adjacent remove+add pairs are stacked so they line up as a substitution.
 */
function pairChanges(changes: Change[]): Array<{ left: Change | null; right: Change | null }> {
  const out: Array<{ left: Change | null; right: Change | null }> = [];
  let i = 0;
  while (i < changes.length) {
    const c = changes[i];
    if (c.type === 'context') {
      out.push({ left: c, right: c });
      i++;
      continue;
    }
    // Collect a consecutive removes-then-adds block so they pair up.
    const removes: Change[] = [];
    const adds: Change[] = [];
    while (i < changes.length && changes[i].type === 'remove') {
      removes.push(changes[i]);
      i++;
    }
    while (i < changes.length && changes[i].type === 'add') {
      adds.push(changes[i]);
      i++;
    }
    const max = Math.max(removes.length, adds.length);
    for (let k = 0; k < max; k++) {
      out.push({
        left: removes[k] ?? null,
        right: adds[k] ?? null,
      });
    }
  }
  return out;
}

export function SplitView({ hunks, className }: SplitViewProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useScrollSync(leftRef, rightRef);

  if (hunks.length === 0) {
    return (
      <div className={cn('px-3 py-2 font-mono text-xs text-text-secondary', className)}>
        No changes.
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Split diff"
      className={cn('grid grid-cols-2 gap-0', className)}
    >
      <div ref={leftRef} className="overflow-x-auto border-r border-border">
        {hunks.map((hunk, hi) => {
          const pairs = pairChanges(hunk.changes);
          return (
            <div key={`L-${hi}-${hunk.oldStart}`}>
              <HunkHeader hunk={hunk} />
              {pairs.map((p, i) =>
                p.left ? (
                  <DiffLine
                    key={`L-${hi}-${i}-${p.left.oldLine ?? 'x'}`}
                    change={p.left}
                    variant="split-old"
                  />
                ) : (
                  <div
                    key={`L-${hi}-${i}-empty`}
                    aria-hidden="true"
                    className="grid grid-cols-[3rem_1rem_1fr] font-mono text-xs leading-5 bg-surface-overlay"
                  >
                    <span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
      <div ref={rightRef} className="overflow-x-auto">
        {hunks.map((hunk, hi) => {
          const pairs = pairChanges(hunk.changes);
          return (
            <div key={`R-${hi}-${hunk.newStart}`}>
              <HunkHeader hunk={hunk} />
              {pairs.map((p, i) =>
                p.right ? (
                  <DiffLine
                    key={`R-${hi}-${i}-${p.right.newLine ?? 'x'}`}
                    change={p.right}
                    variant="split-new"
                  />
                ) : (
                  <div
                    key={`R-${hi}-${i}-empty`}
                    aria-hidden="true"
                    className="grid grid-cols-[3rem_1rem_1fr] font-mono text-xs leading-5 bg-surface-overlay"
                  >
                    <span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
