'use client';
// modules/ui/Chart/charts/BarChart.tsx
//
// Token-aware bar chart: grouped or `stacked` series, vertical (default) or horizontal bars,
// optional value labels, plus the shared cartesian surface (legend position / values /
// toggling, fixed value bounds, axis titles, thresholds, tooltip mode, axis text style).

import { useId, useMemo, useState } from 'react';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { XAxis, YAxis } from '../primitives/Axis';
import { Grid } from '../primitives/Grid';
import { ChartTooltip } from '../primitives/Tooltip';
import { ChartFrame } from '../primitives/ChartFrame';
import { Thresholds } from '../primitives/Thresholds';
import { AxisTitles } from '../primitives/AxisTitles';
import { animationDuration } from '../theme';
import type { BaseChartProps, PlotRect, TooltipDatum } from '../types';
import {
  niceTicks, yExtent, yScale, bandCenter, bandWidth, xCategories, stackedExtent, stackTops, resolveDomain,
  defaultNumber, labelWidth,
} from './_helpers';
import { chartLegend, plotPadding, useSeriesVisibility, valueText } from './_cartesian';

export type BarChartProps = BaseChartProps & {
  /** Corner radius in pixels for each bar. Default = 4. */
  radius?: number;
  /** Stack the series in one bar per category. */
  stacked?: boolean;
  /** 'vertical' (columns, default) or 'horizontal' (bars growing to the right). */
  orientation?: 'vertical' | 'horizontal';
  /** Print each bar's value next to (grouped) or inside (stacked) it. Default = false. */
  showValues?: boolean;
};

