'use client';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import type { CalendarProps, View } from './types';
import { HeaderBar } from './parts/HeaderBar';
import { EventPopover } from './parts/EventPopover';
import { MonthView } from './views/MonthView';
import { WeekView } from './views/WeekView';
import { DayView } from './views/DayView';
import { AgendaView } from './views/AgendaView';
import { ResourceView } from './views/ResourceView';
import {
  addDays,
  addMonths,
  endOfWeek,
  startOfWeek,
  visibleWindow,
} from './date-utils';
import { mergeMessages, resolveLocale } from './locale';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useRecurrence } from './hooks/useRecurrence';
import {
  CalendarStoreProvider,
  createCalendarStore,
  useCalStore,
  type CalendarStoreHook,
} from './store';

export type {
  CalendarProps,
  Event,
  EventOccurrence,
  View,
  Resource,
  EventColor,
  CalendarMessages,
  WorkingHours,
  CalendarTelemetry,
  CalendarHandle,
} from './types';

export function Calendar(props: CalendarProps) {
  // One store per <Calendar> instance — ref keeps it stable across re-renders.
  const storeRef = useRef<CalendarStoreHook | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createCalendarStore({
      date: props.defaultDate ?? new Date(),
      view: props.view ?? 'month',
    });
  }

  // Reflect controlled `view` prop into the store.
  useEffect(() => {
    if (props.view) storeRef.current?.getState().setView(props.view);
  }, [props.view]);

  return (
    <CalendarStoreProvider store={storeRef.current}>
      <CalendarInner {...props} />
    </CalendarStoreProvider>
  );
}

function CalendarInner({
  events,
  view = 'month',
  onViewChange,
  onDateChange,
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  locale,
  messages: messageOverrides,
  workingHours,
  slotMinutes = 30,
  onTelemetry,
  className,
  // resources, calendars, recurrence, timezone, reducedMotion → M3–M6
}: CalendarProps) {
  const date = useCalStore((s) => s.date);
  const setStoreDate = useCalStore((s) => s.setDate);
  const openPopover = useCalStore((s) => s.openPopover);

  const localeBundle = useMemo(() => resolveLocale(locale), [locale]);
  const messages = useMemo(
    () => mergeMessages(localeBundle.messages, messageOverrides),
    [localeBundle, messageOverrides],
  );

  const today = useMemo(() => new Date(), []);
  const rootRef = useRef<HTMLDivElement>(null);

  const [windowStart, windowEnd] = useMemo(
    () => visibleWindow(view, date, localeBundle.weekStart),
    [view, date, localeBundle.weekStart],
  );
  const visibleEvents = useRecurrence(events, windowStart, windowEnd);

  // Period label, e.g. "May 2026" / "Mayıs 2026" / "5 — 11 Mayıs 2026" / "5 Mayıs 2026"
  const periodLabel = useMemo(() => {
    const d = date;
    const monthName = localeBundle.monthNames[d.getMonth()];
    if (view === 'month' || view === 'agenda' || view === 'resource') {
      return `${monthName} ${d.getFullYear()}`;
    }
    if (view === 'week') {
      const s = startOfWeek(d, localeBundle.weekStart);
      const e = endOfWeek(d, localeBundle.weekStart);
      const sameMonth = s.getMonth() === e.getMonth();
      if (sameMonth) {
        return `${s.getDate()} – ${e.getDate()} ${localeBundle.monthNames[s.getMonth()]} ${s.getFullYear()}`;
      }
      return `${s.getDate()} ${localeBundle.monthNames[s.getMonth()]} – ${e.getDate()} ${localeBundle.monthNames[e.getMonth()]} ${e.getFullYear()}`;
    }
    return `${d.getDate()} ${monthName} ${d.getFullYear()}`;
  }, [view, date, localeBundle]);

  const setDate = useCallback(
    (next: Date, direction: 'prev' | 'next' | 'today') => {
      setStoreDate(next);
      onDateChange?.(next);
      onTelemetry?.({ type: 'nav', date: next, direction });
    },
    [setStoreDate, onDateChange, onTelemetry],
  );

  const goPrev = useCallback(() => {
    if (view === 'month' || view === 'agenda' || view === 'resource') {
      setDate(addMonths(date, -1), 'prev');
    } else if (view === 'week') {
      setDate(addDays(date, -7), 'prev');
    } else {
      setDate(addDays(date, -1), 'prev');
    }
  }, [view, date, setDate]);

  const goNext = useCallback(() => {
    if (view === 'month' || view === 'agenda' || view === 'resource') {
      setDate(addMonths(date, 1), 'next');
    } else if (view === 'week') {
      setDate(addDays(date, 7), 'next');
    } else {
      setDate(addDays(date, 1), 'next');
    }
  }, [view, date, setDate]);

  const goToday = useCallback(() => {
    setDate(new Date(), 'today');
  }, [setDate]);

  const handleViewChange = useCallback(
    (v: View) => {
      onViewChange?.(v);
      onTelemetry?.({ type: 'view-change', view: v });
    },
    [onViewChange, onTelemetry],
  );

  const handleEventClick = useCallback(
    (event: Parameters<NonNullable<CalendarProps['onEventClick']>>[0], rect?: DOMRect) => {
      if (rect) openPopover(event, rect);
      onEventClick?.(event);
      onTelemetry?.({ type: 'event-click', eventId: event.id });
    },
    [openPopover, onEventClick, onTelemetry],
  );

  useKeyboardNav({ rootRef, onPrev: goPrev, onNext: goNext, onToday: goToday });

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className={cn(
        'flex flex-col w-full rounded-lg border border-border bg-surface-base overflow-hidden',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
      aria-label="Calendar"
    >
      <HeaderBar
        label={periodLabel}
        view={view}
        onViewChange={handleViewChange}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        messages={messages}
      />

      {view === 'month' && (
        <MonthView
          date={date}
          events={visibleEvents}
          locale={{ ...localeBundle, messages }}
          today={today}
          onEventClick={handleEventClick}
        />
      )}
      {view === 'week' && (
        <WeekView
          date={date}
          events={visibleEvents}
          locale={{ ...localeBundle, messages }}
          today={today}
          workingHours={workingHours}
          slotMinutes={slotMinutes}
          onEventClick={handleEventClick}
          onEventCreate={onEventCreate}
          onEventUpdate={onEventUpdate}
          onTelemetry={onTelemetry}
        />
      )}
      {view === 'day' && (
        <DayView
          date={date}
          events={visibleEvents}
          locale={{ ...localeBundle, messages }}
          today={today}
          workingHours={workingHours}
          slotMinutes={slotMinutes}
          onEventClick={handleEventClick}
          onEventCreate={onEventCreate}
          onEventUpdate={onEventUpdate}
          onTelemetry={onTelemetry}
        />
      )}
      {view === 'agenda' && <AgendaView />}
      {view === 'resource' && <ResourceView />}

      <EventPopover
        messages={messages}
        onEventUpdate={onEventUpdate}
        onEventDelete={onEventDelete}
        onTelemetry={onTelemetry}
      />
    </div>
  );
}
