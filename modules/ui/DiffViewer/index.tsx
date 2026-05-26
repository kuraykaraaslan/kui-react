'use client';
// modules/ui/DiffViewer/index.tsx
//
// DiffViewer — line-based text diff with unified + split modes (M1).
//
// Pixel-identical EJS sibling at modules/ui/DiffViewer/DiffViewer.ejs.
//
// M1 scope:
//   * LCS-based line diff (see hooks/useDiff).
//   * Unified view (GitHub-style).
//   * Split view with synced scrolling.
//   * `@@ -oldStart,oldCount +newStart,newCount @@` hunk headers.
//   * Line numbers — both old and new gutters.
//   * `context` prop (default 3) controlling how much unchanged context to keep
//     around each hunk.
//   * `collapsible` — when true, leading/trailing unchanged runs inside each
//     hunk fold under a "Show N more lines" button.
//
// TODO M2: syntax highlight (shiki/prismjs, lazy), intra-line word diff,
//          theme switcher (light/dark/github/solarized).
// TODO M3: code review comments — `threads`, `onAddComment`,
//          `onResolveThread`, suggestion mode.
// TODO M4: JSON tree diff, image diff (slider/swipe/onion/2-up), binary diff
//          banner, "Load more" for huge diffs.
// TODO M5: keyboard nav (J/K next/prev change, N/P next/prev file, Enter to
//          expand), roving tabindex, reduced motion, virtualization, i18n.

import { cn } from '@/libs/utils/cn';
import { UnifiedView } from './parts/UnifiedView';
import { SplitView } from './parts/SplitView';
import { useDiff } from './hooks/useDiff';
import type { DiffViewerProps } from './types';

export function DiffViewer({
  oldText = '',
  newText = '',
  mode = 'unified',
  context = 3,
  collapsible = false,
  language,
  className,
}: DiffViewerProps) {
  const hunks = useDiff(oldText, newText, context);

  return (
    <div
      data-kui-diffviewer
      data-mode={mode}
      data-language={language ?? undefined}
      className={cn(
        'w-full rounded-md border border-border bg-surface-base text-text-primary overflow-hidden',
        className
      )}
    >
      {mode === 'split' ? (
        <SplitView hunks={hunks} />
      ) : (
        <UnifiedView hunks={hunks} context={context} collapsible={collapsible} />
      )}
    </div>
  );
}

// Public surface — re-exported for consumers that import named types from
// the barrel. `DiffViewer` itself is the default named export above.
export type { DiffViewerProps, DiffMode, Hunk, Change, ChangeType } from './types';
