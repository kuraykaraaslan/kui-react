'use client';
// modules/ui/TreeView/parts/DropIndicator.tsx
//
// Stub — full implementation arrives in M2 alongside the `useDnD` hook. Kept
// as a named export so the file can be wired into the directory split now
// without touching imports later.

// TODO M2: Replace this stub with a real drop indicator.
//  - Visual: 2px line (`bg-border-focus`) for before/after, full-row tint for
//    "inside" intent.
//  - Position prop: 'before' | 'after' | 'inside'.
//  - Should attach to a portal-ed layer so it never affects layout/scroll.

export type DropIndicatorProps = {
  /** When `null` the indicator renders nothing. */
  position?: 'before' | 'after' | 'inside' | null;
};

export function DropIndicator({ position = null }: DropIndicatorProps) {
  if (!position) return null;
  // TODO M2: real rendering. For now we render nothing so the M1 tree looks
  // identical to the EJS version.
  return null;
}
