'use client';
import { useMemo, useRef, useState, useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import type { CalendarProps, View } from './types';
import { HeaderBar } from './parts/HeaderBar';
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
} from './date-utils';
import { mergeMessages, resolveLocale } from './locale';
import { useKeyboardNav } from './hooks/useKeyboardNav';

export type { CalendarProps, Event, View, Resource, EventColor, CalendarMessages, WorkingHours, CalendarTelemetry, CalendarHandle } from './types';

export function Calendar({
  events,
  view = 'month',
  defaultDate,
  onViewChange,
  onDateChange,
  onEventClick,
  locale,
  messages: messageOverrides,
  workingHours,
  slotMinutes = 30,
  onTelemetry,
  className,
  // The following props are accepted but only meaningful in later milestones:
  // resources, calendars, recurrence, timezone, reducedMotion.
}: CalendarProps) {
  const localeBundle = useMemo(() => resolveLocale(locale), [locale]);
  const messages = useMemo(
    () => mergeMessages(localeBundle.messages, messageOverrides),
    [localeBundle, messageOverrides],
  );

  const [internalDate, setInternalDate] = useState<Date>(() => defaultDate ?? new Date());
  const today = useMemo(() => new Date(), []);
  const rootRef = useRef<HTMLDivElement>(null);

  // Period label, e.g. "May 2026" / "Mayıs 2026" / "5 — 11 Mayıs 2026" / "5 Mayıs 2026"
  const periodLabel = useMemo(() => {
    const d = internalDate;
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
    // day
    return `${d.getDate()} ${monthName} ${d.getFullYear()}`;
  }, [view, internalDate, localeBundle]);

  const setDate = useCallback(
    (next: Date, direction: 'prev' | 'next' | 'today') => {
      setInternalDate(next);
      onDateChange?.(next);
      onTelemetry?.({ type: 'nav', date: next, direction });
    },
    [onDateChange, onTelemetry],
  );

  const goPrev = useCallback(() => {
    if (view === 'month' || view === 'agenda' || view === 'resource') {
      setDate(addMonths(internalDate, -1), 'prev');
    } else if (view === 'week') {
      setDate(addDays(internalDate, -7), 'prev');
    } else {
      setDate(addDays(internalDate, -1), 'prev');
    }
  }, [view, internalDate, setDate]);

  const goNext = useCallback(() => {
    if (view === 'month' || view === 'agenda' || view === 'resource') {
      setDate(addMonths(internalDate, 1), 'next');
    } else if (view === 'week') {
      setDate(addDays(internalDate, 7), 'next');
    } else {
      setDate(addDays(internalDate, 1), 'next');
    }
  }, [view, internalDate, setDate]);

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
    (e: Parameters<NonNullable<CalendarProps['onEventClick']>>[0]) => {
      onEventClick?.(e);
      onTelemetry?.({ type: 'event-click', eventId: e.id });
    },
    [onEventClick, onTelemetry],
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
          date={internalDate}
          events={events}
          locale={{ ...localeBundle, messages }}
          today={today}
          onEventClick={handleEventClick}
        />
      )}
      {view === 'week' && (
        <WeekView
          date={internalDate}
          events={events}
          locale={{ ...localeBundle, messages }}
          today={today}
          workingHours={workingHours}
          slotMinutes={slotMinutes}
          onEventClick={handleEventClick}
        />
      )}
      {view === 'day' && (
        <DayView
          date={internalDate}
          events={events}
          locale={{ ...localeBundle, messages }}
          today={today}
          workingHours={workingHours}
          slotMinutes={slotMinutes}
          onEventClick={handleEventClick}
        />
      )}
      {view === 'agenda' && <AgendaView />}
      {view === 'resource' && <ResourceView />}
    </div>
  );
}
