'use client';
// modules/ui/DiffViewer/parts/UnifiedView.tsx
//
// GitHub-style single-column view: each hunk is preceded by a `@@` header
// and renders its lines (context + add + remove) in order. When the diff
// is `collapsible`, the leading/trailing unchanged context of each hunk is
// folded under a "Show N more lines" button.

import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { HunkHeader } from './HunkHeader';
import { DiffLine } from './DiffLine';
import type { Change, Hunk } from '../types';

type UnifiedViewProps = {
  hunks: Hunk[];
  context: number;
  collapsible: boolean;
  className?: string;
};

/**
 * Splits a hunk's changes into a leading unchanged run, the meaningful
 * middle, and a trailing unchanged run — the two outer runs are what the
 * collapsible UI folds away.
 */
function partitionHunk(changes: Change[]): { lead: Change[]; middle: Change[]; trail: Change[] } {
  let firstChange = -1;
  let lastChange = -1;
  for (let i = 0; i < changes.length; i++) {
    if (changes[i].type !== 'context') {
      if (firstChange === -1) firstChange = i;
      lastChange = i;
    }
  }
  if (firstChange === -1) return { lead: changes, middle: [], trail: [] };
  return {
    lead: changes.slice(0, firstChange),
    middle: changes.slice(firstChange, lastChange + 1),
    trail: changes.slice(lastChange + 1),
  };
}

function CollapsibleRun({ run, label }: { run: Change[]; label: string }) {
  const [open, setOpen] = useState(false);
  if (run.length === 0) return null;
  if (open) {
    return (
      <>
        {run.map((c, i) => (
          <DiffLine key={`ctx-${i}-${c.oldLine ?? 'x'}-${c.newLine ?? 'x'}`} change={c} variant="unified" />
        ))}
      </>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-expanded={false}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-1 font-mono text-xs',
        'bg-surface-overlay text-text-secondary border-y border-border',
        'hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus'
      )}
    >
      <FontAwesomeIcon icon={faPlus} className="w-3 h-3" aria-hidden="true" />
      {label}
    </button>
  );
}

export function UnifiedView({ hunks, collapsible, className }: UnifiedViewProps) {
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
      aria-label="Unified diff"
      className={cn('overflow-x-auto', className)}
    >
      {hunks.map((hunk, hi) => {
        const { lead, middle, trail } = collapsible
          ? partitionHunk(hunk.changes)
          : { lead: [], middle: hunk.changes, trail: [] };
        return (
          <div key={`hunk-${hi}-${hunk.oldStart}-${hunk.newStart}`}>
            <HunkHeader hunk={hunk} />
            {collapsible && lead.length > 0 && (
              <CollapsibleRun run={lead} label={`Show ${lead.length} more line${lead.length === 1 ? '' : 's'}`} />
            )}
            {!collapsible
              ? hunk.changes.map((c, i) => (
                  <DiffLine
                    key={`row-${hi}-${i}-${c.oldLine ?? 'x'}-${c.newLine ?? 'x'}`}
                    change={c}
                    variant="unified"
                  />
                ))
              : middle.map((c, i) => (
                  <DiffLine
                    key={`row-${hi}-${i}-${c.oldLine ?? 'x'}-${c.newLine ?? 'x'}`}
                    change={c}
                    variant="unified"
                  />
                ))}
            {collapsible && trail.length > 0 && (
              <CollapsibleRun run={trail} label={`Show ${trail.length} more line${trail.length === 1 ? '' : 's'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
