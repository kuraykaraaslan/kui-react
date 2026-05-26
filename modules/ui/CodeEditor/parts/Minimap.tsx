'use client';
// modules/ui/CodeEditor/parts/Minimap.tsx
//
// Minimap — M4 STUB. Renders a tiny scaled-down preview of the source so
// users can scrub long files quickly.
//
// TODO M4: paint each character as a 2x4 px block onto a <canvas>, sync
//          scroll to the editor's scrollTop, drag-to-jump, viewport shade.

import { cn } from '@/libs/utils/cn';

type MinimapProps = {
  source: string;
};

export function Minimap({ source }: MinimapProps) {
  // TODO M4: replace placeholder with canvas-rendered miniature.
  void source;
  return (
    <aside
      aria-hidden="true"
      data-kui-codeeditor-minimap
      className={cn('hidden w-12 shrink-0 border-l border-border bg-surface-overlay')}
    />
  );
}
