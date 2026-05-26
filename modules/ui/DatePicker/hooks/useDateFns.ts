// modules/ui/DatePicker/hooks/useDateFns.ts
//
// Minimal date helpers — implemented locally because `date-fns` is NOT a
// project dependency and the M1 scope forbids adding one.
//
// TODO M3: replace this in-house helper layer with a lazy date-fns import
// (`import('date-fns/locale/tr')`) so locale data isn't bundled twice.

import { enLocale } from '../locale/en';
import { trLocale } from '../locale/tr';
import type { DatePickerLocale, DisabledDates, LocaleCode } from '../types';

const LOCALES: Record<LocaleCode, DatePickerLocale> = {
  en: enLocale,
  tr: trLocale,
};

/** Resolve a locale code (defaults to 'tr'). */
export function resolveLocale(code: LocaleCode | undefined): DatePickerLocale {
  if (!code) return LOCALES.tr;
  return LOCALES[code] ?? LOCALES.tr;
}

/** Returns a new Date set to local midnight. Safe with null. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/** First day of the month. */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

/** Last day of the month. */
export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 0, 0, 0, 0);
}

/** How many days the month contains. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Add `n` months — preserves intent to land on same numeric day where possible. */
export function addMonths(d: Date, n: number): Date {
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const target = new Date(year, month + n, 1);
  const maxDay = daysInMonth(target.getFullYear(), target.getMonth());
  target.setDate(Math.min(day, maxDay));
  return target;
}

export function addYears(d: Date, n: number): Date {
  return addMonths(d, n * 12);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** Are two dates the same calendar day? */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Inclusive comparison `a < b` (day-precision). */
export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function clampToBounds(d: Date, min?: Date, max?: Date): Date {
  if (min && isBefore(d, min)) return startOfDay(min);
  if (max && isAfter(d, max)) return startOfDay(max);
  return d;
}

/** True when the date is on or between min/max bounds. */
export function isWithinBounds(d: Date, min?: Date, max?: Date): boolean {
  if (min && isBefore(d, min)) return false;
  if (max && isAfter(d, max)) return false;
  return true;
}

/** Apply user-supplied disabledDates (array OR predicate). */
export function isDisabled(
  d: Date,
  disabledDates?: DisabledDates,
  min?: Date,
  max?: Date,
): boolean {
  if (!isWithinBounds(d, min, max)) return true;
  if (!disabledDates) return false;
  if (typeof disabledDates === 'function') return disabledDates(d);
  return disabledDates.some((x) => isSameDay(x, d));
}

/**
 * Build the 6×7 grid of dates for a given month, starting on `weekStartsOn`.
 * Each row is a week; out-of-month leading/trailing days are included so the
 * grid always has 42 cells. We pad with neighbouring month days to keep the
 * grid visually stable while flipping months.
 */
export function buildMonthGrid(year: number, month: number, weekStartsOn: 0 | 1): Date[] {
  const first = new Date(year, month, 1);
  // JS getDay(): 0 = Sunday, 1 = Monday, ...
  const firstDow = first.getDay();
  // How many leading "previous-month" days we need so the first row aligns.
  const leading = (firstDow - weekStartsOn + 7) % 7;
  const gridStart = new Date(year, month, 1 - leading);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(addDays(gridStart, i));
  }
  return cells;
}

/** Tokens supported in format strings (locale-aware). */
const FORMAT_TOKEN = /YYYY|YY|MM|M|DD|D/g;

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

/**
 * Format a Date with the given token string.
 * Supported tokens: YYYY (2026), YY (26), MM (06), M (6), DD (05), D (5).
 */
export function formatDate(d: Date | null | undefined, format: string): string {
  if (!d || isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return format.replace(FORMAT_TOKEN, (token) => {
    switch (token) {
      case 'YYYY': return String(year);
      case 'YY': return String(year).slice(-2);
      case 'MM': return pad2(month);
      case 'M': return String(month);
      case 'DD': return pad2(day);
      case 'D': return String(day);
      default: return token;
    }
  });
}

/** Convert a Date to ISO yyyy-mm-dd (local). Used for `<input type="hidden">` payloads. */
export function toIso(d: Date | null | undefined): string {
  if (!d || isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Parse a yyyy-mm-dd string into a local Date. Returns null on invalid input. */
export function fromIso(v: string | null | undefined): Date | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) {
    const fallback = new Date(v);
    return isNaN(fallback.getTime()) ? null : startOfDay(fallback);
  }
  const [, ys, ms, ds] = m;
  const d = new Date(Number(ys), Number(ms) - 1, Number(ds));
  return isNaN(d.getTime()) ? null : d;
}

/** A stable list of recent years for the year picker — e.g. current ± 10. */
export function yearRange(center: number, radius = 10): number[] {
  const out: number[] = [];
  for (let y = center - radius; y <= center + radius; y++) out.push(y);
  return out;
}
