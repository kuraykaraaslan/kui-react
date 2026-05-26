// modules/ui/Chart/charts/_helpers.ts
//
// Shared scale / tick math used by the M1 chart implementations.
// Kept dependency-free so it can be mirrored 1:1 in EJS's
// /modules/ui/Chart/scripts/chart-helpers.js.

import type { Series, PlotRect } from '../types';

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
