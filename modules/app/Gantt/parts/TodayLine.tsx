'use client';
import { cn } from '@/libs/utils/cn';
import { diffDays } from '../hooks/useTimelineScale';

type TodayLineProps = {
  rangeStart: Date;
  rangeEnd: Date;
  pixelsPerDay: number;
  totalHeight: number;
};

/**
 * Vertical "today" indicator. Uses `var(--warning)` for high contrast in
 * both light and dark themes — matches MS Project / Smartsheet conventions.
 */
export function TodayLine({ rangeStart, rangeEnd, pixelsPerDay, totalHeight }: TodayLineProps) {
  const today = new Date();
  if (today < rangeStart || today > rangeEnd) return null;

  const left = diffDays(rangeStart, today) * pixelsPerDay;
  return (
    <div
      aria-hidden="true"
      className={cn('gantt-today-line absolute top-0 pointer-events-none z-10')}
      style={{
        left,
        height: totalHeight,
        width: 2,
        backgroundColor: 'var(--warning)',
      }}
    />
  );
}
