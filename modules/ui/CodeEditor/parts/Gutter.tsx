'use client';
// modules/ui/CodeEditor/parts/Gutter.tsx
//
// Line-number gutter for the CodeMirror fallback engine. Mirrors what CM6
// produces natively so once the engine swaps the visual width is unchanged.
//
// TODO M2: breakpoint dots column (left of numbers), click-to-toggle.
// TODO M3: per-line diagnostic icon next to the number (error/warning/info).
// TODO M4: code-folding chevrons.

import { cn } from '@/libs/utils/cn';

type GutterProps = {
  lineCount: number;
  activeLine: number;
  minHeight: number;
};

export function Gutter({ lineCount, activeLine, minHeight }: GutterProps) {
  return (
    <div
      data-kui-codeeditor-gutter
      aria-hidden="true"
      className={cn(
        'select-none overflow-hidden border-r border-border bg-surface-overlay',
        'px-2 py-2 text-right font-mono text-xs leading-5 text-text-disabled'
      )}
      style={{ minHeight }}
    >
      {Array.from({ length: lineCount }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={cn(
            'tabular-nums',
            n === activeLine && 'text-text-primary font-semibold'
          )}
        >
          {n}
        </div>
      ))}
    </div>
  );
}
