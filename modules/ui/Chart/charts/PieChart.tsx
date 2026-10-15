'use client';
// modules/ui/Chart/charts/PieChart.tsx
//
// Single-series proportional pie. Each `SeriesPoint` becomes a slice.
// Multi-series pies are not meaningful — the first series wins.
// DonutChart re-uses the same arc math with `innerRadius > 0`.
// Options: slice labels (percent / value / name), the donut centre (total + caption, or off),
// legend position, a value or share after each legend name, and legend toggling of slices.

import { useMemo, useState, type CSSProperties } from 'react';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { Legend } from '../primitives/Legend';
import { ChartTooltip } from '../primitives/Tooltip';
import { ChartFrame } from '../primitives/ChartFrame';
import { paletteColor, animationDuration } from '../theme';
import type { BaseChartProps, LegendPosition, Series, TooltipDatum } from '../types';
import { defaultNumber } from './_helpers';

export type PieChartProps = Omit<BaseChartProps, 'legendValues'> & {
  /** Inner radius ratio (0 = pie, 0.6 = donut). Default = 0. */
  innerRadius?: number;
  /** Text drawn on each slice. Default = 'none'. Slices under 4 % stay unlabelled. */
  labels?: 'none' | 'percent' | 'value' | 'name';
  /** Value text (tooltip, labels, legend, centre). Default = rounded number. */
  valueFormat?: (value: number) => string;
  /** Donut only: show the total (or the hovered share) in the centre. Default = true. */
  showCenter?: boolean;
  /** Donut only: a caption under the centre total, e.g. "Total". */
  centerLabel?: string;
  /** Text after each legend name. Default = 'none'. */
  legendValue?: 'none' | 'value' | 'percent';
  legendPosition?: LegendPosition;
  legendStyle?: CSSProperties;
  /** Legend entries hide / show their slice. Default = false (on when `hiddenSlices` is set). */
  legendToggle?: boolean;
  /** Slice names hidden at first. */
  hiddenSlices?: string[];
};

/** Convert a polar (cx, cy, r, angle°) to cartesian. */
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

/** Build an SVG path for an annular wedge. */
function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  // A full circle cannot be one arc: split it.
  if (a1 - a0 >= 359.999) {
    return `${arcPath(cx, cy, r0, r1, a0, a0 + 180)} ${arcPath(cx, cy, r0, r1, a0 + 180, a1 - 0.001)}`;
  }
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
  labels = 'none',
  valueFormat,
  showCenter = true,
  centerLabel,
  legendValue = 'none',
  legendPosition = 'bottom',
  legendStyle,
  legendToggle,
  hiddenSlices,
  tooltipMode,
  ariaLabel,
  className,
}: PieChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(hiddenSlices ?? []));
  const animMs = animationDuration();
  const fmt = valueFormat ?? defaultNumber;
  const tipOn = showTooltip && tooltipMode !== 'none';

  // Use the first series; flatten its points into wedges.
  const all = useMemo(() => {
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
  const slices = all.filter((s) => !hidden.has(s.name));
  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  const allTotal = all.reduce((acc, s) => acc + s.value, 0) || 1;
  const pctText = (v: number, t: number) => `${Math.round((v / t) * 100)}%`;

  // Synthetic per-slice series for the legend (one entry per slice).
  const legendSeries: Series[] = all.map((s) => ({ id: s.id, name: s.name, data: [], color: s.color }));
  const toggleable = legendToggle ?? (hiddenSlices?.length ?? 0) > 0;
  const legend = showLegend && legendSeries.length ? (
    <Legend
      series={legendSeries}
      position={legendPosition}
      style={legendStyle}
      hiddenIds={new Set(all.filter((s) => hidden.has(s.name)).map((s) => s.id))}
      onToggle={toggleable ? (id) => {
        const name = all.find((s) => s.id === id)?.name;
        if (name === undefined) return;
        setHidden((prev) => {
          const next = new Set(prev);
          if (next.has(name)) next.delete(name); else next.add(name);
          return next;
        });
      } : undefined}
      values={legendValue === 'none' ? undefined : Object.fromEntries(all.map((s) => [
        s.id, legendValue === 'percent' ? pctText(s.value, hidden.has(s.name) ? allTotal : total) : fmt(s.value),
      ]))}
    />
  ) : null;

  return (
    <ChartFrame legend={legend} position={legendPosition} className={className}>
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
          const hv = hover !== null ? wedges[hover] : undefined;

          const tooltipData: TooltipDatum[] = hv
            ? [{ seriesId: hv.id, seriesName: hv.name, color: hv.color, x: hv.name, y: hv.value, valueLabel: `${fmt(hv.value)} (${pctText(hv.value, total)})` }]
            : [];
          const labelR = r0 > 0 ? (r0 + radius) / 2 : radius * 0.62;

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
                    onMouseEnter={() => tipOn && setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    style={{ transition: animMs ? `opacity ${animMs}ms` : undefined }}
                  />
                ))}
                {labels !== 'none' && wedges.map((w) => {
                  if ((w.a1 - w.a0) / 360 < 0.04) return null;
                  const [lx, ly] = polar(cx, cy, labelR, (w.a0 + w.a1) / 2);
                  const text = labels === 'percent' ? pctText(w.value, total) : labels === 'value' ? fmt(w.value) : w.name;
                  return (
                    <text key={`l-${w.id}`} data-slice-label="" x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      fontSize={11} fontWeight={600} fill="var(--text-primary)" stroke="var(--surface-base)" strokeWidth={3} paintOrder="stroke"
                      pointerEvents="none">
                      {text}
                    </text>
                  );
                })}
                {r0 > 0 && showCenter && (
                  <>
                    <text
                      x={cx}
                      y={centerLabel && !hv ? cy - 7 : cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="var(--text-primary)"
                      fontSize={14}
                      fontWeight={600}
                      data-center=""
                    >
                      {hv ? pctText(hv.value, total) : valueFormat ? fmt(total) : Math.round(total)}
                    </text>
                    {centerLabel && !hv && (
                      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fill="var(--text-secondary)" fontSize={11}>
                        {centerLabel}
                      </text>
                    )}
                  </>
                )}
              </svg>
              {tipOn && hv && (
                <ChartTooltip
                  label={hv.name}
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
    </ChartFrame>
  );
}
