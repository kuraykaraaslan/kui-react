// modules/ui/Chart/charts/_helpers.ts
//
// Shared scale / tick math used by the M1 chart implementations.
// Kept dependency-free so it can be mirrored 1:1 in EJS's
// /modules/ui/Chart/scripts/chart-helpers.js.

import type { Series, PlotRect, CurveType, LineStyle, LegendValue, ThresholdLine, PointShape } from '../types';

/** A readable step for about `count` intervals over `range`: 1, 2, 2.5 or 5 times a power of ten. */
export function niceStep(range: number, count = 4): number {
  if (!(range > 0) || !Number.isFinite(range)) return 1;
  const raw = range / Math.max(1, count);
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  const m = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return m * pow;
}

/** Decimals a step needs to print exactly (0.25 → 2, 50 → 0). */
const stepDecimals = (step: number) => Math.max(0, -Math.floor(Math.log10(step) + 1e-9) + (String(step).includes('25') && step < 1 ? 1 : 0));

/**
 * Tick values at a readable step (see `niceStep`) between `lo` and `hi`, both ends included when they
 * fall on the step (a domain from `resolveDomain` always does). Never a value like 263.25 on a 0–351 axis.
 */
export function niceTicks(lo: number, hi: number, count = 4): number[] {
  if (lo === hi) {
    if (lo === 0) return [0, 0.25, 0.5, 0.75, 1];
    const pad = Math.abs(lo) * 0.5 || 1;
    lo -= pad;
    hi += pad;
  }
  if (lo > hi) [lo, hi] = [hi, lo];
  const step = niceStep(hi - lo, count);
  const d = Math.min(10, stepDecimals(step) + 1);
  const out: number[] = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9 && out.length < 50; v += step) {
    out.push(Number(v.toFixed(d)));
  }
  return out.length >= 2 ? out : [lo, hi];
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
  opts: { min?: number; max?: number; thresholds?: ThresholdLine[]; count?: number } = {},
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
  // Widen to readable bounds (0–351 kW → 0–400 kW) unless the author pinned that end. Widening can
  // change the step `niceTicks` picks for the new range, so repeat until it is stable: the ticks then
  // run exactly from one end to the other.
  const count = opts.count ?? 4;
  const pinnedMin = typeof opts.min === 'number' && Number.isFinite(opts.min);
  const pinnedMax = typeof opts.max === 'number' && Number.isFinite(opts.max);
  const lo0 = min;
  const hi0 = max;
  let step = niceStep(max - min, count);
  for (let i = 0; i < 4; i++) {
    min = pinnedMin ? lo0 : Math.floor(lo0 / step + 1e-9) * step;
    max = pinnedMax ? hi0 : Math.ceil(hi0 / step - 1e-9) * step;
    const next = niceStep(max - min, count);
    if (Math.abs(next - step) < step * 1e-9) break;
    step = next;
  }
  return { min, max };
}

/** A rough pixel width for a tick label, so the plot leaves room for long ones (units, big numbers). */
export function labelWidth(labels: string[], fontSize = 11): number {
  const longest = labels.reduce((m, l) => Math.max(m, l.length), 0);
  return Math.ceil(longest * fontSize * 0.6);
}

/**
 * Category labels along an x axis, every k-th one kept so they never overlap (30 dates on a narrow card
 * become every 5th date). Positions stay; skipped ticks keep their place with an empty label.
 */
export function thinLabels<T extends { label: string }>(ticks: T[], widthPx: number, fontSize = 11): T[] {
  if (ticks.length < 2 || widthPx <= 0) return ticks;
  const per = labelWidth(ticks.map((t) => t.label), fontSize) + 12;
  const fit = Math.max(1, Math.floor(widthPx / per));
  const k = Math.ceil(ticks.length / fit);
  return k <= 1 ? ticks : ticks.map((t, i) => (i % k === 0 ? t : { ...t, label: '' }));
}

/** Default number text for ticks and tooltips. */
export const defaultNumber = (v: number): string => String(Math.round(v * 100) / 100);

/**
 * A second value axis that shares the first one's grid lines: the same number of intervals, at a round
 * step, covering `base` (pinned ends are kept as given and the step follows them).
 */
