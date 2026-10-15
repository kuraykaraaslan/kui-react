// modules/ui/Chart/charts/_helpers.ts
//
// Shared scale / tick math used by the M1 chart implementations.
// Kept dependency-free so it can be mirrored 1:1 in EJS's
// /modules/ui/Chart/scripts/chart-helpers.js.

import type { Series, PlotRect, CurveType, LineStyle, LegendValue, ThresholdLine } from '../types';

/** Generate `count + 1` evenly spaced numeric tick values between `lo` and `hi`. */
export function niceTicks(lo: number, hi: number, count = 4): number[] {
  if (lo === hi) {
    if (lo === 0) return [0, 0.25, 0.5, 0.75, 1];
    const pad = Math.abs(lo) * 0.5 || 1;
    lo -= pad;
    hi += pad;
  }
  const step = (hi - lo) / count;
  return Array.from({ length: count + 1 }, (_, i) => lo + step * i);
}

/** Map a numeric domain value into a pixel coordinate inside `rect.height`. */
export function yScale(value: number, min: number, max: number, rect: PlotRect): number {
  if (max === min) return rect.y + rect.height / 2;
  const t = (value - min) / (max - min);
  return rect.y + rect.height - t * rect.height;
}

/** Band scale — returns the center pixel for category index `i` of `n`. */
export function bandCenter(i: number, n: number, rect: PlotRect): number {
  if (n <= 0) return rect.x;
  const step = rect.width / n;
  return rect.x + step * (i + 0.5);
}

/** Band width with padding (0–1, default 0.2 = 20% spacing). */
export function bandWidth(n: number, rect: PlotRect, padding = 0.2): number {
  if (n <= 0) return 0;
  const step = rect.width / n;
  return step * (1 - padding);
}

/** Compute global min/max y across all series (ignores null points). */
export function yExtent(series: Series[]): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const s of series) {
    for (const p of s.data) {
      if (p.y === null || p.y === undefined) continue;
      if (p.y < min) min = p.y;
      if (p.y > max) max = p.y;
    }
  }
  if (!isFinite(min)) min = 0;
  if (!isFinite(max)) max = 1;
  // Always include zero so bar charts have a stable baseline.
  if (min > 0) min = 0;
  if (max < 0) max = 0;
  return { min, max };
}

/** Resolve the unified categorical x-axis labels from the first series. */
export function xCategories(series: Series[]): string[] {
  if (!series.length) return [];
  return series[0].data.map((p) => String(p.x));
}

/** Build a smooth Catmull-Rom-ish path string for line charts. */
export function smoothPath(points: Array<{ x: number; y: number } | null>): string {
  let d = '';
  let prev: { x: number; y: number } | null = null;
  for (const p of points) {
    if (!p) {
      prev = null;
      continue;
    }
    if (!prev) {
      d += `M${p.x} ${p.y} `;
    } else {
      const cx = (prev.x + p.x) / 2;
      d += `C${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y} `;
    }
    prev = p;
  }
  return d.trim();
}

/** Straight line path (used when smoothing is disabled). */
export function linePath(points: Array<{ x: number; y: number } | null>): string {
  let d = '';
  let prev = false;
  for (const p of points) {
    if (!p) {
      prev = false;
      continue;
    }
    d += `${prev ? 'L' : 'M'}${p.x} ${p.y} `;
    prev = true;
  }
  return d.trim();
}

/**
 * Stacked extent: the largest per-category sum of the non-negative values.
 * Used by `stacked` on BarChart / AreaChart (M2).
 */
export function stackedExtent(series: Series[]): { min: number; max: number } {
  const n = series.reduce((m, s) => Math.max(m, s.data.length), 0);
  let max = 0;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (const s of series) {
      const y = s.data[i]?.y;
      if (typeof y === 'number' && y > 0) sum += y;
    }
    if (sum > max) max = sum;
  }
  return { min: 0, max: max || 1 };
}

