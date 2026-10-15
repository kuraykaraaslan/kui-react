'use client';
import { useId } from 'react';
import { cn } from '@/libs/utils/cn';

type ProgressVariant = 'primary' | 'success' | 'warning' | 'error';
type ProgressSize = 'sm' | 'md' | 'lg';

const barColorMap: Record<ProgressVariant, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
};

const barHeightMap: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const strokeVarMap: Record<ProgressVariant, string> = {
  primary: 'var(--primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error:   'var(--error)',
};

const circleDimMap: Record<ProgressSize, number> = { sm: 40, md: 64, lg: 96 };
const circleStrokeMap: Record<ProgressSize, number> = { sm: 4, md: 6, lg: 8 };

/** A coloured stretch of the track, in percent of the scale (e.g. a warning zone). */
export type ProgressSegment = { from: number; to: number; color: string };
/** A mark across the track at a percentage (e.g. a target or the expected pace). */
export type ProgressMark = { at: number; color?: string; label?: string };

type ProgressProps = {
  value: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  /** `semicircle` is a half ring opening downwards. */
  shape?: 'bar' | 'circle' | 'semicircle';
  showLabel?: boolean;
  label?: string;
  /** Fill colour (any CSS colour or theme token); wins over `variant`. */
  color?: string;
  /** A two-colour fill (start → end of the scale); wins over `color`. */
  gradient?: [string, string];
  /** Track colour (any CSS colour or theme token). Default the sunken surface. */
  trackColor?: string;
  /** Coloured stretches drawn on the track. */
  segments?: ProgressSegment[];
  /** Opacity of the segments, 0–1. Default 0.3. */
  segmentOpacity?: number;
  /** Marks across the track. */
  marks?: ProgressMark[];
  /** Bar height or ring stroke in px (in drawing units when `diameter` is 'fill'); wins over `size`. */
  thickness?: number;
  /** Rounded ends. Default true. */
  rounded?: boolean;
  /** Circle / semicircle: diameter in px, or 'fill' to scale to the parent (keeping the aspect). */
  diameter?: number | 'fill';
  /** Replaces the default "NN%" text shown when `showLabel` is set. */
  labelContent?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export function Progress({
  value,
  variant = 'primary',
  size = 'md',
  shape = 'bar',
  showLabel = false,
  label,
  color,
  gradient,
  trackColor,
  segments,
  segmentOpacity = 0.3,
  marks,
  thickness,
  rounded = true,
  diameter,
  labelContent,
  className,
  ...rest
}: ProgressProps) {
  const clamped = clamp(value);
  const gid = `kp${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const aria = {
    role: 'progressbar' as const,
    'aria-valuenow': clamped,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': label ?? `${Math.round(clamped)}% complete`,
  };

  if (shape === 'circle' || shape === 'semicircle') {
    const fill = diameter === 'fill';
    const dim = fill ? 100 : (diameter ?? circleDimMap[size]);
    const stroke = Math.min(dim / 3, thickness ?? (fill ? 10 : circleStrokeMap[size]));
    const radius = (dim - stroke) / 2;
    const c = dim / 2;
    const half = shape === 'semicircle';
    // Angles clockwise from 12 o'clock: a ring starts at the top, a semicircle runs 9 → 3 o'clock.
    const a0 = half ? -90 : 0;
    const sweep = half ? 180 : 360;
    const pt = (deg: number, r = radius) => ({ x: c + r * Math.sin((deg * Math.PI) / 180), y: c - r * Math.cos((deg * Math.PI) / 180) });
    const arc = (f0: number, f1: number, r = radius) => {
      const s = a0 + sweep * clamp(f0) / 100;
      const e = a0 + sweep * clamp(f1) / 100;
      if (e - s >= 359.99) {
        const p = pt(s, r);
        const q = pt(s + 180, r);
        return `M${p.x} ${p.y} A${r} ${r} 0 1 1 ${q.x} ${q.y} A${r} ${r} 0 1 1 ${p.x} ${p.y}`;
      }
      const p = pt(s, r);
      const q = pt(e, r);
      return `M${p.x.toFixed(3)} ${p.y.toFixed(3)} A${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${q.x.toFixed(3)} ${q.y.toFixed(3)}`;
    };
    const height = half ? c + (rounded ? stroke / 2 : 0) : dim;
    const fillColor = gradient ? `url(#${gid})` : color ?? strokeVarMap[variant];
    const cap = rounded ? 'round' : 'butt';
    return (
      <div
        {...aria}
        className={cn('relative inline-flex items-center justify-center', fill && 'h-full w-full', className)}
        style={fill ? undefined : { width: dim, height }}
        data-shape={shape}
        {...rest}
      >
        <svg
          viewBox={`0 0 ${dim} ${height}`}
          width={fill ? '100%' : dim}
          height={fill ? '100%' : height}
          className="overflow-visible"
          aria-hidden="true"
        >
          {gradient && (
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={gradient[0]} />
                <stop offset="100%" stopColor={gradient[1]} />
              </linearGradient>
            </defs>
          )}
          <path d={arc(0, 100)} fill="none" strokeWidth={stroke} strokeLinecap={cap}
            style={{ stroke: trackColor ?? 'var(--surface-sunken)' }} data-part="track" />
          {segments?.map((s, i) => (
            <path key={i} d={arc(s.from, s.to)} fill="none" strokeWidth={stroke} style={{ stroke: s.color }}
              strokeOpacity={segmentOpacity} data-part="segment" />
          ))}
          {clamped > 0 && (
            <path d={arc(0, 100)} pathLength={100} fill="none" strokeWidth={stroke} strokeLinecap={cap}
              strokeDasharray={`${clamped} 100`} className="transition-[stroke-dasharray] duration-300 ease-out"
              style={{ stroke: fillColor }} data-part="fill" />
          )}
          {marks?.map((m, i) => {
            const deg = a0 + sweep * clamp(m.at) / 100;
            const p = pt(deg, radius + stroke / 2 + 2);
            const q = pt(deg, radius - stroke / 2 - 2);
            return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} strokeWidth={Math.max(1.5, dim / 60)} strokeLinecap="round"
              style={{ stroke: m.color ?? 'var(--text-primary)' }} data-part="mark"><title>{m.label}</title></line>;
          })}
        </svg>
        {showLabel && (
          <span className={cn('absolute inset-x-0 flex justify-center text-xs font-semibold tabular-nums text-text-primary', half ? 'bottom-0' : 'top-1/2 -translate-y-1/2')}>
            {labelContent ?? `${Math.round(clamped)}%`}
          </span>
        )}
      </div>
    );
  }

  const fillStyle: React.CSSProperties = gradient
    // The gradient spans the whole track, so a half-full bar shows the first half of it.
    ? { width: `${clamped}%`, backgroundImage: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`, backgroundSize: clamped > 0 ? `${(100 / clamped) * 100}% 100%` : undefined }
    : { width: `${clamped}%`, ...(color ? { background: color } : {}) };
  return (
    <div className={cn('w-full', className)} {...rest}>
      <div className="relative">
        <div
          {...aria}
          className={cn('relative w-full overflow-hidden bg-surface-sunken', rounded ? 'rounded-full' : 'rounded-none', thickness === undefined && barHeightMap[size])}
          style={{ ...(thickness !== undefined ? { height: thickness } : {}), ...(trackColor ? { background: trackColor } : {}) }}
        >
          {segments?.map((s, i) => (
            <span key={i} aria-hidden="true" className="absolute inset-y-0" data-part="segment"
              style={{ left: `${clamp(s.from)}%`, width: `${Math.max(0, clamp(s.to) - clamp(s.from))}%`, background: s.color, opacity: segmentOpacity }} />
          ))}
          <div
            className={cn('relative h-full transition-[width] duration-300 ease-out', rounded ? 'rounded-full' : 'rounded-none', !color && !gradient && barColorMap[variant])}
            style={fillStyle}
          />
        </div>
        {marks?.map((m, i) => (
          <span key={i} aria-hidden="true" title={m.label} data-part="mark"
            className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full"
            style={{ left: `${clamp(m.at)}%`, background: m.color ?? 'var(--text-primary)' }} />
        ))}
      </div>
      {showLabel && <p className="mt-1 text-xs tabular-nums text-text-secondary">{labelContent ?? `${Math.round(clamped)}%`}</p>}
    </div>
  );
}
