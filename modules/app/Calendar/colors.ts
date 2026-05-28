'use client';
import type { EventColor } from './types';

/**
 * Token-only color map. Values reference CSS variables defined in
 * app/globals.css — no raw hex / RGB anywhere in the calendar.
 */
export const EVENT_COLOR_CLASSES: Record<EventColor, {
  /** Pill background (month-view + timed week/day events). */
  pill: string;
  /** All-day bar background. */
  bar: string;
  /** Foreground text colour. */
  fg: string;
  /** Solid dot used inside event cards. */
  dot: string;
}> = {
  primary: {
    pill: 'bg-primary text-primary-fg',
    bar:  'bg-primary text-primary-fg',
    fg:   'text-primary',
    dot:  'bg-primary',
  },
  success: {
    pill: 'bg-success text-success-fg',
    bar:  'bg-success text-success-fg',
    fg:   'text-success',
    dot:  'bg-success',
  },
  warning: {
    pill: 'bg-warning text-text-primary',
    bar:  'bg-warning text-text-primary',
    fg:   'text-warning',
    dot:  'bg-warning',
  },
  error: {
    pill: 'bg-error text-primary-fg',
    bar:  'bg-error text-primary-fg',
    fg:   'text-error',
    dot:  'bg-error',
  },
  info: {
    pill: 'bg-info text-primary-fg',
    bar:  'bg-info text-primary-fg',
    fg:   'text-info',
    dot:  'bg-info',
  },
  secondary: {
    pill: 'bg-secondary text-primary-fg',
    bar:  'bg-secondary text-primary-fg',
    fg:   'text-secondary',
    dot:  'bg-secondary',
  },
  neutral: {
    pill: 'bg-surface-overlay text-text-primary border border-border',
    bar:  'bg-surface-overlay text-text-primary border border-border',
    fg:   'text-text-secondary',
    dot:  'bg-text-secondary',
  },
};

export function resolveColor(c?: EventColor): EventColor {
  return c ?? 'primary';
}

/**
 * The colour to render an event in, after multi-calendar resolution:
 *   event.color  →  matching calendar.color  →  'primary'
 */
export function effectiveColor(
  event: { color?: EventColor; calendarId?: string },
  calendars?: { id: string; color: EventColor }[],
): EventColor {
  if (event.color) return event.color;
  if (event.calendarId && calendars) {
    const cal = calendars.find((c) => c.id === event.calendarId);
    if (cal) return cal.color;
  }
  return 'primary';
}
