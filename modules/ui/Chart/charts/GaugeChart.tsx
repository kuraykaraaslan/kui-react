'use client';
// Gauge with threshold bands, centred value and optional needle
// (docs/phases/09-data-and-realtime-components.md §9.3). `role="meter"`.
//
// Layouts: `arc` (half circle, the original look), `donut` (an arc between two free angles),
// `bar-horizontal` and `bar-vertical`. Every colour is a CSS colour or a theme token supplied by
// the caller; the defaults are theme tokens.

import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/libs/utils/cn';
import { animationDuration } from '../theme';

export type GaugeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type GaugeLayout = 'arc' | 'donut' | 'bar-horizontal' | 'bar-vertical';

/**
 * A band of the scale. `to` is its upper end; `from` defaults to the previous band's `to` (or the
 * minimum). `color` (any CSS colour or token) wins over `tone`. `label` names the band in the
 * meter's accessible text.
 */
export type GaugeBand = { from?: number; to: number; tone?: GaugeTone; color?: string; label?: string };

export type GaugeChartProps = {
  value: number | null | undefined;
  min?: number;
  max?: number;
  /** Threshold bands, ascending by `to`. */
  bands?: GaugeBand[];
  /**
   * Which band a value exactly on a boundary belongs to. 'to' (default, the original rule):
   * `from < v <= to`; 'from': `from <= v < to`.
   */
  bandEdges?: 'from' | 'to';
  /**
   * Where bands show. 'both' (default): faint segments on the track and the bar takes the band's
   * colour. 'bar': only the bar takes the band's colour. 'track': segments on the track, the bar
   * keeps `color`.
   */
  bandDisplay?: 'both' | 'bar' | 'track';
  unit?: string;
  label?: string;
  format?: (v: number) => string;
  /** Formats the min / max and tick labels. Default: the raw number. */
  formatScale?: (v: number) => string;
  needle?: boolean;
  needleColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'fill';
  layout?: GaugeLayout;
  /** Bar colour when no band colours it. Default `var(--primary)`. */
  color?: string;
  /** Track (unfilled part) colour. Default `var(--border)`. */
  trackColor?: string;
  /** Stroke thickness in drawing units (the arc is 200 wide). Default 16. */
  thickness?: number;
  roundedCaps?: boolean;
  /** Evenly spaced tick marks, ends included; 0 or 1 = none. */
  ticks?: number;
  showMinMax?: boolean;
  showValue?: boolean;
  /** Donut only: start / end angle in degrees, clockwise from 12 o'clock. Default -135 / 135. */
  startAngle?: number;
  endAngle?: number;
  /** Animate value changes (still off under reduced motion). Default true. */
  animate?: boolean;
  /** Extra style for the value text (font size, weight, …). */
  valueStyle?: CSSProperties;
  valueColor?: string;
  /** Extra style for the min / max labels. */
  scaleStyle?: CSSProperties;
  scaleColor?: string;
  ariaLabel?: string;
  /** Dim the arc and show a hint: the value is older than the consumer allows. */
  stale?: boolean;
  staleLabel?: string;
  className?: string;
};

const TONE_COLOR: Record<GaugeTone, string> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  info: 'var(--info)',
  neutral: 'var(--text-disabled, var(--border-strong))',
};

const SIZE_PX: Record<Exclude<NonNullable<GaugeChartProps['size']>, 'fill'>, number> = { sm: 140, md: 200, lg: 280 };

