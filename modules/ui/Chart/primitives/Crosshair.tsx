'use client';
// modules/ui/Chart/primitives/Crosshair.tsx
//
// Vertical (and optional horizontal) hover guide that follows the
// active data point. Token-aware stroke. Hidden when no datum is
// active.

import { chartTheme } from '../theme';
import type { PlotRect } from '../types';

type CrosshairProps = {
  rect: PlotRect;
  x: number | null;
  y?: number | null;
  /** Show the horizontal arm. Default = false. */
  showHorizontal?: boolean;
};

export function Crosshair({ rect, x, y, showHorizontal }: CrosshairProps) {
  if (x === null) return null;
  return (
    <g aria-hidden="true">
      <line
        x1={x}
        x2={x}
        y1={rect.y}
        y2={rect.y + rect.height}
        stroke={chartTheme.crosshair}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      {showHorizontal && y !== null && y !== undefined && (
        <line
          x1={rect.x}
          x2={rect.x + rect.width}
          y1={y}
          y2={y}
          stroke={chartTheme.crosshair}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      )}
    </g>
  );
}
