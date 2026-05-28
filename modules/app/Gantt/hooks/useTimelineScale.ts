'use client';
import { useMemo } from 'react';
import type { Task, TimeUnit } from '../types';
import { PIXELS_PER_DAY } from '../types';

const MS_PER_DAY = 86400000;

/** Truncate a date to its day boundary (local time). */
function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

/** Whole days between a and b — b - a, may be negative. */
export function diffDays(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY);
}

/** Add `n` days to a date (immutable). */
export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/**
 * Move a date forward (or back, if `direction = -1`) to the next working day,
 * skipping weekends and holidays. Returns the date unchanged when the
 * working-day set already contains it. Bails after 14 hops to keep callers
 * safe against caller errors (e.g. empty workingDays).
 */
export function snapToWorkingDay(
  d: Date,
  workingDays: number[] | undefined,
  holidays: Date[] | undefined,
  direction: 1 | -1 = 1,
): Date {
  if (!workingDays || workingDays.length === 0) return d;
  const work = new Set(workingDays);
  const holidaySet = new Set<number>();
  for (const h of holidays ?? []) {
    const h0 = new Date(h);
    h0.setHours(0, 0, 0, 0);
    holidaySet.add(h0.getTime());
  }
  let cur = startOfDay(d);
  for (let i = 0; i < 14; i++) {
    if (work.has(cur.getDay()) && !holidaySet.has(cur.getTime())) return cur;
    cur = addDays(cur, direction);
  }
  return d;
}

export type TimelineColumn = {
  /** Day-aligned start of this header cell. */
  start: Date;
  /** Day-aligned end (exclusive). */
  end: Date;
  /** Display label, e.g. "5", "Mar", "2026", "W12". */
  label: string;
  /** Secondary label (for two-row headers — M3.5 future). */
  subLabel?: string;
  /** Width in pixels. */
  width: number;
};

export type TimelineScale = {
  scale: TimeUnit;
  pixelsPerDay: number;
  /** Total width of the timeline in px. */
  totalWidth: number;
  /** First visible day on the timeline. */
  rangeStart: Date;
  /** Last visible day (exclusive) on the timeline. */
  rangeEnd: Date;
  /** Header cell list. */
  columns: TimelineColumn[];
  /** Position a date in px from rangeStart. */
  xForDate: (d: Date) => number;
};

/** Compute the [min..max] task range, padded by a few days on each side. */
function computeRange(tasks: Task[]): { rangeStart: Date; rangeEnd: Date } {
  if (tasks.length === 0) {
    const today = startOfDay(new Date());
    return { rangeStart: addDays(today, -7), rangeEnd: addDays(today, 30) };
  }
  let minMs = Number.POSITIVE_INFINITY;
  let maxMs = Number.NEGATIVE_INFINITY;
  for (const t of tasks) {
    const s = t.start.getTime();
    const e = t.end.getTime();
    if (s < minMs) minMs = s;
    if (e > maxMs) maxMs = e;
  }
  const rangeStart = addDays(startOfDay(new Date(minMs)), -3);
  const rangeEnd   = addDays(startOfDay(new Date(maxMs)),  3);
  return { rangeStart, rangeEnd };
}

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Resolve short month names for the supplied locale (memoised by caller). */
function monthNamesFor(locale?: string): string[] {
  if (!locale) return MONTH_NAMES_SHORT;
  try {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2024, i, 1)));
  } catch {
    return MONTH_NAMES_SHORT;
  }
}

/** ISO week number (Monday-based) — enough for M1 label parity. */
function isoWeek(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

function buildDayColumns(start: Date, end: Date, ppd: number, months: string[]): TimelineColumn[] {
  const cols: TimelineColumn[] = [];
  let cur = new Date(start);
  while (cur < end) {
    const next = addDays(cur, 1);
    cols.push({ start: new Date(cur), end: next, label: String(cur.getDate()), subLabel: months[cur.getMonth()], width: ppd });
    cur = next;
  }
  return cols;
}

function buildWeekColumns(start: Date, end: Date, ppd: number, months: string[]): TimelineColumn[] {
  const cols: TimelineColumn[] = [];
  // Snap to Monday
  let cur = new Date(start);
  const dow = (cur.getDay() + 6) % 7; // Mon=0
  cur = addDays(cur, -dow);
  while (cur < end) {
    const next = addDays(cur, 7);
    const days = Math.min(7, diffDays(cur, end));
    cols.push({
      start: new Date(cur),
      end: next,
      label: `W${isoWeek(cur)}`,
      subLabel: `${months[cur.getMonth()]} ${cur.getDate()}`,
      width: days * ppd,
    });
    cur = next;
  }
  return cols;
}

function buildMonthColumns(start: Date, end: Date, ppd: number, months: string[]): TimelineColumn[] {
  const cols: TimelineColumn[] = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur < end) {
    const next = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    const days = diffDays(cur, next);
    cols.push({
      start: new Date(cur),
      end: next,
      label: months[cur.getMonth()],
      subLabel: String(cur.getFullYear()),
      width: days * ppd,
    });
    cur = next;
  }
  return cols;
}

function buildQuarterColumns(start: Date, end: Date, ppd: number): TimelineColumn[] {
  const cols: TimelineColumn[] = [];
  const startQ = Math.floor(start.getMonth() / 3);
  let cur = new Date(start.getFullYear(), startQ * 3, 1);
  while (cur < end) {
    const next = new Date(cur.getFullYear(), cur.getMonth() + 3, 1);
    const days = diffDays(cur, next);
    cols.push({
      start: new Date(cur),
      end: next,
      label: `Q${Math.floor(cur.getMonth() / 3) + 1}`,
      subLabel: String(cur.getFullYear()),
      width: days * ppd,
    });
    cur = next;
  }
  return cols;
}

function buildYearColumns(start: Date, end: Date, ppd: number): TimelineColumn[] {
  const cols: TimelineColumn[] = [];
  let cur = new Date(start.getFullYear(), 0, 1);
  while (cur < end) {
    const next = new Date(cur.getFullYear() + 1, 0, 1);
    const days = diffDays(cur, next);
    cols.push({
      start: new Date(cur),
      end: next,
      label: String(cur.getFullYear()),
      width: days * ppd,
    });
    cur = next;
  }
  return cols;
}

export function useTimelineScale(tasks: Task[], scale: TimeUnit, locale?: string): TimelineScale {
  return useMemo<TimelineScale>(() => {
    const { rangeStart, rangeEnd } = computeRange(tasks);
    const ppd = PIXELS_PER_DAY[scale];
    const months = monthNamesFor(locale);

    let columns: TimelineColumn[];
    switch (scale) {
      case 'day':     columns = buildDayColumns(rangeStart, rangeEnd, ppd, months); break;
      case 'week':    columns = buildWeekColumns(rangeStart, rangeEnd, ppd, months); break;
      case 'month':   columns = buildMonthColumns(rangeStart, rangeEnd, ppd, months); break;
      case 'quarter': columns = buildQuarterColumns(rangeStart, rangeEnd, ppd); break;
      case 'year':    columns = buildYearColumns(rangeStart, rangeEnd, ppd); break;
    }

    // Total width = sum of column widths (handles partial start columns).
    const totalWidth = columns.reduce((sum, c) => sum + c.width, 0);

    const baselineStart = columns[0]?.start ?? rangeStart;
    const xForDate = (d: Date) => diffDays(baselineStart, d) * ppd;

    return { scale, pixelsPerDay: ppd, totalWidth, rangeStart: baselineStart, rangeEnd, columns, xForDate };
  }, [tasks, scale, locale]);
}
