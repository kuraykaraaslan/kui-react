'use client';
// modules/ui/DatePicker/calendar/MonthSelect.tsx
//
// Quick month picker — shown when the user clicks the month name in the
// calendar header. Renders a 4×3 grid of month buttons.
//
// TODO M3: support keyboard nav between month tiles (arrow keys).

import { cn } from '@/libs/utils/cn';
import type { DatePickerLocale } from '../types';

type MonthSelectProps = {
  /** 0–11 — currently visible month. */
  value: number;
  /** Locale provides month names. */
  locale: DatePickerLocale;
  onSelect: (month: number) => void;
};

export function MonthSelect({ value, locale, onSelect }: MonthSelectProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-2" role="listbox" aria-label="Month">
      {locale.months.map((name, idx) => {
        const active = idx === value;
        return (
          <button
            key={name}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => onSelect(idx)}
            className={cn(
              'rounded-md px-2 py-1.5 text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              active
                ? 'bg-primary text-primary-fg'
                : 'text-text-primary hover:bg-surface-overlay',
            )}
          >
            {locale.monthsShort[idx]}
          </button>
        );
      })}
    </div>
  );
}
