'use client';
import type { CSSProperties } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, rangeFor, type RangeEdges } from '../settings/style';
import type { SlotData, WidgetKindView, WidgetViewProps } from '../kind';

type S = {
  layout?: 'value-top' | 'value-left' | 'chart-only';
  autoScale?: boolean;
  valueFont?: FontValue;
  valueColor?: string;
  curve?: 'smooth' | 'linear' | 'step';
  lineColor?: string;
  lineWidth?: number;
  fillOpacity?: number;
  ranges?: unknown;
  rangeEdges?: RangeEdges;
  rangeTarget?: 'value' | 'both';
  showChange?: 'off' | 'percent' | 'delta';
  increaseIs?: 'good' | 'bad' | 'neutral';
  upColor?: string;
  downColor?: string;
};

/** The first series' finite values in time order; non-finite points are dropped, not zeroed. */
export function sparkValues(slot: SlotData | undefined, max = 500): number[] {
  const first = slot?.series?.[0];
  if (!first) return [];
  const pts = first.points.filter((p) => Number.isFinite(p.v)).map((p) => ({ t: Date.parse(p.t), v: p.v }));
  // Sort only when every timestamp parses; otherwise the source's own order stands.
  if (pts.every((p) => Number.isFinite(p.t))) pts.sort((a, b) => a.t - b.t);
  const values = pts.map((p) => p.v);
  return values.length > max ? values.slice(values.length - max) : values;
}

type Pt = { x: number; y: number };

/** The line's path in a 100 × 40 box. */
export function sparkPath(points: Pt[], curve: S['curve']): string {
  if (points.length === 0) return '';
  const f = (n: number) => n.toFixed(2);
  let d = `M${f(points[0].x)} ${f(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1];
    const q = points[i];
    if (curve === 'step') d += ` H${f(q.x)} V${f(q.y)}`;
    else if (curve === 'linear') d += ` L${f(q.x)} ${f(q.y)}`;
    else {
      const mx = (p.x + q.x) / 2;
      d += ` C${f(mx)} ${f(p.y)} ${f(mx)} ${f(q.y)} ${f(q.x)} ${f(q.y)}`;
    }
  }
  return d;
}

const W = 100;
const H = 40;

/** `stat.sparkline`: the latest value, an optional change badge and the trend line. */
export function StatSparklineView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings as S;
  const values = sparkValues(data.series);
  const last = values.length ? values[values.length - 1] : null;
  const first = values.length > 1 ? values[0] : null;
  const layout = s.layout ?? 'value-top';
  const range = rangeFor(last, s.ranges, s.rangeEdges ?? 'from');
  const rangeColor = cssColor(range?.color);
  const lineColor = (s.rangeTarget === 'both' ? rangeColor : undefined) ?? cssColor(s.lineColor) ?? 'var(--primary)';
  const fillOpacity = Math.min(100, Math.max(0, s.fillOpacity ?? 15)) / 100;

  // Change from the first to the last point.
  let change: { text: string; color?: string } | null = null;
  const mode = s.showChange ?? 'percent';
  if (mode !== 'off' && last !== null && first !== null && !(mode === 'percent' && first === 0)) {
    const diff = last - first;
    const pct = (diff / Math.abs(first)) * 100;
    const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '';
    const amount = mode === 'percent'
      ? `${formatValue(Math.abs(pct), { decimals: 1 }, {}, locale)} %`
      : formatValue(Math.abs(diff), format, {}, locale);
    const inc = s.increaseIs ?? 'neutral';
    const good = inc === 'neutral' || diff === 0 ? null : diff > 0 ? inc === 'good' : inc === 'bad';
    change = { text: `${arrow} ${amount}`.trim(), color: good === null ? undefined : cssColor(good ? s.upColor : s.downColor) };
  }

  // Points in the drawing box (y grows downwards; a flat line sits in the middle).
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = Math.max(s.lineWidth ?? 1.5, 1);
  const pts: Pt[] = values.map((v, i) => ({
    x: values.length === 1 ? W / 2 : (i / (values.length - 1)) * W,
    y: hi === lo ? H / 2 : pad + (1 - (v - lo) / (hi - lo)) * (H - pad * 2),
  }));
  const line = sparkPath(pts, s.curve ?? 'smooth');
  const area = fillOpacity > 0 && pts.length > 1 ? `${line} L${W} ${H} L0 ${H} Z` : '';

  const autoScale = s.autoScale !== false;
  const valueStyle: CSSProperties = {
    ...(autoScale ? { fontSize: layout === 'value-left' ? 'clamp(1.25rem, 12cqi, 3rem)' : 'clamp(1.25rem, 12cqi, 2.75rem)' } : {}),
    ...fontStyle(autoScale ? undefined : s.valueFont, s.valueColor),
    ...(rangeColor ? { color: rangeColor } : {}),
  };

  const number = layout === 'chart-only' ? null : (
    <div className={cn('flex gap-2', layout === 'value-left' ? 'flex-col items-start' : 'items-baseline')}>
      <span className="text-2xl font-semibold leading-none tabular-nums text-text-primary" style={valueStyle} data-part="value">
        {formatValue(last, format, {}, locale)}
      </span>
      {change && (
        <span className="text-xs tabular-nums text-text-secondary" style={change.color ? { color: change.color } : undefined} data-part="change">
          {change.text}
        </span>
      )}
    </div>
  );

  const chart = (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="block h-full min-h-[24px] w-full overflow-visible"
      role="img"
      aria-label={`Trend, ${values.length} points`}
    >
      {area && <path d={area} fill={lineColor} fillOpacity={fillOpacity} stroke="none" data-part="area" />}
      <path
        d={line}
        fill="none"
        stroke={lineColor}
        strokeWidth={s.lineWidth ?? 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        data-part="line"
      />
    </svg>
  );

  return (
    <div className={cn('flex h-full min-h-0 gap-2', layout === 'value-left' ? 'flex-row items-center' : 'flex-col')}>
      {number && <div className={cn(layout === 'value-left' && 'shrink-0')}>{number}</div>}
      <div className="min-h-0 min-w-0 flex-1">{chart}</div>
    </div>
  );
}

export const STAT_SPARKLINE_VIEW: WidgetKindView = {
  View: StatSparklineView,
  isEmpty: (data) => sparkValues(data.series).length === 0,
};