export function alignedDomain(
  base: { min: number; max: number },
  intervals: number,
  opts: { min?: number; max?: number } = {},
): { min: number; max: number; ticks: number[] } {
  const n = Math.max(1, Math.round(intervals));
  const pinnedMin = typeof opts.min === 'number' && Number.isFinite(opts.min);
  const pinnedMax = typeof opts.max === 'number' && Number.isFinite(opts.max);
  let lo = pinnedMin ? (opts.min as number) : base.min;
  let hi = pinnedMax ? (opts.max as number) : base.max;
  if (!(hi > lo)) hi = lo + 1;
  if (pinnedMin && pinnedMax) {
    const step = (hi - lo) / n;
    return { min: lo, max: hi, ticks: Array.from({ length: n + 1 }, (_, i) => lo + step * i) };
  }
  // Grow the step through the nice sequence until n intervals cover the data.
  let step = niceStep(hi - lo, n);
  for (let guard = 0; guard < 40; guard++) {
    const start = pinnedMin ? lo : pinnedMax ? hi - n * step : Math.floor(lo / step + 1e-9) * step;
    if (start + n * step >= hi - 1e-9 && start <= lo + 1e-9) {
      lo = start;
      break;
    }
    step = niceStep(step * 1.01 * n, n);
  }
  const d = Math.min(10, Math.max(0, -Math.floor(Math.log10(step)) + 2));
  const ticks = Array.from({ length: n + 1 }, (_, i) => Number((lo + step * i).toFixed(d)));
  return { min: ticks[0], max: ticks[n], ticks };
}

/** The stack each series belongs to: its own `stack`, the shared one when the chart is `stacked`, or none (null). */
export function stackKeys(series: Series[], stacked: boolean): Array<string | null> {
  return series.map((s) => {
    const axis = s.yAxis === 'right' ? 'r' : 'l';
    if (s.stack) return `${axis}:${s.stack}`;
    return stacked ? `${axis}:\u0000all` : null;
  });
}

/**
 * Per-series tops for grouped stacking: `tops[si][i]` is where series `si` ends at category `i` within
 * its own stack (a series outside any stack ends at its value), and `below[si]` the series it sits on (-1 = baseline).
 */
export function groupedStackTops(series: Series[], keys: Array<string | null>): { tops: Array<Array<number | null>>; below: number[] } {
  const n = series.reduce((m, s) => Math.max(m, s.data.length), 0);
  const running = new Map<string, number[]>();
  const last = new Map<string, number>();
  const below: number[] = [];
  const tops = series.map((s, si) => {
    const key = keys[si];
    if (key === null) {
      below.push(-1);
      return Array.from({ length: n }, (_, i) => (typeof s.data[i]?.y === 'number' ? (s.data[i].y as number) : null));
    }
    below.push(last.get(key) ?? -1);
    last.set(key, si);
    const run = running.get(key) ?? new Array<number>(n).fill(0);
    running.set(key, run);
    return Array.from({ length: n }, (_, i) => {
      const y = s.data[i]?.y;
      if (typeof y !== 'number') return null;
      run[i] += Math.max(0, y);
      return run[i];
    });
  });
  return { tops, below };
}

/** The value extent of grouped-stack tops (including zero unless `includeZero` is false). */
export function topsExtent(tops: Array<Array<number | null>>, includeZero = true): { min: number; max: number } {
  let min = includeZero ? 0 : Infinity;
  let max = includeZero ? 0 : -Infinity;
  for (const row of tops) for (const v of row) {
    if (v === null) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min)) return { min: 0, max: 1 };
  return { min, max: max > min ? max : min + 1 };
}

/** Least-squares line through points; null with fewer than 2 distinct x values. */
export function linearRegression(points: Array<{ x: number; y: number }>): { slope: number; intercept: number } | null {
  const n = points.length;
  if (n < 2) return null;
  let sx = 0; let sy = 0; let sxx = 0; let sxy = 0;
  for (const p of points) { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; }
  const den = n * sxx - sx * sx;
  if (Math.abs(den) < 1e-12) return null;
  const slope = (n * sxy - sx * sy) / den;
  return { slope, intercept: (sy - slope * sx) / n };
}

/** SVG path for a point mark of radius `r` centred on (x, y); circles are drawn as `<circle>` instead. */
export function pointPath(shape: PointShape, x: number, y: number, r: number): string {
  if (shape === 'square') {
    const h = r * 0.9;
    return `M${x - h} ${y - h}H${x + h}V${y + h}H${x - h}Z`;
  }
  if (shape === 'diamond') {
    const h = r * 1.25;
    return `M${x} ${y - h}L${x + h} ${y}L${x} ${y + h}L${x - h} ${y}Z`;
  }
  const h = r * 1.2;
  return `M${x} ${y - h}L${x + h * 0.95} ${y + h * 0.65}L${x - h * 0.95} ${y + h * 0.65}Z`;
}
