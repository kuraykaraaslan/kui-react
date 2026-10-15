'use client';
// modules/ui/Chart/charts/ScatterChart.tsx
//
// Token-aware scatter plot. Each `SeriesPoint.x` is treated as a numeric x value (NOT a
// band/category); the scale is computed from the data extent unless `xMin` / `xMax` fix it.
// Shares the cartesian surface: legend position / values / toggling, fixed bounds on both
// axes, axis titles, thresholds (horizontal lines at y values), axis text style.

import { useId, useMemo, useState } from 'react';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { XAxis, YAxis } from '../primitives/Axis';
import { Grid } from '../primitives/Grid';
import { ChartTooltip } from '../primitives/Tooltip';
import { ChartFrame } from '../primitives/ChartFrame';
import { Thresholds } from '../primitives/Thresholds';
import { AxisTitles } from '../primitives/AxisTitles';
import { animationDuration } from '../theme';
import type { BaseChartProps, PlotRect, PointShape, TooltipDatum } from '../types';
import { niceTicks, yScale, yExtent, resolveDomain, defaultNumber, linearRegression } from './_helpers';
import { chartLegend, plotPadding, useSeriesVisibility, valueText } from './_cartesian';
import { PointMark, useEntrance } from './_marks';

export type ScatterChartProps = BaseChartProps & {
  /** Point radius in pixels. Default = 4. */
  pointRadius?: number;
  /** Fixed x bounds; default = the data's extent. */
  xMin?: number;
  xMax?: number;
  /** Format an x tick / tooltip x value. */
  xFormat?: (value: number) => string;
  /** Point mark for series without their own. Default = 'circle'. */
  pointShape?: PointShape;
  /** Point fill opacity (0..1). Default = 0.85. */
  pointOpacity?: number;
  /** A least-squares line through each series. Default = false. */
  trendLine?: boolean;
  /** Trend line colour; default = the series'. */
  trendColor?: string;
};

