'use client';
// The one renderer behind LineChart, AreaChart and TimeSeriesChart.
//
// `mode="band"` places points by index on a category axis (stacking allowed); `mode="time"`
// places them by timestamp (phase 9 §9.1 / §9.2: uneven sampling, gaps, drag-to-zoom). Zoom is
// a drag-to-select brush local to this component's state: it never reaches the caller, so a
// board's time window is untouched. Double-click or the "Reset zoom" button leaves it.
//
// Everything a widget setting can change is a prop: curve (smooth / linear / step), per-series
// stroke style, width, points and fill, hidden series (legend toggle), legend position and
// values, fixed y bounds, axis titles, thresholds, the tooltip mode and the axis text style.

import { useId, useMemo, useRef, useState } from 'react';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { XAxis, YAxis } from '../primitives/Axis';
import { Grid } from '../primitives/Grid';
import { ChartTooltip } from '../primitives/Tooltip';
import { Crosshair } from '../primitives/Crosshair';
import { ChartFrame } from '../primitives/ChartFrame';
import { Thresholds } from '../primitives/Thresholds';
import { AxisTitles } from '../primitives/AxisTitles';
import { animationDuration, chartTheme } from '../theme';
import type { BaseChartProps, CurveType, PlotRect, TooltipDatum } from '../types';
import {
  niceTicks, yExtent, yScale, bandCenter, xCategories, stackedExtent, stackTops, curvePath, continuePath,
  dashArray, resolveDomain, defaultNumber,
} from './_helpers';
import {
  timeExtent, timePoints, visibleYExtent, xTime, invTime, timeTicks, formatTick, formatFull,
  brushDomain, nearestIndex, type TimeDomain, type TimePoint,
} from './_time';
import { chartLegend, plotPadding, useSeriesVisibility, valueText } from './_cartesian';

export type SeriesChartProps = BaseChartProps & {
  variant: 'line' | 'area';
  mode: 'band' | 'time';
  /** Smooth curves. Default = true. `curve` wins when set. */
  smooth?: boolean;
  /** How points are joined. Default = 'smooth' ('linear' for a stacked area without an explicit curve). */
  curve?: CurveType;
  /** Default stroke width (px) for series without their own. Default = 2. */
  strokeWidth?: number;
  /** Area fill alpha (0..1) for series without their own. Default = 0.2. */
  fillOpacity?: number;
  /** Band mode only: stack the series. */
  stacked?: boolean;
  /** Locale for time tick labels; default = the runtime's. */
  locale?: string;
};

type Row = TimePoint;

