'use client';
// modules/ui/Chart/charts/BarChart.tsx
//
// Token-aware vertical bar chart. Supports multi-series (grouped) bars
// by default. M2 will add `stacked` and `horizontal` orientations.

import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { XAxis, YAxis } from '../primitives/Axis';
import { Grid } from '../primitives/Grid';
import { Legend } from '../primitives/Legend';
import { ChartTooltip } from '../primitives/Tooltip';
import { paletteColor, animationDuration } from '../theme';
import type { BaseChartProps, PlotRect, TooltipDatum } from '../types';
import { niceTicks, yExtent, yScale, bandCenter, bandWidth, xCategories } from './_helpers';

type BarChartProps = BaseChartProps & {
  /** Corner radius in pixels for each bar. Default = 4. */
  radius?: number;
  // TODO M2: stacked, horizontal, normalize, value-label-on-top.
};

const PADDING = { top: 12, right: 16, bottom: 28, left: 40 };

export function BarChart({
  series,
  height = 240,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  radius = 4,
  ariaLabel,
  className,
}: BarChartProps) {
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

          const groupWidth = bandWidth(categories.length, rect, 0.25);
          const barWidth = series.length > 0 ? groupWidth / series.length : 0;
          const baselineY = yScale(0, min, max, rect);

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
                aria-label={ariaLabel ?? 'Bar chart'}
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
                {series.map((s, si) => {
                  const color = paletteColor(si, s.color);
                  return (
                    <g key={s.id}>
                      {s.data.map((p, i) => {
                        if (p.y === null || p.y === undefined) return null;
                        const center = bandCenter(i, categories.length, rect);
                        const groupLeft = center - groupWidth / 2;
                        const bx = groupLeft + si * barWidth;
                        const ty = yScale(p.y, min, max, rect);
                        const by = Math.min(ty, baselineY);
                        const bh = Math.abs(ty - baselineY);
                        return (
                          <rect
                            key={`${s.id}-${i}`}
                            x={bx}
                            y={by}
                            width={Math.max(0, barWidth - 2)}
                            height={Math.max(0, bh)}
                            rx={Math.min(radius, barWidth / 2)}
                            fill={color}
                            opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.45}
                            style={{
                              transition: animMs
                                ? `opacity ${animMs}ms, height ${animMs}ms`
                                : undefined,
                            }}
                          />
                        );
                      })}
                    </g>
                  );
                })}
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
