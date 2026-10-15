'use client';
// modules/ui/Chart/primitives/AxisTitles.tsx
//
// Axis titles: the y title runs up the left edge, the x title sits centred under the ticks.

import type { AxisTextStyle, PlotRect } from '../types';
import { axisTextProps } from './Axis';

type AxisTitlesProps = {
  rect: PlotRect;
  height: number;
  xLabel?: string;
  yLabel?: string;
  style?: AxisTextStyle;
};

export function AxisTitles({ rect, height, xLabel, yLabel, style }: AxisTitlesProps) {
  if (!xLabel && !yLabel) return null;
  const text = axisTextProps(style);
  const cy = rect.y + rect.height / 2;
  return (
    <g aria-hidden="true">
      {yLabel && (
        <text x={12} y={cy} transform={`rotate(-90 12 ${cy})`} textAnchor="middle" dominantBaseline="middle" {...text}>
          {yLabel}
        </text>
      )}
      {xLabel && (
        <text x={rect.x + rect.width / 2} y={height - 4} textAnchor="middle" {...text}>
          {xLabel}
        </text>
      )}
    </g>
  );
}
