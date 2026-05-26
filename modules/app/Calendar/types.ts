/**
 * Calendar module — public types.
 *
 * M1 (this milestone): month / week / day views.
 * M2 — drag & drop, M3 — RRULE recurrence, M4 — resource/multi-calendar,
 * M5 — agenda + mini + search, M6 — full a11y/i18n/perf are TODO.
 */
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type View = 'month' | 'week' | 'day' | 'agenda' | 'resource';

/** Color hint used for the event pill / bar. */
export type EventColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'secondary'
  | 'neutral';

/** A single calendar event. */
export type Event = {
  id: string;
  title: string;
  /** Inclusive start instant. */
  start: Date;
  /** Exclusive end instant. */
  end: Date;
  /** True → renders as an all-day bar instead of a timed pill. */
  allDay?: boolean;
  /** Token-based color; fallback "primary". */
  color?: EventColor;
  /** Optional FontAwesome icon shown next to the title. */
  icon?: IconDefinition;
  /** Optional plain-text description (used by popover in M2). */
  description?: string;
  /** Optional calendar identifier — wired up properly in M4. */
  calendarId?: string;
  // TODO M3: rrule?: string;            (RRULE string, lazy-expanded)
  // TODO M4: resourceId?: string;       (resource column the event belongs to)
  // TODO M3: exceptions?: Date[];       (recurring-event exceptions)
};

/** Resource (room / person / lane). Real handling in M4. */
export type Resource = {
  id: string;
  name: string;
  color?: EventColor;
};

/** Locale messages — translatable strings displayed in chrome. */
export type CalendarMessages = {
  today: string;
  previous: string;
  next: string;
  month: string;
  week: string;
  day: string;
  agenda: string;
  resource: string;
  allDay: string;
  noEvents: string;
  more: (n: number) => string;
};

/** Working-hours config (visual shading hint only in M1). */
export type WorkingHours = {
  /** 0–23 inclusive — slot start hour. */
  start: number;
  /** 0–23 inclusive — slot end hour. */
  end: number;
  /** ISO weekday numbers (0=Sun … 6=Sat). */
  days: number[];
};

/** Telemetry payload — reserved for future analytics integrations. */
export type CalendarTelemetry =
  | { type: 'view-change'; view: View }
  | { type: 'nav'; date: Date; direction: 'prev' | 'next' | 'today' }
  | { type: 'event-click'; eventId: string };

export type CalendarProps = {
  /** Events to render. Caller is responsible for fetching & memoising. */
  events: Event[];
  /** Active view; controlled by caller. Default "month". */
  view?: View;
  /** Date the view is anchored to. Default `new Date()`. */
  defaultDate?: Date;
  /** Called when the user picks a view. URL-state wiring is caller's job. */
  onViewChange?: (v: View) => void;
  /** Called when navigating (today / prev / next / keyboard). */
  onDateChange?: (d: Date) => void;
  /** Click handler — fires once per event press. */
  onEventClick?: (e: Event) => void;
  // TODO M2: onEventCreate?: (start: Date, end: Date) => Promise<Event>;
  // TODO M2: onEventUpdate?: (e: Event) => Promise<void>;
  // TODO M2: onEventDelete?: (id: string) => Promise<void>;

  /** Resources column list — used by ResourceView in M4. */
  resources?: Resource[];
  /** Multi-calendar overlay — wired up in M4. */
  calendars?: { id: string; name: string; color: EventColor }[];
  /** Lazy RRULE expansion toggle. Defaults to false until M3 lands. */
  recurrence?: boolean;
  /** Locale code — currently "tr" or "en". Default "tr". */
  locale?: string;
  /** Override individual chrome strings. */
  messages?: Partial<CalendarMessages>;
  /** Optional working-hours hint. */
  workingHours?: WorkingHours;
  /** Time-slot granularity in week / day views. */
  slotMinutes?: 5 | 15 | 30 | 60;
  /** Disable enter / leave animations. */
  reducedMotion?: boolean;
  /** IANA timezone string — full support arrives in M6. */
  timezone?: string;
  /** Optional telemetry sink. */
  onTelemetry?: (e: CalendarTelemetry) => void;
  /** Extra class on the outer wrapper. */
  className?: string;
};

/** Imperative handle — caller can drive nav programmatically (M2+). */
export type CalendarHandle = {
  goToToday: () => void;
  goPrev: () => void;
  goNext: () => void;
  setView: (v: View) => void;
};
