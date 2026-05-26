'use client';
// modules/ui/Chart/charts/AreaChart.tsx
//
// Token-aware filled area chart. Each series is drawn as a stroked
// outline plus a translucent fill toward the baseline. Multi-series
// areas are overlaid (NOT stacked — stacked is M2).

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

type AreaChartProps = BaseChartProps & {
  /** Smooth curves between points. Default = true. */
  smooth?: boolean;
  /** Translucent fill alpha (0..1). Default = 0.2. */
  fillOpacity?: number;
};

const PADDING = { top: 12, right: 16, bottom: 28, left: 40 };

export function AreaChart({
  series,
  height = 240,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  smooth = true,
  fillOpacity = 0.2,
  ariaLabel,
  className,
}: AreaChartProps) {
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
          const baselineY = yScale(0, min, max, rect);

          const xTicks = categories.map((label, i) => ({
            position: bandCenter(i, categories.length, rect),
            label,
          }));
          const yTicks = tickValues.map((v, i) => ({
            position: yPixels[i],
            label: String(Math.round(v * 100) / 100),
          }));

          const projected = series.map((s, si) => {
            const color = paletteColor(si, s.color);
            const points = s.data.map((p, i) =>
              p.y === null || p.y === undefined
                ? null
                : { x: bandCenter(i, categories.length, rect), y: yScale(p.y, min, max, rect) },
            );
            const linePoints = points.filter(Boolean) as Array<{ x: number; y: number }>;
            const path = smooth ? smoothPath(points) : linePath(points);
            const areaPath =
              linePoints.length > 1
                ? `${path} L${linePoints[linePoints.length - 1].x} ${baselineY} L${linePoints[0].x} ${baselineY} Z`
                : '';
            return { id: s.id, name: s.name, color, points, path, areaPath };
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
                aria-label={ariaLabel ?? 'Area chart'}
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
                    {p.areaPath && (
                      <path
                        d={p.areaPath}
                        fill={p.color}
                        opacity={fillOpacity}
                        style={{ transition: animMs ? `opacity ${animMs}ms` : undefined }}
                      />
                    )}
                    <path
                      d={p.path}
                      fill="none"
                      stroke={p.color}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
