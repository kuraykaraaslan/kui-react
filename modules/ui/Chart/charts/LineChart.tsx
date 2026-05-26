'use client';
// modules/ui/Chart/charts/LineChart.tsx
//
// Token-aware line chart with optional smoothing, grid, tooltip and
// crosshair. Wraps the shared primitives (Axis, Grid, Legend, Tooltip,
// Crosshair, ResponsiveContainer) and uses the math helpers from
// ./_helpers.ts. No external chart library.
//
// Public props extend `BaseChartProps` with `smooth` (curved lines) +
// `strokeWidth` so callers can match the existing domain-chart visuals
// when they migrate in M5.

import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { XAxis, YAxis } from '../primitives/Axis';
import { Grid } from '../primitives/Grid';
import { Legend } from '../primitives/Legend';
import { ChartTooltip } from '../primitives/Tooltip';
import { Crosshair } from '../primitives/Crosshair';
import { paletteColor, animationDuration } from '../theme';
import type { BaseChartProps, PlotRect, TooltipDatum } from '../types';
import {
  niceTicks,
  yExtent,
  yScale,
  bandCenter,
  xCategories,
  smoothPath,
  linePath,
} from './_helpers';

type LineChartProps = BaseChartProps & {
  /** Render smooth Catmull-Rom-ish curves instead of straight segments. */
  smooth?: boolean;
  /** Stroke width in pixels. Default = 2. */
  strokeWidth?: number;
};

const PADDING = { top: 12, right: 16, bottom: 28, left: 40 };

export function LineChart({
  series,
  height = 240,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  smooth = true,
  strokeWidth = 2,
  ariaLabel,
  className,
}: LineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const categories = useMemo(() => xCategories(series), [series]);
  const { min, max } = useMemo(() => yExtent(series), [series]);
  const animMs = animationDuration();

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer height={height}>
        {({ width }) => {
          const rect: PlotRect = {
            x: PADDING.left,
            y: PADDING.top,
            width: Math.max(0, width - PADDING.left - PADDING.right),
            height: Math.max(0, height - PADDING.top - PADDING.bottom),
          };
          const tickValues = niceTicks(min, max, 4);
          const yPixels = tickValues.map((v) => yScale(v, min, max, rect));

          const xTicks = categories.map((label, i) => ({
            position: bandCenter(i, categories.length, rect),
            label,
          }));
          const yTicks = tickValues.map((v, i) => ({
            position: yPixels[i],
            label: String(Math.round(v * 100) / 100),
          }));

          // Build per-series projected pixel paths.
          const projected = series.map((s, si) => {
            const color = paletteColor(si, s.color);
            const points = s.data.map((p, i) =>
              p.y === null || p.y === undefined
                ? null
                : { x: bandCenter(i, categories.length, rect), y: yScale(p.y, min, max, rect) },
            );
            return { id: s.id, name: s.name, color, points };
          });

          const tooltipData: TooltipDatum[] =
            hoverIndex === null
              ? []
              : series.map((s, si) => ({
                  seriesId: s.id,
                  seriesName: s.name,
                  color: paletteColor(si, s.color),
                  x: s.data[hoverIndex]?.x ?? '',
                  y: s.data[hoverIndex]?.y ?? null,
                }));

          const hoverX =
            hoverIndex === null ? null : bandCenter(hoverIndex, categories.length, rect);
          const tooltipLabel =
            hoverIndex === null ? '' : String(series[0]?.data[hoverIndex]?.x ?? '');

          return (
            <>
              <svg
                width={width}
                height={height}
                role="img"
                aria-label={ariaLabel ?? 'Line chart'}
                onMouseMove={(e) => {
                  if (!showTooltip || categories.length === 0) return;
                  const bounds = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                  if (!bounds) return;
                  const localX = e.clientX - bounds.left - rect.x;
                  if (localX < 0 || localX > rect.width) {
                    setHoverIndex(null);
                    return;
                  }
                  const step = rect.width / categories.length;
                  setHoverIndex(Math.min(categories.length - 1, Math.max(0, Math.floor(localX / step))));
                }}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {showGrid && <Grid rect={rect} yTicks={yPixels} />}
                <YAxis ticks={yTicks} x={rect.x} yStart={rect.y} yEnd={rect.y + rect.height} />
                <XAxis ticks={xTicks} y={rect.y + rect.height} xStart={rect.x} xEnd={rect.x + rect.width} />
                <Crosshair rect={rect} x={hoverX} />
                {projected.map((p) => (
                  <g key={p.id}>
                    <path
                      d={smooth ? smoothPath(p.points) : linePath(p.points)}
                      fill="none"
                      stroke={p.color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: animMs ? `opacity ${animMs}ms` : undefined }}
                    />
                    {hoverIndex !== null && p.points[hoverIndex] && (
                      <circle
                        cx={p.points[hoverIndex]!.x}
                        cy={p.points[hoverIndex]!.y}
                        r={4}
                        fill="var(--surface-base)"
                        stroke={p.color}
                        strokeWidth={2}
                      />
                    )}
                  </g>
                ))}
              </svg>
              {showTooltip && hoverIndex !== null && hoverX !== null && (
                <ChartTooltip
                  label={tooltipLabel}
                  data={tooltipData}
                  x={hoverX}
                  y={rect.y + rect.height / 2}
                  containerWidth={width}
                  visible
                />
              )}
            </>
          );
        }}
      </ResponsiveContainer>
      {showLegend && <Legend series={series} />}
    </div>
  );
}
