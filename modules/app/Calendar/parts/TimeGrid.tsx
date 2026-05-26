'use client';
import { cn } from '@/libs/utils/cn';
import type { Event, WorkingHours } from '../types';
import { EVENT_COLOR_CLASSES, resolveColor } from '../colors';
import { fmtTime, isSameDay, minutesIntoDay } from '../date-utils';

const HOUR_HEIGHT = 48; // px per hour — keep aligned across NextJS/EJS
const MIN_EVENT_HEIGHT = 18;

type TimeGridProps = {
  /** Days rendered as columns. Length 1 (day view) or 7 (week view). */
  days: Date[];
  /** Timed (non-all-day) events. */
  events: Event[];
  workingHours?: WorkingHours;
  /** Slot granularity — visual hint only in M1. */
  slotMinutes?: 5 | 15 | 30 | 60;
  onEventClick?: (e: Event) => void;
};

export function TimeGrid({ days, events, workingHours, onEventClick }: TimeGridProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const totalHeight = 24 * HOUR_HEIGHT;

  return (
    <div className="flex w-full overflow-x-auto" role="region" aria-label="Time grid">
      {/* Hour gutter */}
      <div className="shrink-0 w-14 border-r border-border bg-surface-base">
        <div className="h-8" aria-hidden="true" />
        {hours.map((h) => (
          <div
            key={h}
            style={{ height: HOUR_HEIGHT }}
            className="text-[10px] text-text-secondary text-right pr-2 -mt-2 pt-0"
          >
            {h === 0 ? '' : `${String(h).padStart(2, '0')}:00`}
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="flex-1 flex min-w-0">
        {days.map((day) => {
          const dayEvents = events.filter((e) => !e.allDay && isSameDay(e.start, day));
          const isWorkingDay = workingHours?.days.includes(day.getDay()) ?? true;
          return (
            <div
              key={day.toISOString()}
              className="flex-1 min-w-0 border-r border-border last:border-r-0 relative"
            >
              {/* Header */}
              <div className="h-8 border-b border-border bg-surface-raised flex items-center justify-center text-xs font-medium text-text-secondary">
                {fmtTime(day) /* never used — actual header lives in WeekView */}
              </div>

              {/* Slot lines + working-hours shading */}
              <div className="relative" style={{ height: totalHeight }}>
                {hours.map((h) => {
                  const inWorking =
                    isWorkingDay &&
                    workingHours &&
                    h >= workingHours.start &&
                    h < workingHours.end;
                  return (
                    <div
                      key={h}
                      style={{ height: HOUR_HEIGHT }}
                      className={cn(
                        'border-b border-border/60',
                        inWorking ? 'bg-surface-base' : 'bg-surface-raised/60',
                      )}
                    />
                  );
                })}

                {/* Events absolutely positioned */}
                {dayEvents.map((e) => {
                  const startMin = minutesIntoDay(e.start);
                  const endMin = Math.min(24 * 60, minutesIntoDay(e.end) || 24 * 60);
                  const top = (startMin / 60) * HOUR_HEIGHT;
                  const height = Math.max(MIN_EVENT_HEIGHT, ((endMin - startMin) / 60) * HOUR_HEIGHT);
                  const color = resolveColor(e.color);
                  const styles = EVENT_COLOR_CLASSES[color];
                  return (
                    <button
                      key={e.id}
                      type="button"
                      data-event-id={e.id}
                      aria-label={`${e.title} ${fmtTime(e.start)} – ${fmtTime(e.end)}`}
                      onClick={() => onEventClick?.(e)}
                      style={{ top, height, left: 4, right: 4 }}
                      className={cn(
                        'absolute rounded-md px-2 py-1 text-left text-[11px] leading-tight overflow-hidden',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                        styles.pill,
                      )}
                    >
                      <div className="font-semibold truncate">{e.title}</div>
                      <div className="opacity-80 text-[10px] tabular-nums">
                        {fmtTime(e.start)} – {fmtTime(e.end)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
