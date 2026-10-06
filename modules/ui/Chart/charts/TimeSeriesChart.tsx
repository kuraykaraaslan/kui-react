'use client';
// The time-axis renderer behind LineChart / AreaChart `xAxis="time"` (phase 9 §9.1 / §9.2:
// timestamps in `x`, uneven sampling, gaps, drag-to-zoom).
//
// Points are placed by TIME, so series with different sampling instants (IoT telemetry)
// share one axis with no category alignment. Zoom is a drag-to-select brush, local to this
// component's state: it never reaches the caller, so a board's time window is untouched.
// Double-click or the "Reset zoom" button leaves it.

import { useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { XAxis, YAxis } from '../primitives/Axis';
import { Grid } from '../primitives/Grid';
import { Legend } from '../primitives/Legend';
import { ChartTooltip } from '../primitives/Tooltip';
import { Crosshair } from '../primitives/Crosshair';
import { paletteColor, animationDuration, chartTheme } from '../theme';
import type { BaseChartProps, PlotRect, TooltipDatum } from '../types';
import { niceTicks, yScale, smoothPath, linePath } from './_helpers';
import {
  timeExtent, timePoints, visibleYExtent, xTime, invTime, timeTicks, formatTick, formatFull,
  brushDomain, nearestIndex, type TimeDomain,
} from './_time';

export type TimeSeriesChartProps = BaseChartProps & {
  variant: 'line' | 'area';
  smooth?: boolean;
  strokeWidth?: number;
  fillOpacity?: number;
  /** Locale for tick labels; default = the runtime's. */
  locale?: string;
};

const PADDING = { top: 12, right: 16, bottom: 28, left: 44 };

export function TimeSeriesChart({
  series, variant, height = 240, showLegend = true, showGrid = true, showTooltip = true,
  smooth = true, strokeWidth = 2, fillOpacity = 0.2, zoom = true, resetZoomLabel = 'Reset zoom', yFormat, locale, ariaLabel, className,
}: TimeSeriesChartProps) {
  const [zoomDomain, setZoomDomain] = useState<TimeDomain | null>(null);
  const [hoverT, setHoverT] = useState<number | null>(null);
  const [brush, setBrush] = useState<{ from: number; to: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const full = useMemo(() => timeExtent(series), [series]);
  const all = useMemo(() => timePoints(series), [series]);
  // A data change that shrinks the data out from under the zoom window drops the zoom.
  const domain: TimeDomain = zoomDomain && zoomDomain[1] > full[0] && zoomDomain[0] < full[1] ? zoomDomain : full;
  const { min, max } = useMemo(() => visibleYExtent(all, domain), [all, domain]);
  const animMs = animationDuration();
  const fmt = yFormat ?? ((v: number) => String(Math.round(v * 100) / 100));
  const zoomed = domain !== full;
  const span = domain[1] - domain[0];
  const clipId = `ts-clip-${useId().replace(/:/g, '')}`;

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer height={height}>
        {({ width }) => {
          const rect: PlotRect = {
            x: PADDING.left, y: PADDING.top,
            width: Math.max(0, width - PADDING.left - PADDING.right),
            height: Math.max(0, height - PADDING.top - PADDING.bottom),
          };
          const yTickValues = niceTicks(min, max, 4);
          const yPixels = yTickValues.map((v) => yScale(v, min, max, rect));
          const yTicks = yTickValues.map((v, i) => ({ position: yPixels[i], label: fmt(v) }));
          const xTicks = timeTicks(domain, Math.max(2, Math.floor(rect.width / 90)))
            .map((t) => ({ position: xTime(t, domain, rect), label: formatTick(t, span, locale) }));
          const baselineY = yScale(0, min, max, rect);

          const projected = series.map((s, si) => {
            const color = paletteColor(si, s.color);
            const pts = all[si].map((p) => (p.y === null || p.y === undefined ? null
              : { x: xTime(p.t, domain, rect), y: yScale(p.y, min, max, rect) }));
            const path = smooth ? smoothPath(pts) : linePath(pts);
            const solid = pts.filter(Boolean) as Array<{ x: number; y: number }>;
            const areaPath = variant === 'area' && solid.length > 1
              ? `${path} L${solid[solid.length - 1].x} ${baselineY} L${solid[0].x} ${baselineY} Z` : '';
            return { id: s.id, color, path, areaPath, solo: solid.length === 1 ? solid[0] : null };
          });

          // Hover: nearest sampled instant across ALL series, then each series' own nearest point.
          const allTimes = [...new Set(all.flatMap((pts) => pts.map((p) => p.t)))].sort((a, b) => a - b);
          const hoverIdx = hoverT === null ? -1 : nearestIndex(allTimes, hoverT);
          const anchor = hoverIdx >= 0 ? allTimes[hoverIdx] : null;
          const tooltipData: TooltipDatum[] = anchor === null ? [] : series.map((s, si) => {
            const pts = all[si];
            const j = nearestIndex(pts.map((p) => p.t), anchor);
            const p = j >= 0 ? pts[j] : undefined;
            const exact = p && p.t === anchor;
            return {
              seriesId: s.id, seriesName: s.name, color: paletteColor(si, s.color), x: anchor,
              y: exact ? p.y : null,
              valueLabel: exact && p.y !== null ? (p.label ?? fmt(p.y)) : undefined,
            };
          });
          const hoverX = anchor === null ? null : xTime(anchor, domain, rect);

          const localX = (e: React.MouseEvent) => {
            const b = svgRef.current?.getBoundingClientRect();
            return b ? e.clientX - b.left : 0;
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
                style={{ touchAction: 'pan-y', cursor: zoom ? 'crosshair' : undefined, userSelect: 'none' }}
                onMouseDown={(e) => {
                  if (!zoom || e.button !== 0) return;
                  const px = localX(e);
                  if (inPlot(px)) setBrush({ from: px, to: px });
                }}
                onMouseMove={(e) => {
                  const px = localX(e);
                  if (brush) setBrush({ from: brush.from, to: Math.min(rect.x + rect.width, Math.max(rect.x, px)) });
                  if (!showTooltip) return;
                  setHoverT(inPlot(px) ? invTime(px, domain, rect) : null);
                }}
                onMouseUp={() => {
                  if (!brush) return;
                  const next = brushDomain(brush.from, brush.to, domain, full, rect);
                  setBrush(null);
                  if (next) { setZoomDomain(next); setHoverT(null); }
                }}
                onMouseLeave={() => { setHoverT(null); setBrush(null); }}
                onDoubleClick={() => { if (zoom) setZoomDomain(null); }}
              >
                <defs>
                  <clipPath id={clipId}><rect x={rect.x} y={rect.y - 2} width={rect.width} height={rect.height + 4} /></clipPath>
                </defs>
                {showGrid && <Grid rect={rect} yTicks={yPixels} />}
                <YAxis ticks={yTicks} x={rect.x} yStart={rect.y} yEnd={rect.y + rect.height} />
                <XAxis ticks={xTicks} y={rect.y + rect.height} xStart={rect.x} xEnd={rect.x + rect.width} />
                <Crosshair rect={rect} x={brush ? null : hoverX} />
                <g clipPath={`url(#${clipId})`}>
                  {projected.map((p) => (
                    <g key={p.id}>
                      {p.areaPath && (
                        <path d={p.areaPath} fill={p.color} opacity={fillOpacity}
                          style={{ transition: animMs ? `opacity ${animMs}ms` : undefined }} />
                      )}
                      <path d={p.path} fill="none" stroke={p.color} strokeWidth={strokeWidth}
                        strokeLinecap="round" strokeLinejoin="round" />
                      {p.solo && <circle cx={p.solo.x} cy={p.solo.y} r={3} fill={p.color} />}
                    </g>
                  ))}
                </g>
                {anchor !== null && !brush && series.map((s, si) => {
                  const pts = all[si];
                  const p = pts.find((q) => q.t === anchor);
                  if (!p || p.y === null) return null;
                  return (
                    <circle key={s.id} cx={xTime(anchor, domain, rect)} cy={yScale(p.y, min, max, rect)} r={4}
                      fill="var(--surface-base)" stroke={paletteColor(si, s.color)} strokeWidth={2} />
                  );
                })}
                {brush && Math.abs(brush.to - brush.from) > 0 && (
                  <rect x={Math.min(brush.from, brush.to)} y={rect.y} width={Math.abs(brush.to - brush.from)} height={rect.height}
                    fill={chartTheme.crosshair} opacity={0.2} pointerEvents="none" />
                )}
              </svg>
              {showTooltip && anchor !== null && hoverX !== null && !brush && (
                <ChartTooltip label={formatFull(anchor, span, locale)} data={tooltipData} x={hoverX}
                  y={rect.y + rect.height / 2} containerWidth={width} visible />
              )}
            </>
          );
        }}
      </ResponsiveContainer>
      {zoom && zoomed && (
        <button
          type="button"
          onClick={() => setZoomDomain(null)}
          className="mt-1 rounded-sm text-xs text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {resetZoomLabel}
        </button>
      )}
      {showLegend && <Legend series={series} />}
    </div>
  );
}
