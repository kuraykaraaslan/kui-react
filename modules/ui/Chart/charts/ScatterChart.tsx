'use client';
// modules/ui/Chart/charts/ScatterChart.tsx
//
// Token-aware scatter plot. Each `SeriesPoint.x` is treated as a
// numeric x value (NOT a band/category) — the scale is computed from
// the actual data extent. `y` is numeric as usual.

import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { XAxis, YAxis } from '../primitives/Axis';
import { Grid } from '../primitives/Grid';
import { Legend } from '../primitives/Legend';
import { ChartTooltip } from '../primitives/Tooltip';
import { paletteColor, animationDuration } from '../theme';
import type { BaseChartProps, PlotRect, TooltipDatum } from '../types';
import { niceTicks, yScale, yExtent } from './_helpers';

type ScatterChartProps = BaseChartProps & {
  /** Point radius in pixels. Default = 4. */
  pointRadius?: number;
};

const PADDING = { top: 12, right: 16, bottom: 28, left: 40 };

export function ScatterChart({
  series,
  height = 240,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  pointRadius = 4,
  ariaLabel,
  className,
}: ScatterChartProps) {
  const [hover, setHover] = useState<{ si: number; pi: number } | null>(null);
  const animMs = animationDuration();

  // Numeric x-extent across all series.
  const xExtentVal = useMemo(() => {
    let mn = Infinity;
    let mx = -Infinity;
    for (const s of series) {
      for (const p of s.data) {
        const xv = typeof p.x === 'number' ? p.x : Number(p.x);
        if (!isFinite(xv)) continue;
        if (xv < mn) mn = xv;
        if (xv > mx) mx = xv;
      }
    }
    if (!isFinite(mn)) mn = 0;
    if (!isFinite(mx)) mx = 1;
    if (mn === mx) {
      mn -= 1;
      mx += 1;
    }
    return { min: mn, max: mx };
  }, [series]);

  const { min, max } = useMemo(() => yExtent(series), [series]);

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
          const yVals = niceTicks(min, max, 4);
          const xVals = niceTicks(xExtentVal.min, xExtentVal.max, 5);

          const xScale = (v: number) =>
            rect.x + ((v - xExtentVal.min) / (xExtentVal.max - xExtentVal.min)) * rect.width;

          const yTicks = yVals.map((v) => ({
            position: yScale(v, min, max, rect),
            label: String(Math.round(v * 100) / 100),
          }));
          const xTicks = xVals.map((v) => ({
            position: xScale(v),
            label: String(Math.round(v * 100) / 100),
          }));

          const tooltipData: TooltipDatum[] = hover
            ? (() => {
                const s = series[hover.si];
                const p = s.data[hover.pi];
                return [
                  {
                    seriesId: s.id,
                    seriesName: s.name,
                    color: paletteColor(hover.si, s.color),
                    x: p.x,
                    y: p.y,
                  },
                ];
              })()
            : [];

          return (
            <>
              <svg width={width} height={height} role="img" aria-label={ariaLabel ?? 'Scatter chart'}>
                {showGrid && <Grid rect={rect} yTicks={yTicks.map((t) => t.position)} />}
                <YAxis ticks={yTicks} x={rect.x} yStart={rect.y} yEnd={rect.y + rect.height} />
                <XAxis ticks={xTicks} y={rect.y + rect.height} xStart={rect.x} xEnd={rect.x + rect.width} />
                {series.map((s, si) => {
                  const color = paletteColor(si, s.color);
                  return (
                    <g key={s.id}>
                      {s.data.map((p, pi) => {
                        if (p.y === null || p.y === undefined) return null;
                        const xv = typeof p.x === 'number' ? p.x : Number(p.x);
                        if (!isFinite(xv)) return null;
                        const cx = xScale(xv);
                        const cy = yScale(p.y, min, max, rect);
                        const active = hover?.si === si && hover?.pi === pi;
                        return (
                          <circle
                            key={`${s.id}-${pi}`}
                            cx={cx}
                            cy={cy}
                            r={active ? pointRadius + 2 : pointRadius}
                            fill={color}
                            opacity={hover === null || active ? 0.85 : 0.4}
                            onMouseEnter={() => showTooltip && setHover({ si, pi })}
                            onMouseLeave={() => setHover(null)}
                            style={{ transition: animMs ? `r ${animMs}ms` : undefined }}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
              {showTooltip && hover && tooltipData.length > 0 && (
                <ChartTooltip
                  label={String(tooltipData[0].x)}
                  data={tooltipData}
                  x={xScale(Number(tooltipData[0].x))}
                  y={yScale(Number(tooltipData[0].y ?? 0), min, max, rect)}
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