export function SeriesChart({
  series, variant, mode, height = 240, showLegend = true, showGrid = true, showTooltip = true,
  smooth = true, curve: curveProp, strokeWidth = 2, fillOpacity = 0.2, stacked = false,
  zoom = true, resetZoomLabel = 'Reset zoom', yFormat, locale, timeZone, ariaLabel, className,
  legendPosition = 'bottom', legendValues, legendStyle, legendToggle, yMin, yMax, yLabel, xLabel,
  thresholds, tooltipMode, gridColor, tickStyle,
}: SeriesChartProps) {
  const isTime = mode === 'time';
  const isStacked = stacked && !isTime;
  const curve: CurveType = curveProp ?? (smooth && !isStacked ? 'smooth' : 'linear');
  const tipMode = showTooltip ? (tooltipMode ?? 'axis') : 'none';
  const zoomable = isTime && zoom;

  const vis = useSeriesVisibility(series);
  const visible = vis.visible;
  const [zoomDomain, setZoomDomain] = useState<TimeDomain | null>(null);
  const [hover, setHover] = useState<{ key: number; y: number } | null>(null);
  const [brush, setBrush] = useState<{ from: number; to: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const clipId = `sc-clip-${useId().replace(/:/g, '')}`;
  const animMs = animationDuration();
  const fmt = yFormat ?? defaultNumber;

  const categories = useMemo(() => xCategories(vis.colored), [vis.colored]);
  const rows: Row[][] = useMemo(
    () => (isTime ? timePoints(visible) : visible.map((s) => s.data.map((p, i) => ({ t: i, y: p.y, label: p.label })))),
    [isTime, visible],
  );
  const full: TimeDomain = useMemo(() => (isTime ? timeExtent(visible) : [0, 1]), [isTime, visible]);
  const domain: TimeDomain = zoomDomain && zoomDomain[1] > full[0] && zoomDomain[0] < full[1] ? zoomDomain : full;
  const zoomed = isTime && domain !== full;
  const span = domain[1] - domain[0];
  const tops = useMemo(() => (isStacked ? stackTops(visible) : []), [isStacked, visible]);
  const base = useMemo(
    () => (isTime ? visibleYExtent(rows, domain) : isStacked ? stackedExtent(visible) : yExtent(visible)),
    [isTime, isStacked, rows, domain, visible],
  );
  const { min, max } = resolveDomain(base, { min: yMin, max: yMax, thresholds });

  const legend = chartLegend({
    show: showLegend, series: vis.colored, hidden: vis.hidden, toggle: vis.toggle, position: legendPosition,
    values: legendValues, style: legendStyle, toggleable: legendToggle, yFormat,
  });

  return (
    <ChartFrame legend={legend} position={legendPosition} className={className}>
      <ResponsiveContainer height={height}>
        {({ width }) => {
          const yTickValues = niceTicks(min, max, 4);
          const yTickLabels = yTickValues.map(fmt);
          const pad = plotPadding({ yTickLabels, xLabel, yLabel, tickStyle, minLeft: isTime ? 44 : 40 });
          const rect: PlotRect = {
            x: pad.left, y: pad.top,
            width: Math.max(0, width - pad.left - pad.right),
            height: Math.max(0, height - pad.top - pad.bottom),
          };
          const yPx = (v: number) => yScale(v, min, max, rect);
          const xPx = (k: number) => (isTime ? xTime(k, domain, rect) : bandCenter(k, categories.length, rect));
          const yPixels = yTickValues.map(yPx);
          const yTicks = yTickValues.map((_, i) => ({ position: yPixels[i], label: yTickLabels[i] }));
          const xTicks = isTime
            ? timeTicks(domain, Math.max(2, Math.floor(rect.width / 90)), timeZone)
              .map((t) => ({ position: xTime(t, domain, rect), label: formatTick(t, span, locale, timeZone) }))
            : categories.map((label, i) => ({ position: bandCenter(i, categories.length, rect), label }));
          const baselineY = yPx(Math.min(max, Math.max(min, 0)));

          const plotY = (si: number, j: number, y: number) => yPx(isStacked ? (tops[si]?.[j] ?? 0) : y);
          const projected = visible.map((s, si) => {
            const color = s.color as string;
            const w = s.strokeWidth ?? strokeWidth;
            const pts = rows[si].map((p, j) => (p.y === null || p.y === undefined ? null : { x: xPx(p.t), y: plotY(si, j, p.y) }));
            const solid = pts.filter(Boolean) as Array<{ x: number; y: number }>;
            const opacity = variant === 'area' ? (s.fillOpacity ?? fillOpacity) : (s.fillOpacity ?? 0);
            let areaPath = '';
            if (opacity > 0 && solid.length > 1) {
              const top = curvePath(solid, curve);
              if (isStacked && si > 0) {
                const below = rows[si]
                  .map((p, j) => (p.y !== null && p.y !== undefined && tops[si - 1]?.[j] != null ? { x: xPx(p.t), y: yPx(tops[si - 1][j] as number) } : null))
                  .filter(Boolean) as Array<{ x: number; y: number }>;
                areaPath = `${top} ${continuePath(below.reverse(), curve, 'before')} Z`;
              } else {
                areaPath = `${top} L${solid[solid.length - 1].x} ${baselineY} L${solid[0].x} ${baselineY} Z`;
              }
            }
            return {
              s, color, w, pts, solid, opacity, areaPath,
              path: curvePath(pts, curve),
              solo: solid.length === 1 ? solid[0] : null,
            };
          });

          // Hover: band = the hovered index; time = the nearest sampled instant across the visible series.
          let anchor: number | null = null;
          let header = '';
          let tip: Array<TooltipDatum & { py: number }> = [];
          if (hover && tipMode !== 'none' && !brush) {
            if (isTime) {
              const allTimes = [...new Set(rows.flatMap((pts) => pts.map((p) => p.t)))].sort((a, b) => a - b);
              const k = nearestIndex(allTimes, hover.key);
              anchor = k >= 0 ? allTimes[k] : null;
              if (anchor !== null) header = formatFull(anchor, span, locale, timeZone);
            } else if (hover.key >= 0 && hover.key < categories.length) {
              anchor = hover.key;
              header = categories[hover.key];
            }
            if (anchor !== null) {
              const at = anchor;
              tip = visible.flatMap((s, si) => {
                const j = isTime ? rows[si].findIndex((p) => p.t === at) : at;
                const p = rows[si][j];
                if (isTime && !p) return [];
                const y = p?.y ?? null;
                return [{
                  seriesId: s.id, seriesName: s.name, color: s.color as string, x: isTime ? at : header, y,
                  valueLabel: y === null ? undefined : valueText(s, y, p, yFormat),
                  py: y === null ? Number.NaN : plotY(si, j, y),
                }];
              });
              if (tipMode === 'point') {
                const near = tip.filter((d) => d.y !== null)
                  .sort((a, b) => Math.abs(a.py - hover.y) - Math.abs(b.py - hover.y))[0];
                tip = near ? [near] : [];
              }
            }
          }
          const hoverX = anchor === null ? null : xPx(anchor);

          const local = (e: React.MouseEvent) => {
            const b = svgRef.current?.getBoundingClientRect();
            return b ? { px: e.clientX - b.left, py: e.clientY - b.top } : { px: 0, py: 0 };
          };
          const inPlot = (px: number) => px >= rect.x && px <= rect.x + rect.width;

          return (
            <>
              <svg
                ref={svgRef}
                width={width}
                height={height}
                role="img"
                aria-label={ariaLabel ?? (variant === 'area' ? 'Area chart' : 'Line chart')}
                style={isTime ? { touchAction: 'pan-y', cursor: zoomable ? 'crosshair' : undefined, userSelect: 'none' } : undefined}
                onMouseDown={(e) => {
                  if (!zoomable || e.button !== 0) return;
                  const { px } = local(e);
                  if (inPlot(px)) setBrush({ from: px, to: px });
                }}
                onMouseMove={(e) => {
                  const { px, py } = local(e);
                  if (brush) setBrush({ from: brush.from, to: Math.min(rect.x + rect.width, Math.max(rect.x, px)) });
                  if (tipMode === 'none') return;
                  if (!inPlot(px)) { setHover(null); return; }
                  if (isTime) setHover({ key: invTime(px, domain, rect), y: py });
                  else if (categories.length) {
                    const step = rect.width / categories.length;
                    setHover({ key: Math.min(categories.length - 1, Math.max(0, Math.floor((px - rect.x) / step))), y: py });
                  }
                }}
                onMouseUp={() => {
                  if (!brush) return;
                  const next = brushDomain(brush.from, brush.to, domain, full, rect);
                  setBrush(null);
                  if (next) { setZoomDomain(next); setHover(null); }
                }}
                onMouseLeave={() => { setHover(null); setBrush(null); }}
                onDoubleClick={() => { if (zoomable) setZoomDomain(null); }}
              >
                <defs>
                  <clipPath id={clipId}><rect x={rect.x - 4} y={rect.y - 4} width={rect.width + 8} height={rect.height + 8} /></clipPath>
                </defs>
                {showGrid && <Grid rect={rect} yTicks={yPixels} color={gridColor} />}
                <YAxis ticks={yTicks} x={rect.x} yStart={rect.y} yEnd={rect.y + rect.height} textStyle={tickStyle} />
                <XAxis ticks={xTicks} y={rect.y + rect.height} xStart={rect.x} xEnd={rect.x + rect.width} textStyle={tickStyle} />
                <AxisTitles rect={rect} height={height} xLabel={xLabel} yLabel={yLabel} style={tickStyle} />
                <Crosshair rect={rect} x={tipMode === 'none' || brush ? null : hoverX} />
                <g clipPath={`url(#${clipId})`}>
                  {projected.map((p) => (
                    <g key={p.s.id} data-series={p.s.id}>
                      {p.areaPath && (
                        <path d={p.areaPath} fill={p.color} opacity={p.opacity} data-area=""
                          style={{ transition: animMs ? `opacity ${animMs}ms` : undefined }} />
                      )}
                      <path d={p.path} fill="none" stroke={p.color} strokeWidth={p.w} data-line=""
                        strokeDasharray={dashArray(p.s.lineStyle, p.w)} strokeLinecap="round" strokeLinejoin="round" />
                      {p.s.showPoints
                        ? p.solid.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={p.w + 1.5} fill={p.color} data-point="" />)
                        : p.solo && <circle cx={p.solo.x} cy={p.solo.y} r={3} fill={p.color} />}
                    </g>
                  ))}
                  <Thresholds lines={thresholds} rect={rect} scale={yPx} />
                </g>
                {hoverX !== null && tip.map((d) => (Number.isFinite(d.py) ? (
                  <circle key={d.seriesId} cx={hoverX} cy={d.py} r={4} fill="var(--surface-base)" stroke={d.color} strokeWidth={2} />
                ) : null))}
                {brush && Math.abs(brush.to - brush.from) > 0 && (
                  <rect x={Math.min(brush.from, brush.to)} y={rect.y} width={Math.abs(brush.to - brush.from)} height={rect.height}
                    fill={chartTheme.crosshair} opacity={0.2} pointerEvents="none" />
                )}
              </svg>
              {hoverX !== null && tip.length > 0 && (
                <ChartTooltip label={header} data={tip} x={hoverX} y={rect.y + rect.height / 2} containerWidth={width} visible />
              )}
            </>
          );
        }}
      </ResponsiveContainer>
      {zoomable && zoomed && (
        <button
          type="button"
          onClick={() => setZoomDomain(null)}
          className="mt-1 rounded-sm text-xs text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          {resetZoomLabel}
        </button>
      )}
    </ChartFrame>
  );
}