export function ScatterChart({
  series,
  height = 240,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  pointRadius = 4,
  ariaLabel,
  className,
  yFormat,
  xFormat,
  xMin,
  xMax,
  yMin,
  yMax,
  xLabel,
  yLabel,
  thresholds,
  tooltipMode,
  legendPosition = 'bottom',
  legendValues,
  legendStyle,
  legendToggle,
  gridColor,
  tickStyle,
  fill,
  yTickCount = 4,
  showXAxis = true,
  showYAxis = true,
  gridStyle,
  tooltipHeader = true,
  tooltipValueFormat,
  animate = true,
  pointShape = 'circle',
  pointOpacity = 0.85,
  trendLine = false,
  trendColor,
}: ScatterChartProps) {
  const enter = useEntrance('grow', animate);
  const [hover, setHover] = useState<{ si: number; pi: number } | null>(null);
  const animMs = animationDuration();
  const vis = useSeriesVisibility(series);
  const visible = vis.visible;
  const tipOn = showTooltip && tooltipMode !== 'none';
  const fy = yFormat ?? defaultNumber;
  const fx = xFormat ?? defaultNumber;
  const clipId = `scatter-clip-${useId().replace(/:/g, '')}`;

  // Numeric x-extent across the visible series.
  const xExtentVal = useMemo(() => {
    let mn = Infinity;
    let mx = -Infinity;
    for (const s of visible) {
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
    return resolveDomain({ min: mn, max: mx }, { min: xMin, max: xMax, count: 5 });
  }, [visible, xMin, xMax]);

  // Unlike bars, a scatter's value axis need not start at zero: it spans the data.
  const base = useMemo(() => {
    const e = yExtent(visible);
    let lo = Infinity;
    let hi = -Infinity;
    for (const s of visible) for (const p of s.data) {
      if (typeof p.y !== 'number' || !Number.isFinite(p.y)) continue;
      if (p.y < lo) lo = p.y;
      if (p.y > hi) hi = p.y;
    }
    if (!Number.isFinite(lo)) return e;
    if (lo === hi) return { min: lo - 1, max: hi + 1 };
    return { min: lo, max: hi };
  }, [visible]);
  const { min, max } = resolveDomain(base, { min: yMin, max: yMax, thresholds, count: yTickCount });

  const legend = chartLegend({
    show: showLegend, series: vis.colored, hidden: vis.hidden, toggle: vis.toggle, position: legendPosition,
    values: legendValues, style: legendStyle, toggleable: legendToggle, yFormat,
  });

  return (
    <ChartFrame legend={legend} position={legendPosition} className={className} fill={fill}>
      <ResponsiveContainer height={height} fill={fill}>
        {({ width, height }) => {
          const yVals = niceTicks(min, max, yTickCount);
          const yLabels = yVals.map(fy);
          const pad = plotPadding({ yTickLabels: yLabels, xLabel, yLabel, tickStyle, showXAxis, showYAxis });
          pad.right = Math.max(pad.right, 16);
          const rect: PlotRect = {
            x: pad.left,
            y: pad.top,
            width: Math.max(0, width - pad.left - pad.right),
            height: Math.max(0, height - pad.top - pad.bottom),
          };
          const xVals = niceTicks(xExtentVal.min, xExtentVal.max, Math.max(2, Math.min(5, Math.floor(rect.width / 70))));

          const xScale = (v: number) =>
            rect.x + ((v - xExtentVal.min) / (xExtentVal.max - xExtentVal.min)) * rect.width;
          const yPx = (v: number) => yScale(v, min, max, rect);

          const yTicks = yVals.map((v, i) => ({ position: yPx(v), label: yLabels[i] }));
          const xTicks = xVals.map((v) => ({ position: xScale(v), label: fx(v) }));

          const tooltipData: TooltipDatum[] = hover && visible[hover.si]
            ? (() => {
                const s = visible[hover.si];
                const p = s.data[hover.pi];
                return [{
                  seriesId: s.id,
                  seriesName: s.name,
                  color: s.color as string,
                  x: p.x,
                  y: p.y,
                  valueLabel: p.y === null ? undefined : (tooltipValueFormat ? tooltipValueFormat(p.y, s) : valueText(s, p.y, p, yFormat)),
                }];
              })()
            : [];

          return (
            <>
              <svg width={width} height={height} role="img" aria-label={ariaLabel ?? 'Scatter chart'} style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <clipPath id={clipId}><rect x={rect.x - pointRadius} y={rect.y - pointRadius} width={rect.width + 2 * pointRadius} height={rect.height + 2 * pointRadius} /></clipPath>
                </defs>
                {showGrid && <Grid rect={rect} yTicks={yTicks.map((t) => t.position)} color={gridColor} lineStyle={gridStyle} />}
                <YAxis ticks={yTicks} x={rect.x} yStart={rect.y} yEnd={rect.y + rect.height} textStyle={tickStyle} hideLine tickMarks={false} showLabels={showYAxis} />
                <XAxis ticks={xTicks} y={rect.y + rect.height} xStart={rect.x} xEnd={rect.x + rect.width} textStyle={tickStyle} tickMarks={false} showLabels={showXAxis} />
                <AxisTitles rect={rect} height={height} xLabel={xLabel} yLabel={yLabel} style={tickStyle} />
                <g ref={enter}>
                <g clipPath={`url(#${clipId})`}>
                  <Thresholds lines={thresholds} rect={rect} scale={yPx} />
                  {trendLine && visible.map((s) => {
                    const pts = s.data.flatMap((p) => {
                      const xv = typeof p.x === 'number' ? p.x : Number(p.x);
                      return p.y === null || p.y === undefined || !isFinite(xv) ? [] : [{ x: xv, y: p.y }];
                    });
                    const fit = linearRegression(pts);
                    if (!fit) return null;
                    const x0 = Math.min(...pts.map((p) => p.x));
                    const x1 = Math.max(...pts.map((p) => p.x));
                    return (
                      <line key={`trend-${s.id}`} data-trend={s.id} x1={xScale(x0)} y1={yPx(fit.intercept + fit.slope * x0)}
                        x2={xScale(x1)} y2={yPx(fit.intercept + fit.slope * x1)} stroke={trendColor ?? s.color} strokeWidth={1.5}
                        strokeDasharray="6 4" strokeLinecap="round" opacity={0.9} />
                    );
                  })}
                  {visible.map((s, si) => (
                    <g key={s.id} data-series={s.id}>
                      {s.data.map((p, pi) => {
                        if (p.y === null || p.y === undefined) return null;
                        const xv = typeof p.x === 'number' ? p.x : Number(p.x);
                        if (!isFinite(xv)) return null;
                        const active = hover?.si === si && hover?.pi === pi;
                        const r = s.pointSize ?? pointRadius;
                        return (
                          <PointMark
                            key={`${s.id}-${pi}`}
                            shape={s.pointShape ?? pointShape}
                            x={xScale(xv)}
                            y={yPx(p.y)}
                            r={active ? r + 2 : r}
                            fill={p.color ?? s.color}
                            fillOpacity={hover === null || active ? pointOpacity : pointOpacity * 0.45}
                            stroke={p.color ?? s.color}
                            strokeOpacity={hover === null || active ? Math.min(1, pointOpacity + 0.15) : 0.3}
                            strokeWidth={1}
                            onMouseEnter={() => tipOn && setHover({ si, pi })}
                            onMouseLeave={() => setHover(null)}
                            style={{ transition: animMs ? `r ${animMs}ms` : undefined }}
                          />
                        );
                      })}
                    </g>
                  ))}
                </g>
                </g>
              </svg>
              {tipOn && hover && tooltipData.length > 0 && (
                <ChartTooltip
                  label={tooltipHeader ? fx(Number(tooltipData[0].x)) : ''}
                  data={tooltipData}
                  x={xScale(Number(tooltipData[0].x))}
                  y={yPx(Number(tooltipData[0].y ?? 0))}
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