const CX = 100;
const CY = 100;
const R = 80;
const STROKE = 16;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Point at `deg` (clockwise from 12 o'clock) on a circle around the gauge centre. */
function polar(deg: number, radius = R): { x: number; y: number } {
  return { x: CX + radius * Math.sin(rad(deg)), y: CY - radius * Math.cos(rad(deg)) };
}

/** SVG arc between two angles (clockwise). A full turn is drawn as two halves. */
function anglePath(a0: number, a1: number, radius = R): string {
  const sweep = Math.min(360, Math.max(0, a1 - a0));
  if (sweep >= 359.99) return `${anglePath(a0, a0 + 180, radius)} ${anglePath(a0 + 180, a0 + 360, radius).replace(/^M[^A]+/, '')}`;
  const a = polar(a0, radius);
  const b = polar(a0 + sweep, radius);
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)} A${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

/** SVG arc path between two fractions of the half circle. */
export function arcPath(from: number, to: number): string {
  const f = Math.max(0, Math.min(1, from));
  const t = Math.max(0, Math.min(1, to));
  return anglePath(-90 + 180 * f, -90 + 180 * t);
}

const bandColor = (b: GaugeBand) => b.color ?? TONE_COLOR[b.tone ?? 'neutral'];

/**
 * Which band a value falls in. Without any `from`, the original rule: the first band whose `to`
 * it does not exceed, else the last. With `from`, `edges` decides the boundaries and a value in
 * no band has none.
 */
export function bandFor(value: number, bands: GaugeBand[] | undefined, edges: 'from' | 'to' = 'to'): GaugeBand | null {
  if (!bands || bands.length === 0) return null;
  const legacy = bands.every((b) => b.from === undefined);
  if (legacy && edges === 'to') return bands.find((b) => value <= b.to) ?? bands[bands.length - 1];
  let prev: number | undefined;
  for (const b of bands) {
    const from = b.from ?? prev;
    prev = b.to;
    const aboveFrom = from === undefined || (edges === 'from' ? value >= from : value > from);
    const belowTo = edges === 'from' ? value < b.to : value <= b.to;
    if (aboveFrom && belowTo) return b;
  }
  return legacy ? bands[bands.length - 1] : null;
}

export function GaugeChart({
  value, min = 0, max = 100, bands, bandEdges = 'to', bandDisplay = 'both', unit, label, format, formatScale,
  needle = false, needleColor, size = 'md', layout = 'arc', color, trackColor, thickness = STROKE, roundedCaps = false,
  ticks = 0, showMinMax = true, showValue = true, startAngle = -135, endAngle = 135, animate = true,
  valueStyle, valueColor, scaleStyle, scaleColor, ariaLabel, stale = false, staleLabel = 'stale', className,
}: GaugeChartProps) {
  const span = max - min || 1;
  const hasValue = typeof value === 'number' && Number.isFinite(value);
  const clamped = hasValue ? Math.min(max, Math.max(min, value)) : min;
  const fraction = (clamped - min) / span;
  const band = hasValue ? bandFor(value, bands, bandEdges) : null;
  const baseColor = color ?? 'var(--primary)';
  const barColor = band && bandDisplay !== 'track' ? bandColor(band) : baseColor;
  const animMs = animate ? animationDuration(400) : 0;
  const text = hasValue ? (format ? format(value) : String(Math.round(value * 100) / 100)) : '—';
  const bandName = band ? band.label || band.tone : undefined;
  const scaleText = (v: number) => (formatScale ? formatScale(v) : String(v));
  const t = Math.min(48, Math.max(1, thickness));
  const cap = roundedCaps ? 'round' : 'butt';
  const track = trackColor ?? 'var(--border)';

  const segments = useMemo(() => {
    if (!bands || bands.length === 0 || bandDisplay === 'bar') return [];
    let prev = 0;
    return bands.map((b) => {
      const from = b.from !== undefined ? Math.min(1, Math.max(0, (b.from - min) / span)) : prev;
      const to = Math.min(1, Math.max(0, (b.to - min) / span));
      prev = Math.max(prev, to);
      return { from, to, color: bandColor(b) };
    });
  }, [bands, bandDisplay, min, span]);
  const segOpacity = bandDisplay === 'track' ? 0.5 : 0.28;

  const tickFractions = ticks >= 2 ? Array.from({ length: ticks }, (_, i) => i / (ticks - 1)) : [];
  const valueTextStyle: CSSProperties = { color: valueColor ?? 'var(--text-primary)', ...valueStyle };
  const scaleTextStyle: CSSProperties = { color: scaleColor ?? 'var(--text-secondary)', ...scaleStyle };
  const barTransition = animMs ? `stroke ${animMs}ms, stroke-dasharray ${animMs}ms ease-out` : undefined;
  const needleFill = needleColor ?? 'var(--text-primary)';

  const valueText = (x: number, y: number, anchor: 'middle' | 'start' = 'middle') => showValue ? (
    <text x={x} y={y} textAnchor={anchor} fontSize={26} fontWeight={600} fill="currentColor" style={valueTextStyle} data-part="value">
      {text}
      {unit && hasValue ? <tspan fontSize={13} fill="var(--text-secondary)" dx={3}>{unit}</tspan> : null}
    </text>
  ) : null;

  // A whole-scale path drawn up to `fraction` with a normalised dash, so the fill can animate.
  const valueBar = (d: string) => hasValue && fraction > 0 ? (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={barColor}
      strokeWidth={t}
      strokeLinecap={cap}
      strokeDasharray={`${fraction} 1`}
      style={{ transition: barTransition }}
      data-part="bar"
    />
  ) : null;

  let viewBox: string;
  let body: React.ReactNode;

  if (layout === 'bar-horizontal' || layout === 'bar-vertical') {
    const horizontal = layout === 'bar-horizontal';
    const inset = 10 + (roundedCaps ? t / 2 : 0);
    // Horizontal: the bar runs left to right under the value. Vertical: bottom to top, value right.
    const len = horizontal ? 200 - inset * 2 : 180 - inset * 2;
    const by = horizontal ? (showValue ? 44 : 10) + t / 2 : 0;
    const bx = horizontal ? 0 : 24 + t / 2;
    const at = (f: number) => horizontal ? { x: inset + len * f, y: by } : { x: bx, y: 190 - inset - len * f };
    const a = at(0);
    const b = at(1);
    const whole = `M${a.x.toFixed(2)} ${a.y.toFixed(2)} L${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    const seg = (f0: number, f1: number) => {
      const p = at(f0);
      const q = at(f1);
      return `M${p.x.toFixed(2)} ${p.y.toFixed(2)} L${q.x.toFixed(2)} ${q.y.toFixed(2)}`;
    };
    const height = horizontal ? by + t / 2 + (showMinMax || tickFractions.length ? 20 : 4) : 200;
    viewBox = horizontal ? `0 0 200 ${height.toFixed(0)}` : '0 0 120 200';
    const n = at(fraction);
    body = (
      <>
        <path d={whole} fill="none" stroke={track} strokeWidth={t} strokeLinecap={cap} data-part="track" />
        {segments.map((s, i) => (
          <path key={i} d={seg(s.from, s.to)} fill="none" stroke={s.color} strokeOpacity={segOpacity} strokeWidth={t} data-part="band" />
        ))}
        {valueBar(whole)}
        {tickFractions.map((f) => {
          const p = at(f);
          return horizontal
            ? <line key={f} x1={p.x} y1={by + t / 2 + 1} x2={p.x} y2={by + t / 2 + 5} stroke="var(--border-strong)" strokeWidth={1} data-part="tick" />
            : <line key={f} x1={bx - t / 2 - 5} y1={p.y} x2={bx - t / 2 - 1} y2={p.y} stroke="var(--border-strong)" strokeWidth={1} data-part="tick" />;
        })}
        {needle && hasValue && (horizontal
          ? <line x1={n.x} y1={by - t / 2 - 4} x2={n.x} y2={by + t / 2 + 4} stroke={needleFill} strokeWidth={2.5} strokeLinecap="round" data-part="needle" />
          : <line x1={bx - t / 2 - 4} y1={n.y} x2={bx + t / 2 + 4} y2={n.y} stroke={needleFill} strokeWidth={2.5} strokeLinecap="round" data-part="needle" />)}
        {horizontal ? valueText(100, 30) : valueText(bx + t / 2 + 10, 108, 'start')}
        {showMinMax && (horizontal ? (
          <>
            <text x={a.x} y={by + t / 2 + 16} textAnchor="start" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="min">{scaleText(min)}</text>
            <text x={b.x} y={by + t / 2 + 16} textAnchor="end" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="max">{scaleText(max)}</text>
          </>
        ) : (
          <>
            <text x={bx + t / 2 + 6} y={a.y} textAnchor="start" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="min">{scaleText(min)}</text>
            <text x={bx + t / 2 + 6} y={b.y + 8} textAnchor="start" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="max">{scaleText(max)}</text>
          </>
        ))}
      </>
    );
  } else {
    const donut = layout === 'donut';
    const a0 = donut ? startAngle : -90;
    const a1 = donut ? Math.max(startAngle + 1, Math.min(startAngle + 360, endAngle)) : 90;
    const angleAt = (f: number) => a0 + (a1 - a0) * f;
    const whole = anglePath(a0, a1);
    viewBox = donut ? '0 0 200 200' : '0 0 200 118';
    const n = polar(angleAt(fraction), R - t / 2 - 4);
    const start = polar(a0);
    const end = polar(a1);
    const full = a1 - a0 >= 300;
    body = (
      <>
        <path d={whole} fill="none" stroke={track} strokeWidth={t} strokeLinecap={cap} data-part="track" />
        {segments.map((s, i) => (
          <path key={i} d={anglePath(angleAt(s.from), angleAt(s.to))} fill="none" stroke={s.color} strokeOpacity={segOpacity} strokeWidth={t} data-part="band" />
        ))}
        {valueBar(whole)}
        {tickFractions.map((f) => {
          const p = polar(angleAt(f), R - t / 2 - 2);
          const q = polar(angleAt(f), R - t / 2 - 7);
          return <line key={f} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="var(--border-strong)" strokeWidth={1} data-part="tick" />;
        })}
        {needle && hasValue && (
          <line x1={CX} y1={CY} x2={n.x} y2={n.y} stroke={needleFill} strokeWidth={2.5} strokeLinecap="round" data-part="needle" />
        )}
        {needle && hasValue && <circle cx={CX} cy={CY} r={5} fill={needleFill} />}
        {valueText(CX, donut ? (needle ? 140 : 109) : (needle ? 84 : 92))}
        {showMinMax && !full && (donut ? (
          <>
            <text x={start.x} y={start.y + 16} textAnchor="middle" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="min">{scaleText(min)}</text>
            <text x={end.x} y={end.y + 16} textAnchor="middle" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="max">{scaleText(max)}</text>
          </>
        ) : (
          <>
            <text x={CX - R} y={CY + 14} textAnchor="middle" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="min">{scaleText(min)}</text>
            <text x={CX + R} y={CY + 14} textAnchor="middle" fontSize={10} fill="currentColor" style={scaleTextStyle} data-part="max">{scaleText(max)}</text>
          </>
        ))}
      </>
    );
  }

  const fill = size === 'fill';
  const width = fill ? '100%' : layout === 'bar-vertical' ? SIZE_PX[size] * 0.6 : SIZE_PX[size];
  return (
    <div
      className={cn('inline-flex flex-col items-center', fill && 'h-full w-full min-h-0 justify-center', stale && 'opacity-60', className)}
      style={{ width, maxWidth: '100%' }}
      data-layout={layout}
    >
      <svg
        viewBox={viewBox}
        width="100%"
        height={fill ? '100%' : undefined}
        className={fill ? 'min-h-0 flex-1' : undefined}
        role="meter"
        aria-label={ariaLabel ?? label ?? 'Gauge'}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={hasValue ? clamped : undefined}
        aria-valuetext={hasValue ? `${text}${unit ? ` ${unit}` : ''}${bandName ? `, ${bandName}` : ''}${stale ? `, ${staleLabel}` : ''}` : 'no value'}
      >
        {body}
      </svg>
      {label && <div className="-mt-1 text-xs text-text-secondary">{label}</div>}
      {stale && <div className="text-[10px] uppercase tracking-wide text-text-secondary">{staleLabel}</div>}
    </div>
  );
}
