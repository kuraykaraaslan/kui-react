'use client';
// modules/ui/Chart/primitives/Brush.tsx
//
// M4 stub: range-selection brush below the chart. Returns null in M1.
//
// TODO M4: drag-to-select range, two pill handles, controlled
// `range` prop, emits `onRangeChange` with [x0, x1] in domain units.
// Must respect prefers-reduced-motion (skip drag inertia) and expose
// keyboard arrows for the handles.

type BrushProps = {
  /** Pixel-positioned rect to draw the brush within. */
  width?: number;
  height?: number;
  /** Initial / controlled domain range; undefined = full range. */
  range?: [number, number];
  onRangeChange?: (range: [number, number]) => void;
};

export function Brush(_props: BrushProps) {
  // TODO M4: implement drag handles + selection overlay.
  return null;
}
