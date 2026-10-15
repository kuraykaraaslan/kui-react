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
  /** Right axis title, running down the right edge. */
  y2Label?: string;
  /** The chart's width (needed for `y2Label`). */
  width?: number;
  style?: AxisTextStyle;
};

export function AxisTitles({ rect, height, xLabel, yLabel, y2Label, width, style }: AxisTitlesProps) {
  if (!xLabel && !yLabel && !y2Label) return null;
  const text = axisTextProps(style);
  const cy = rect.y + rect.height / 2;
  return (
    <g aria-hidden="true">
      {yLabel && (
        <text x={12} y={cy} transform={`rotate(-90 12 ${cy})`} textAnchor="middle" dominantBaseline="middle" {...text}>
          {yLabel}
        </text>
      )}
      {y2Label && width !== undefined && (
        <text x={width - 12} y={cy} transform={`rotate(90 ${width - 12} ${cy})`} textAnchor="middle" dominantBaseline="middle" {...text}>
          {y2Label}
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
