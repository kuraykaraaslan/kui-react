/**
 * Calendar module — public types.
 *
 * M1: month / week / day views.       — done
 * M2: interactions (popover + drag).  — in progress
 * M3: RRULE recurrence.               — stub
 * M4: resource / multi-calendar.      — stub
 * M5: agenda + mini + search.         — stub
 * M6: full a11y / i18n / perf.        — stub
 *
 * See modules/app/Calendar/PLAN.md for the roadmap.
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
  /** Optional plain-text description (used by popover). */
  description?: string;
  /** Optional calendar identifier — wired up properly in M4. */
  calendarId?: string;
  /**
   * RFC 5545 RRULE string (without `DTSTART:` prefix), e.g.
   * `FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10`.
   * Occurrences are expanded for the visible date range only.
   * Supported tokens (M3 subset): FREQ, INTERVAL, COUNT, UNTIL, BYDAY.
   */
  rrule?: string;
  /** Dates to skip when expanding `rrule` (matched on day boundary). */
  exceptions?: Date[];
  // TODO M4: resourceId?: string;       (resource column the event belongs to)
};

/**
 * Materialised occurrence of a recurring event. The `id` becomes
 * `${parent.id}::${ISO start}` so consumers can distinguish a single
 * instance from the series. `parentId` + `originalStart` are added
 * so handlers can scope edits ("this", "this and following", "series").
 */
export type EventOccurrence = Event & {
  parentId?: string;
  originalStart?: Date;
  isRecurrence?: boolean;
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
  /** Popover action labels (M2). */
  edit: string;
  delete: string;
  confirmDelete: string;
  close: string;
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

/** Popover state held in the store. */
export type CalendarPopoverState = {
  event: Event | null;
  anchorRect: DOMRect | null;
};

/** Drag preview state — single source of truth for ghost rendering. */
export type CalendarDragState =
  | { kind: 'idle' }
  | { kind: 'move'; eventId: string; ghostStart: Date; ghostEnd: Date; dayIndex: number }
  | { kind: 'resize'; eventId: string; ghostEnd: Date }
  | { kind: 'create'; ghostStart: Date; ghostEnd: Date; dayIndex: number };

/** Telemetry payload — reserved for future analytics integrations. */
export type CalendarTelemetry =
  | { type: 'view-change'; view: View }
  | { type: 'nav'; date: Date; direction: 'prev' | 'next' | 'today' }
  | { type: 'event-click'; eventId: string }
  | { type: 'event-create'; start: Date; end: Date }
  | { type: 'event-update'; eventId: string }
  | { type: 'event-delete'; eventId: string };

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
  /** Fired after a drag-create gesture commits. */
  onEventCreate?: (range: { start: Date; end: Date }) => void | Promise<void>;
  /** Fired after a drag-move or resize gesture commits. */
  onEventUpdate?: (event: Event) => void | Promise<void>;
  /** Fired from the popover's delete-confirm. */
  onEventDelete?: (id: string) => void | Promise<void>;

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
