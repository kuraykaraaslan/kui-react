'use client';
// modules/ui/Chart/primitives/Grid.tsx
//
// Horizontal + vertical grid lines drawn behind the plot. Token-aware
// stroke color; rendered as a single <g> for cheap toggling.

import { chartTheme } from '../theme';
import type { PlotRect } from '../types';

type GridProps = {
  rect: PlotRect;
  /** Pixel y positions of horizontal grid lines. */
  yTicks: number[];
  /** Pixel x positions of vertical grid lines. Default = []. */
  xTicks?: number[];
  /** Line colour. Default = the theme's grid token. */
  color?: string;
};

export function Grid({ rect, yTicks, xTicks = [], color = chartTheme.gridStroke }: GridProps) {
  return (
    <g aria-hidden="true" opacity={0.5}>
      {yTicks.map((y, i) => (
        <line
          key={`gy-${i}`}
          x1={rect.x}
          x2={rect.x + rect.width}
          y1={y}
          y2={y}
          stroke={color}
          strokeDasharray="2 4"
          strokeWidth={1}
        />
      ))}
      {xTicks.map((x, i) => (
        <line
          key={`gx-${i}`}
          x1={x}
          x2={x}
          y1={rect.y}
          y2={rect.y + rect.height}
          stroke={color}
          strokeDasharray="2 4"
          strokeWidth={1}
        />
      ))}
    </g>
  );
}
