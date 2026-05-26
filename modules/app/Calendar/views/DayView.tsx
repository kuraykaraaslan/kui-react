'use client';
import { cn } from '@/libs/utils/cn';
import type { Event, WorkingHours } from '../types';
import { EventCard } from '../parts/EventCard';
import { TimeGrid } from '../parts/TimeGrid';
import { eventOnDay, isSameDay } from '../date-utils';
import type { LocaleBundle } from '../locale';

type DayViewProps = {
  date: Date;
  events: Event[];
  locale: LocaleBundle;
  today: Date;
  workingHours?: WorkingHours;
  slotMinutes?: 5 | 15 | 30 | 60;
  onEventClick?: (e: Event) => void;
};

export function DayView({
  date,
  events,
  locale,
  today,
  workingHours,
  slotMinutes,
  onEventClick,
}: DayViewProps) {
  const allDay = events.filter((e) => e.allDay && eventOnDay(e, date));
  const isToday = isSameDay(date, today);

  return (
    <div
      role="region"
      aria-label={`${locale.dayLong[date.getDay()]} ${date.getDate()} ${locale.monthNames[date.getMonth()]} ${date.getFullYear()}`}
      className="flex flex-col w-full"
    >
      {/* Header */}
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] border-b border-border bg-surface-raised">
        <div aria-hidden="true" />
        <div className="px-3 py-2 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            {locale.dayLong[date.getDay()]}
          </span>
          <span
            className={cn(
              'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold tabular-nums',
              isToday ? 'bg-primary text-primary-fg' : 'text-text-primary',
            )}
          >
            {date.getDate()}
          </span>
        </div>
      </div>

      {/* All-day strip */}
      {allDay.length > 0 && (
        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] border-b border-border bg-surface-base">
          <div className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary text-right border-r border-border">
            {locale.messages.allDay}
          </div>
          <div className="p-1 flex flex-col gap-0.5 min-h-[28px]">
            {allDay.map((e) => (
              <EventCard key={e.id} event={e} variant="bar" onClick={onEventClick} />
            ))}
          </div>
        </div>
      )}

      <TimeGrid
        days={[date]}
        events={events}
        workingHours={workingHours}
        slotMinutes={slotMinutes}
        onEventClick={onEventClick}
      />
    </div>
  );
}
