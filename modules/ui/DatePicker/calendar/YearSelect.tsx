'use client';
// modules/ui/DatePicker/calendar/YearSelect.tsx
//
// Quick year picker — shown when the user clicks the year in the calendar
// header. Renders a vertical scrollable list (current year ±10 by default).
//
// TODO M6: full decade view + paging like Airbnb / Google Calendar.

import { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils/cn';
import { yearRange } from '../hooks/useDateFns';

type YearSelectProps = {
  value: number;
  min?: Date;
  max?: Date;
  onSelect: (year: number) => void;
};

export function YearSelect({ value, min, max, onSelect }: YearSelectProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const years = yearRange(value, 10);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div
      className="max-h-56 overflow-y-auto p-2"
      role="listbox"
      aria-label="Year"
    >
      <div className="grid grid-cols-3 gap-1.5">
        {years.map((y) => {
          const disabled =
            (min && y < min.getFullYear()) || (max && y > max.getFullYear());
          const active = y === value;
          return (
            <button
              key={y}
              ref={active ? activeRef : undefined}
              type="button"
              role="option"
              aria-selected={active}
              disabled={!!disabled}
              onClick={() => onSelect(y)}
              className={cn(
                'rounded-md px-2 py-1.5 text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                active
                  ? 'bg-primary text-primary-fg'
                  : 'text-text-primary hover:bg-surface-overlay',
              )}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}
