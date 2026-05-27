'use client';
/**
 * Shared geometry helpers for the drag hooks.
 * Pure functions — no React, no DOM mutation.
 */
import { HOUR_HEIGHT } from '../date-utils';

/** Convert a Y offset (inside a day column) to whole minutes from midnight. */
export function yToMinutes(y: number, columnHeight: number): number {
  const clamped = Math.max(0, Math.min(columnHeight, y));
  return Math.round((clamped / HOUR_HEIGHT) * 60);
}

/** Snap a minute-of-day value down to the nearest `step`. */
export function snapMinutes(minute: number, step: number): number {
  return Math.floor(minute / step) * step;
}

/**
 * Hit-test the day column the pointer is currently over.
 * Returns the column element and its 0-based index, or null when off-grid.
 */
export function hitTestDayColumn(
  clientX: number,
  clientY: number,
): { col: HTMLElement; index: number } | null {
  if (typeof document === 'undefined') return null;
  const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
  if (!el) return null;
  const col = el.closest<HTMLElement>('[data-cal-day-index]');
  if (!col) return null;
  const idx = Number(col.dataset.calDayIndex);
  if (!Number.isFinite(idx)) return null;
  return { col, index: idx };
}