/** Per-series cumulative tops for stacking: `tops[si][i]` is where series `si` ends at category `i`. */
export function stackTops(series: Series[]): Array<Array<number | null>> {
  const n = series.reduce((m, s) => Math.max(m, s.data.length), 0);
  const running = new Array<number>(n).fill(0);
  return series.map((s) => Array.from({ length: n }, (_, i) => {
    const y = s.data[i]?.y;
    if (typeof y !== 'number') return null;
    running[i] += Math.max(0, y);
    return running[i];
  }));
}

type Pt = { x: number; y: number };

/**
 * Step path (value held until the next point). `after` draws horizontal-then-vertical, `before`
 * vertical-then-horizontal: tracing the same points in reverse with `before` retraces an `after` path,
 * which is what a stacked area's lower edge needs.
 */
export function stepPath(points: Array<Pt | null>, mode: 'after' | 'before' = 'after'): string {
  let d = '';
  let prev: Pt | null = null;
  for (const p of points) {
    if (!p) { prev = null; continue; }
    if (!prev) d += `M${p.x} ${p.y} `;
    else d += mode === 'after' ? `H${p.x} V${p.y} ` : `V${p.y} H${p.x} `;
    prev = p;
  }
  return d.trim();
}

/** The path for a curve type. */
export function curvePath(points: Array<Pt | null>, curve: CurveType = 'smooth', stepMode: 'after' | 'before' = 'after'): string {
  if (curve === 'step') return stepPath(points, stepMode);
  return curve === 'linear' ? linePath(points) : smoothPath(points);
}

/** `curvePath` without the leading move: continues an open path (a stacked area's lower edge). */
export function continuePath(points: Pt[], curve: CurveType, stepMode: 'after' | 'before'): string {
  if (!points.length) return '';
  return `L${points[0].x} ${points[0].y} ${curvePath(points, curve, stepMode).replace(/^M[^A-Z]*/, '')}`.trim();
}

/** SVG dash pattern for a stroke style at a width. Dotted relies on a round line cap. */
export function dashArray(style: LineStyle | undefined, width = 2): string | undefined {
  if (style === 'dashed') return `${Math.max(4, width * 3)} ${Math.max(3, width * 2)}`;
  if (style === 'dotted') return `0 ${Math.max(3, width * 2)}`;
  return undefined;
}

/** The latest / min / max / avg / total of a series' non-null values; null when it has none. */
export function seriesStats(series: Series): Record<LegendValue, number> | null {
  const ys = series.data.map((p) => p.y).filter((y): y is number => typeof y === 'number' && Number.isFinite(y));
  if (!ys.length) return null;
  const total = ys.reduce((a, b) => a + b, 0);
  return { latest: ys[ys.length - 1], min: Math.min(...ys), max: Math.max(...ys), avg: total / ys.length, total };
}

/** The value domain after fixed bounds and thresholds: `yMin`/`yMax` win; thresholds widen an automatic end. */
export function resolveDomain(
  base: { min: number; max: number },
  opts: { min?: number; max?: number; thresholds?: ThresholdLine[] } = {},
): { min: number; max: number } {
  let { min, max } = base;
  for (const t of opts.thresholds ?? []) {
    if (typeof t?.value !== 'number' || !Number.isFinite(t.value)) continue;
    if (t.value < min) min = t.value;
    if (t.value > max) max = t.value;
  }
  if (typeof opts.min === 'number' && Number.isFinite(opts.min)) min = opts.min;
  if (typeof opts.max === 'number' && Number.isFinite(opts.max)) max = opts.max;
  if (!(max > min)) {
    if (typeof opts.max === 'number' && typeof opts.min !== 'number') min = max - 1;
    else max = min + 1;
  }
  return { min, max };
}

/** A rough pixel width for a tick label, so the plot leaves room for long ones (units, big numbers). */
export function labelWidth(labels: string[], fontSize = 11): number {
  const longest = labels.reduce((m, l) => Math.max(m, l.length), 0);
  return Math.ceil(longest * fontSize * 0.6);
}

/** Default number text for ticks and tooltips. */
export const defaultNumber = (v: number): string => String(Math.round(v * 100) / 100);
