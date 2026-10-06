'use client';
// Half-donut gauge with threshold bands, centred value and optional needle
// (docs/dev/phase-9-data-and-realtime-components.md §9.3). `role="meter"`.

import { useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import { animationDuration } from '../theme';

export type GaugeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type GaugeBand = { to: number; tone: GaugeTone };

export type GaugeChartProps = {
  value: number | null | undefined;
  min?: number;
  max?: number;
  /** Threshold bands, ascending by `to`. A value belongs to the first band whose `to` it does not exceed. */
  bands?: GaugeBand[];
  unit?: string;
  label?: string;
  format?: (v: number) => string;
  needle?: boolean;
  size?: 'sm' | 'md' | 'lg';
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

const SIZE_PX: Record<NonNullable<GaugeChartProps['size']>, number> = { sm: 140, md: 200, lg: 280 };

const CX = 100;
const CY = 100;
const R = 80;
const STROKE = 16;

/** Point on the half circle for a 0..1 fraction (0 = left end, 1 = right end). */
function point(fraction: number, radius = R): { x: number; y: number } {
  const angle = Math.PI * (1 - fraction);
  return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) };
}

/** SVG arc path between two fractions of the half circle. */
export function arcPath(from: number, to: number): string {
  const a = point(Math.max(0, Math.min(1, from)));
  const b = point(Math.max(0, Math.min(1, to)));
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)} A${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

/** Which band a value falls in (the first whose `to` it does not exceed; else the last). */
export function bandFor(value: number, bands: GaugeBand[] | undefined): GaugeBand | null {
  if (!bands || bands.length === 0) return null;
  return bands.find((b) => value <= b.to) ?? bands[bands.length - 1];
}

export function GaugeChart({
  value, min = 0, max = 100, bands, unit, label, format, needle = false, size = 'md', ariaLabel, stale = false, staleLabel = 'stale', className,
}: GaugeChartProps) {
  const span = max - min || 1;
  const hasValue = typeof value === 'number' && Number.isFinite(value);
  const clamped = hasValue ? Math.min(max, Math.max(min, value)) : min;
  const fraction = (clamped - min) / span;
  const band = hasValue ? bandFor(value, bands) : null;
  const tone = band?.tone ?? 'info';
  const color = band ? TONE_COLOR[tone] : 'var(--primary)';
  const animMs = animationDuration(400);
  const text = hasValue ? (format ? format(value) : String(Math.round(value * 100) / 100)) : '—';
  const bandName = band ? tone : undefined;

  const segments = useMemo(() => {
    if (!bands || bands.length === 0) return [];
    let from = 0;
    return bands.map((b) => {
      const to = Math.min(1, Math.max(0, (b.to - min) / span));
      const seg = { from, to, tone: b.tone };
      from = Math.max(from, to);
      return seg;
    });
  }, [bands, min, span]);

  const n = point(fraction, R - STROKE / 2 - 4);
  return (
    <div className={cn('inline-flex flex-col items-center', stale && 'opacity-60', className)} style={{ width: SIZE_PX[size], maxWidth: '100%' }}>
      <svg
        viewBox="0 0 200 118"
        width="100%"
        role="meter"
        aria-label={ariaLabel ?? label ?? 'Gauge'}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={hasValue ? clamped : undefined}
        aria-valuetext={hasValue ? `${text}${unit ? ` ${unit}` : ''}${bandName ? `, ${bandName}` : ''}${stale ? `, ${staleLabel}` : ''}` : 'no value'}
      >
        <path d={arcPath(0, 1)} fill="none" stroke="var(--border)" strokeWidth={STROKE} strokeLinecap="butt" />
        {segments.map((s, i) => (
          <path key={i} d={arcPath(s.from, s.to)} fill="none" stroke={TONE_COLOR[s.tone]} strokeOpacity={0.28} strokeWidth={STROKE} />
        ))}
        {hasValue && fraction > 0 && (
          <path
            d={arcPath(0, fraction)}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            style={{ transition: animMs ? `stroke ${animMs}ms` : undefined }}
          />
        )}
        {needle && hasValue && (
          <line x1={CX} y1={CY} x2={n.x} y2={n.y} stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round" />
        )}
        {needle && hasValue && <circle cx={CX} cy={CY} r={5} fill="var(--text-primary)" />}
        <text x={CX} y={needle ? 84 : 92} textAnchor="middle" fontSize={26} fontWeight={600} fill="var(--text-primary)">
          {text}
          {unit && hasValue ? <tspan fontSize={13} fill="var(--text-secondary)" dx={3}>{unit}</tspan> : null}
        </text>
        <text x={CX - R} y={CY + 14} textAnchor="middle" fontSize={10} fill="var(--text-secondary)">{min}</text>
        <text x={CX + R} y={CY + 14} textAnchor="middle" fontSize={10} fill="var(--text-secondary)">{max}</text>
      </svg>
      {label && <div className="-mt-1 text-xs text-text-secondary">{label}</div>}
      {stale && <div className="text-[10px] uppercase tracking-wide text-text-secondary">{staleLabel}</div>}
    </div>
  );
}
