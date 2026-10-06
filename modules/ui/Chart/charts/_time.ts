// Time-axis maths for the Chart family (phase 9 §9.1). Dependency-free and pure.
// kui-ejs mirror (`scripts/chart-helpers.js`) is still to do (phase 9 §9.1).

import type { Series, PlotRect } from '../types';

export type TimeDomain = [number, number];

/** A series x value as epoch milliseconds: a number is taken as ms, a string must be a parsable date. */
export function toTime(x: string | number): number | null {
  if (typeof x === 'number') return Number.isFinite(x) ? x : null;
  // A date-only string ("2026-10-06") is a calendar DAY, not an instant: Date.parse reads it as
  // UTC midnight, which a viewer west of UTC would see labelled as the previous day.
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(x);
  if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])).getTime();
  const t = Date.parse(x);
  return Number.isNaN(t) ? null : t;
}

/** True when EVERY point of EVERY series has a time-like x (and there is at least one point). */
export function isTimeSeries(series: Series[]): boolean {
  let any = false;
  for (const s of series) {
    for (const p of s.data) {
      if (toTime(p.x) === null) return false;
      any = true;
    }
  }
  return any;
}

/** Full extent of the data. A single instant is widened so the scale has a width. */
export function timeExtent(series: Series[]): TimeDomain {
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of series) {
    for (const p of s.data) {
      const t = toTime(p.x);
      if (t === null) continue;
      if (t < lo) lo = t;
      if (t > hi) hi = t;
    }
  }
  if (!Number.isFinite(lo)) return [0, 1];
  if (lo === hi) return [lo - 30 * 60_000, hi + 30 * 60_000];
  return [lo, hi];
}

/** Points of each series that fall inside the domain (inclusive), as `{ t, y, label }`. */
export interface TimePoint { t: number; y: number | null; label?: string }
export function timePoints(series: Series[]): TimePoint[][] {
  return series.map((s) => {
    const out: TimePoint[] = [];
    for (const p of s.data) {
      const t = toTime(p.x);
      if (t !== null) out.push({ t, y: p.y, label: p.label });
    }
    return out.sort((a, b) => a.t - b.t);
  });
}

export function inDomain(points: TimePoint[], [lo, hi]: TimeDomain): TimePoint[] {
  return points.filter((p) => p.t >= lo && p.t <= hi);
}

/** y extent over the visible points; always includes zero, like the band charts. */
export function visibleYExtent(all: TimePoint[][], domain: TimeDomain): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const pts of all) {
    for (const p of inDomain(pts, domain)) {
      if (p.y === null || p.y === undefined) continue;
      if (p.y < min) min = p.y;
      if (p.y > max) max = p.y;
    }
  }
  if (!Number.isFinite(min)) min = 0;
  if (!Number.isFinite(max)) max = 1;
  if (min > 0) min = 0;
  if (max < 0) max = 0;
  return { min, max };
}

export function xTime(t: number, [lo, hi]: TimeDomain, rect: PlotRect): number {
  if (hi === lo) return rect.x + rect.width / 2;
  return rect.x + ((t - lo) / (hi - lo)) * rect.width;
}

export function invTime(px: number, [lo, hi]: TimeDomain, rect: PlotRect): number {
  if (rect.width <= 0) return lo;
  return lo + ((px - rect.x) / rect.width) * (hi - lo);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const STEPS = [
  SECOND, 5 * SECOND, 15 * SECOND, 30 * SECOND,
  MINUTE, 5 * MINUTE, 15 * MINUTE, 30 * MINUTE,
  HOUR, 3 * HOUR, 6 * HOUR, 12 * HOUR,
  DAY, 2 * DAY, 7 * DAY, 14 * DAY, 30 * DAY, 91 * DAY, 182 * DAY, 365 * DAY,
];

/** The tick step (ms) for a span, giving at most about `target` ticks. */
export function tickStep(span: number, target: number): number {
  const want = Math.max(1, target);
  return STEPS.find((s) => span / s <= want) ?? STEPS[STEPS.length - 1];
}

/** Ticks aligned to the step in LOCAL time (so day ticks land on midnight, not 02:00). */
export function timeTicks(domain: TimeDomain, target = 6): number[] {
  const [lo, hi] = domain;
  if (!(hi > lo)) return [lo];
  const step = tickStep(hi - lo, target);
  const off = new Date(lo).getTimezoneOffset() * MINUTE;
  const out: number[] = [];
  for (let t = Math.ceil((lo - off) / step) * step + off; t <= hi; t += step) out.push(t);
  return out.length ? out : [lo, hi];
}

/** Compact tick label for the visible span. */
export function formatTick(ms: number, span: number, locale?: string): string {
  const d = new Date(ms);
  if (span <= 10 * MINUTE) return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (span <= 2 * DAY) return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  if (span <= 7 * DAY) return d.toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  if (span <= 400 * DAY) return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  return d.toLocaleDateString(locale, { year: '2-digit', month: 'short' });
}

/** Full label for the tooltip header. */
export function formatFull(ms: number, span: number, locale?: string): string {
  const d = new Date(ms);
  return span > 2 * DAY
    ? d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
    : d.toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/** Smallest zoom window: a brush narrower than this (ms) is ignored. */
export const MIN_ZOOM_MS = 1000;
/** Smallest brush in pixels that counts as a zoom gesture (not a click). */
export const MIN_BRUSH_PX = 8;

/** The domain a brush from `px0` to `px1` selects, clamped to `full`; null when it is too small. */
export function brushDomain(px0: number, px1: number, domain: TimeDomain, full: TimeDomain, rect: PlotRect): TimeDomain | null {
  if (Math.abs(px1 - px0) < MIN_BRUSH_PX) return null;
  const a = invTime(Math.min(px0, px1), domain, rect);
  const b = invTime(Math.max(px0, px1), domain, rect);
  const lo = Math.max(full[0], a);
  const hi = Math.min(full[1], b);
  return hi - lo < MIN_ZOOM_MS ? null : [lo, hi];
}

/** Index of the time in the sorted `times` nearest to `t`. */
export function nearestIndex(times: number[], t: number): number {
  if (times.length === 0) return -1;
  let lo = 0;
  let hi = times.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (times[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  if (lo > 0 && Math.abs(times[lo - 1] - t) <= Math.abs(times[lo] - t)) return lo - 1;
  return lo;
}
