'use client';
// modules/ui/Chart/primitives/Axis.tsx
//
// Lightweight SVG axis renderer. Token-aware (uses chartTheme).
//
// Two variants:
//   <XAxis ticks={…} y={plotBottom} … />  — categorical / numeric ticks along x
//   <YAxis ticks={…} x={plotLeft} … />    — numeric ticks along y
//
// Ticks are pre-computed by the parent chart (see quill-helpers parallel in
// chart-helpers.js / charts/<type>.tsx) so this primitive stays presentation-
// only. M2+ will add log scale + time scale tick generators.

import { chartTheme } from '../theme';

export type AxisTick = {
  position: number;       // pixel coord (already scaled by parent)
  label: string;          // formatted tick label
};

type XAxisProps = {
  /** Pixel ticks running left → right. */
  ticks: AxisTick[];
  /** Pixel y of the axis baseline (typically plot.y + plot.height). */
  y: number;
  /** Plot rectangle left edge (for axis line start). */
  xStart: number;
  /** Plot rectangle right edge (for axis line end). */
  xEnd: number;
  /** Hide axis line; keep tick labels (sparkline style). */
  hideLine?: boolean;
};

export function XAxis({ ticks, y, xStart, xEnd, hideLine }: XAxisProps) {
  return (
    <g aria-hidden="true">
      {!hideLine && (
        <line
          x1={xStart}
          x2={xEnd}
          y1={y}
          y2={y}
          stroke={chartTheme.axisStroke}
          strokeWidth={1}
        />
      )}
      {ticks.map((t, i) => (
        <g key={`x-${i}`}>
          <line
            x1={t.position}
            x2={t.position}
            y1={y}
            y2={y + 4}
            stroke={chartTheme.axisStroke}
            strokeWidth={1}
          />
          <text
            x={t.position}
            y={y + 16}
            textAnchor="middle"
            fontSize={chartTheme.fontSize.axis}
            fill={chartTheme.axisText}
          >
            {t.label}
          </text>
        </g>
      ))}
    </g>
  );
}

type YAxisProps = {
  ticks: AxisTick[];
  /** Pixel x of the axis baseline (typically plot.x). */
  x: number;
  /** Plot rect top + bottom y for the axis line itself. */
  yStart: number;
  yEnd: number;
  hideLine?: boolean;
};

export function YAxis({ ticks, x, yStart, yEnd, hideLine }: YAxisProps) {
  return (
    <g aria-hidden="true">
      {!hideLine && (
        <line
          x1={x}
          x2={x}
          y1={yStart}
          y2={yEnd}
          stroke={chartTheme.axisStroke}
          strokeWidth={1}
        />
      )}
      {ticks.map((t, i) => (
        <g key={`y-${i}`}>
          <line
            x1={x - 4}
            x2={x}
            y1={t.position}
            y2={t.position}
            stroke={chartTheme.axisStroke}
            strokeWidth={1}
          />
          <text
            x={x - 8}
            y={t.position + 4}
            textAnchor="end"
            fontSize={chartTheme.fontSize.axis}
            fill={chartTheme.axisText}
          >
            {t.label}
          </text>
        </g>
      ))}
    </g>
  );
}
