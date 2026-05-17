'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

type ItineraryDayCardProps = {
  dayNumber: number;
  date: Date | string;
  city: string;
  summary?: string;
  itemCount: number;
  totalDurationHours?: number;
  className?: string;
};

function dateLabel(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function ItineraryDayCard({
  dayNumber,
  date,
  city,
  summary,
  itemCount,
  totalDurationHours,
  className,
}: ItineraryDayCardProps) {
  return (
    <section
      className={cn(
        'flex items-center gap-4 rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
      aria-label={`Day ${dayNumber}: ${city}`}
    >
      <span
        className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-fg"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase font-semibold tracking-wide opacity-80">Day</span>
        <span className="text-2xl font-extrabold leading-none">{dayNumber}</span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-base font-bold text-text-primary">{city}</h3>
          <time
            className="text-xs text-text-secondary inline-flex items-center gap-1 tabular-nums"
            dateTime={new Date(date).toISOString()}
          >
            <FontAwesomeIcon icon={faCalendarDay} className="w-3 h-3" aria-hidden="true" />
            {dateLabel(date)}
          </time>
        </div>
        {summary && (
          <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">{summary}</p>
        )}
        <p className="mt-1 text-xs text-text-secondary tabular-nums">
          {itemCount} stop{itemCount === 1 ? '' : 's'}
          {totalDurationHours !== undefined && ` · ~${totalDurationHours}h`}
        </p>
      </div>
    </section>
  );
}
