'use client';
// modules/ui/Chart/charts/PieChart.tsx
//
// Single-series proportional pie. Each `SeriesPoint` becomes a slice.
// Multi-series pies are not meaningful — the first series wins.
// DonutChart re-uses the same arc math with `innerRadius > 0`.

import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { Legend } from '../primitives/Legend';
import { ChartTooltip } from '../primitives/Tooltip';
import { paletteColor, animationDuration } from '../theme';
import type { BaseChartProps, Series, TooltipDatum } from '../types';

type PieChartProps = BaseChartProps & {
  /** Inner radius ratio (0 = pie, 0.6 = donut). Default = 0. */
  innerRadius?: number;
};

/** Convert a polar (cx, cy, r, angle°) to cartesian. */
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

/** Build an SVG path for an annular wedge. */
function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  if (r0 <= 0) {
    return `M${cx} ${cy} L${x0} ${y0} A${r1} ${r1} 0 ${large} 1 ${x1} ${y1} Z`;
  }
  return `M${x0} ${y0} A${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`;
}

export function PieChart({
  series,
  height = 240,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  ariaLabel,
  className,
}: PieChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const animMs = animationDuration();

  // Use the first series; flatten its points into wedges.
  const slices = useMemo(() => {
    const first = series[0];
    if (!first) return [] as Array<{ id: string; name: string; value: number; color: string }>;
    return first.data
      .filter((p) => p.y !== null && p.y !== undefined && p.y >= 0)
      .map((p, i) => ({
        id: `${first.id}-${i}`,
        name: String(p.label ?? p.x),
        value: p.y as number,
        color: paletteColor(i, p.color),
      }));
  }, [series]);

  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;

  // Synthetic per-slice series for the legend (one entry per slice).
  const legendSeries: Series[] = slices.map((s) => ({
    id: s.id,
    name: s.name,
    data: [],
    color: s.color,
  }));

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer height={height}>
        {({ width }) => {
          const cx = width / 2;
          const cy = height / 2;
          const radius = Math.max(0, Math.min(width, height) / 2 - 8);
          const r0 = innerRadius > 0 ? radius * innerRadius : 0;

          let cursor = 0;
          const wedges = slices.map((s) => {
            const a0 = (cursor / total) * 360;
            cursor += s.value;
            const a1 = (cursor / total) * 360;
            return { ...s, a0, a1, d: arcPath(cx, cy, r0, radius, a0, a1) };
          });

          const tooltipData: TooltipDatum[] =
            hover === null
              ? []
              : [
                  {
                    seriesId: wedges[hover].id,
                    seriesName: wedges[hover].name,
                    color: wedges[hover].color,
                    x: wedges[hover].name,
                    y: wedges[hover].value,
                  },
                ];
          const pct = hover === null ? 0 : Math.round((wedges[hover].value / total) * 100);

          return (
            <>
              <svg
                width={width}
                height={height}
                role="img"
                aria-label={ariaLabel ?? 'Pie chart'}
              >
                {wedges.map((w, i) => (
                  <path
                    key={w.id}
                    d={w.d}
                    fill={w.color}
                    opacity={hover === null || hover === i ? 1 : 0.55}
                    onMouseEnter={() => showTooltip && setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    style={{ transition: animMs ? `opacity ${animMs}ms` : undefined }}
                  />
                ))}
                {r0 > 0 && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--text-primary)"
                    fontSize={14}
                    fontWeight={600}
                  >
                    {hover === null ? Math.round(total) : `${pct}%`}
                  </text>
                )}
              </svg>
              {showTooltip && hover !== null && (
                <ChartTooltip
                  label={wedges[hover].name}
                  data={tooltipData}
                  x={cx}
                  y={cy}
                  containerWidth={width}
                  visible
                />
              )}
            </>
          );
        }}
      </ResponsiveContainer>
      {showLegend && <Legend series={legendSeries} />}
    </div>
  );
}