export function BarChart({
  series,
  height = 240,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  radius = 4,
  stacked = false,
  orientation = 'vertical',
  showValues = false,
  yFormat,
  ariaLabel,
  className,
  legendPosition = 'bottom',
  legendValues,
  legendStyle,
  legendToggle,
  yMin,
  yMax,
  yLabel,
  xLabel,
  thresholds,
  tooltipMode,
  gridColor,
  tickStyle,
}: BarChartProps) {
  const [hover, setHover] = useState<{ index: number; along: number; pos: number } | null>(null);
  const vis = useSeriesVisibility(series);
  const visible = vis.visible;
  const horizontal = orientation === 'horizontal';
  const tipMode = showTooltip ? (tooltipMode ?? 'axis') : 'none';
  const fmt = yFormat ?? defaultNumber;
  const clipId = `bar-clip-${useId().replace(/:/g, '')}`;

  const categories = useMemo(() => xCategories(vis.colored), [vis.colored]);
  const base = useMemo(() => (stacked ? stackedExtent(visible) : yExtent(visible)), [visible, stacked]);
  const { min, max } = resolveDomain(base, { min: yMin, max: yMax, thresholds });
  const tops = useMemo(() => (stacked ? stackTops(visible) : []), [visible, stacked]);
  const animMs = animationDuration();

  const legend = chartLegend({
    show: showLegend, series: vis.colored, hidden: vis.hidden, toggle: vis.toggle, position: legendPosition,
    values: legendValues, style: legendStyle, toggleable: legendToggle, yFormat,
  });

  return (
    <ChartFrame legend={legend} position={legendPosition} className={className}>
      <ResponsiveContainer height={height}>
        {({ width }) => {
          const valueTicks = niceTicks(min, max, 4);
          const valueLabels = valueTicks.map(fmt);
          // The left axis carries values (vertical) or category names (horizontal).
          const pad = horizontal
            ? { ...plotPadding({ yTickLabels: categories, xLabel, yLabel, tickStyle }), right: 16 + (showValues ? labelWidth(valueLabels) : 0) }
            : { ...plotPadding({ yTickLabels: valueLabels, xLabel, yLabel, tickStyle }), top: showValues ? 20 : 12 };
          if (horizontal) pad.left = Math.min(pad.left, Math.max(40, width * 0.4));
          const rect: PlotRect = {
            x: pad.left,
            y: pad.top,
            width: Math.max(0, width - pad.left - pad.right),
            height: Math.max(0, height - pad.top - pad.bottom),
          };
          // Value → pixel along the value axis; category index → centre along the category axis.
          const vPx = horizontal
            ? (v: number) => (max === min ? rect.x : rect.x + ((v - min) / (max - min)) * rect.width)
            : (v: number) => yScale(v, min, max, rect);
          const catRect: PlotRect = horizontal ? { x: rect.y, y: rect.x, width: rect.height, height: rect.width } : rect;
          const cPx = (i: number) => bandCenter(i, categories.length, catRect);
          const valuePixels = valueTicks.map(vPx);
          const valueAxis = valueTicks.map((_, i) => ({ position: valuePixels[i], label: valueLabels[i] }));
          const catAxis = categories.map((label, i) => ({ position: cPx(i), label }));

          const groupWidth = bandWidth(categories.length, catRect, 0.25);
          const barWidth = stacked ? groupWidth : visible.length > 0 ? groupWidth / visible.length : 0;
          const zero = vPx(Math.min(max, Math.max(min, 0)));

          const bars = visible.map((s, si) => s.data.map((p, i) => {
            if (p.y === null || p.y === undefined || i >= categories.length) return null;
            const start = cPx(i) - groupWidth / 2 + (stacked ? 0 : si * barWidth);
            const topV = stacked ? (tops[si]?.[i] ?? 0) : p.y;
            const a = vPx(stacked ? topV - Math.max(0, p.y) : 0);
            const b = vPx(topV);
            const lo = Math.min(stacked ? a : zero, b);
            const len = Math.abs(b - (stacked ? a : zero));
            const thick = Math.max(0, barWidth - 2);
            return {
              i, y: p.y, label: valueText(s, p.y, p, yFormat), from: stacked ? a : zero, end: b, mid: (a + b) / 2,
              x: horizontal ? lo : start, yy: horizontal ? start : lo,
              w: horizontal ? len : thick, h: horizontal ? thick : len, centre: start + thick / 2,
            };
          }));

          let tip: TooltipDatum[] = [];
          if (hover && tipMode !== 'none') {
            tip = visible.map((s) => {
              const p = s.data[hover.index];
              const y = p?.y ?? null;
              return { seriesId: s.id, seriesName: s.name, color: s.color as string, x: p?.x ?? '', y, valueLabel: y === null ? undefined : valueText(s, y, p, yFormat) };
            });
            if (tipMode === 'point') {
              // Grouped: the bar under the pointer along the category axis; stacked: the segment under it.
              const k = stacked
                ? visible.findIndex((_, si) => {
                  const b = bars[si][hover.index];
                  return !!b && hover.pos >= Math.min(b.from, b.end) && hover.pos <= Math.max(b.from, b.end);
                })
                : Math.floor((hover.along - (cPx(hover.index) - groupWidth / 2)) / (barWidth || 1));
              tip = k >= 0 && k < tip.length && tip[k].y !== null ? [tip[k]] : [];
            }
          }
          const hoverC = hover === null ? null : cPx(hover.index);

          return (
            <>
              <svg
                width={width}
                height={height}
                role="img"
                aria-label={ariaLabel ?? 'Bar chart'}
                onMouseMove={(e) => {
                  if (tipMode === 'none' || categories.length === 0) return;
                  const bounds = (e.currentTarget as SVGElement).getBoundingClientRect();
                  const along = horizontal ? e.clientY - bounds.top - rect.y : e.clientX - bounds.left - rect.x;
                  const across = horizontal ? e.clientX - bounds.left : e.clientY - bounds.top;
                  if (along < 0 || along > catRect.width) { setHover(null); return; }
                  const step = catRect.width / categories.length;
                  setHover({ index: Math.min(categories.length - 1, Math.max(0, Math.floor(along / step))), along: catRect.x + along, pos: across });
                }}
                onMouseLeave={() => setHover(null)}
              >
                <defs>
                  <clipPath id={clipId}><rect x={rect.x} y={rect.y - (showValues ? 16 : 0)} width={rect.width + (showValues ? 60 : 0)} height={rect.height + (showValues ? 16 : 0)} /></clipPath>
                </defs>
                {showGrid && (horizontal
                  ? <Grid rect={rect} yTicks={[]} xTicks={valuePixels} color={gridColor} />
                  : <Grid rect={rect} yTicks={valuePixels} color={gridColor} />)}
                {horizontal ? (
                  <>
                    <YAxis ticks={catAxis} x={rect.x} yStart={rect.y} yEnd={rect.y + rect.height} textStyle={tickStyle} />
                    <XAxis ticks={valueAxis} y={rect.y + rect.height} xStart={rect.x} xEnd={rect.x + rect.width} textStyle={tickStyle} />
                  </>
                ) : (
                  <>
                    <YAxis ticks={valueAxis} x={rect.x} yStart={rect.y} yEnd={rect.y + rect.height} textStyle={tickStyle} />
                    <XAxis ticks={catAxis} y={rect.y + rect.height} xStart={rect.x} xEnd={rect.x + rect.width} textStyle={tickStyle} />
                  </>
                )}
                <AxisTitles rect={rect} height={height} xLabel={xLabel} yLabel={yLabel} style={tickStyle} />
                <g clipPath={`url(#${clipId})`}>
                  {visible.map((s, si) => (
                    <g key={s.id} data-series={s.id}>
                      {bars[si].map((b) => b && (
                        <rect
                          key={`${s.id}-${b.i}`}
                          x={b.x}
                          y={b.yy}
                          width={b.w}
                          height={b.h}
                          rx={Math.min(radius, barWidth / 2)}
                          fill={s.color}
                          opacity={hover === null || hover.index === b.i ? 1 : 0.45}
                          style={{ transition: animMs ? `opacity ${animMs}ms, height ${animMs}ms` : undefined }}
                        />
                      ))}
                      {showValues && bars[si].map((b) => b && (
                        <text
                          key={`v-${s.id}-${b.i}`}
                          data-value-label=""
                          x={horizontal ? (stacked ? b.mid : b.end + (b.y < 0 ? -4 : 4)) : b.centre}
                          y={horizontal ? b.centre + 4 : (stacked ? b.mid + 4 : b.end + (b.y < 0 ? 12 : -4))}
                          textAnchor={horizontal && !stacked ? (b.y < 0 ? 'end' : 'start') : 'middle'}
                          fontSize={11}
                          fill="var(--text-primary)"
                          stroke="var(--surface-base)"
                          strokeWidth={3}
                          paintOrder="stroke"
                        >
                          {b.label}
                        </text>
                      ))}
                    </g>
                  ))}
                  <Thresholds lines={thresholds} rect={rect} scale={vPx} orientation={horizontal ? 'vertical' : 'horizontal'} />
                </g>
              </svg>
              {tip.length > 0 && hoverC !== null && (
                <ChartTooltip
                  label={categories[hover!.index] ?? ''}
                  data={tip}
                  x={horizontal ? rect.x + rect.width / 2 : hoverC}
                  y={horizontal ? hoverC : rect.y + rect.height / 2}
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
