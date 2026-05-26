'use client';
/**
 * Pure date helpers used across the Calendar views.
 *
 * Kept dependency-free (no `date-fns`, no Intl edge cases) so the core
 * stays under the 25 kB perf budget. Anything timezone-aware lands in M6.
 */

export const MS_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function addMonths(d: Date, n: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

/** Start of the week containing `d`, where weekStart is 0=Sun or 1=Mon. */
export function startOfWeek(d: Date, weekStart: 0 | 1): Date {
  const x = startOfDay(d);
  const diff = (x.getDay() - weekStart + 7) % 7;
  return addDays(x, -diff);
}

export function endOfWeek(d: Date, weekStart: 0 | 1): Date {
  return endOfDay(addDays(startOfWeek(d, weekStart), 6));
}

/** Inclusive list of N days starting at `from`. */
export function rangeDays(from: Date, count: number): Date[] {
  const arr: Date[] = [];
  for (let i = 0; i < count; i++) arr.push(addDays(from, i));
  return arr;
}

/**
 * Build a 6-row × 7-column grid that contains the month of `d`, padded with
 * leading days from the previous month and trailing days from the next month.
 */
export function monthGrid(d: Date, weekStart: 0 | 1): Date[] {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const gridStart = startOfWeek(first, weekStart);
  return rangeDays(gridStart, 42);
}

/** True iff event overlaps day [00:00, 24:00). */
export function eventOnDay<E extends { start: Date; end: Date }>(
  e: E,
  day: Date,
): boolean {
  const dayStart = startOfDay(day).getTime();
  const dayEnd = dayStart + MS_DAY;
  return e.start.getTime() < dayEnd && e.end.getTime() > dayStart;
}

/** Format "HH:MM" — 24-hour clock, locale-stable. */
export function fmtTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** Returns "title — HH:MM" for screen reader / aria-label use. */
export function fmtTimeRange(start: Date, end: Date): string {
  return `${fmtTime(start)} – ${fmtTime(end)}`;
}

/** Whole minutes since midnight. Used by the timed view layout. */
export function minutesIntoDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}
