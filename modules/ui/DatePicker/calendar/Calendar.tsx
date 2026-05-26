'use client';
// modules/ui/DatePicker/calendar/Calendar.tsx
//
// Single-month calendar grid — used by both DatePicker (one Calendar) and
// DateRangePicker (two Calendars side-by-side).
//
// M1 scope: locale-aware grid, min/max/disabledDates, keyboard navigation,
// quick month/year picker via the header.
//
// TODO M2: range selection visuals (start, in-range, end).
// TODO M5: full ARIA grid pattern with row/col headers and live region.

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import {
  addMonths,
  buildMonthGrid,
  clampToBounds,
  isDisabled,
  isSameDay,
  isSameMonth,
  isWithinBounds,
  startOfDay,
} from '../hooks/useDateFns';
import { handleCalendarKey } from '../hooks/useKeyboardNav';
import { MonthSelect } from './MonthSelect';
import { YearSelect } from './YearSelect';
import type { DatePickerLocale, DisabledDates } from '../types';

type CalendarProps = {
  /** Currently visible month (any day inside it works). */
  month: Date;
  /** Selected date — drawn with the active styling. */
  selected: Date | null;
  /** Optional secondary highlight — start of a range (TODO M2: in-range). */
  rangeStart?: Date | null;
  /** Optional secondary highlight — end of a range. */
  rangeEnd?: Date | null;
  /** Notify parent when a day is picked. */
  onSelect: (d: Date) => void;
  /** Notify parent when the visible month changes (chevrons / quick pickers). */
  onMonthChange?: (next: Date) => void;
  /** Locale (TR / EN). */
  locale: DatePickerLocale;
  /** Hide the chevron header (e.g. when used as the right pane of a range). */
  hidePrevButton?: boolean;
  hideNextButton?: boolean;
  min?: Date;
  max?: Date;
  disabledDates?: DisabledDates;
  /** Optional accessible label override for the whole calendar grid. */
  ariaLabel?: string;
  /** Compact mode for popovers (default true). */
  compact?: boolean;
  className?: string;
};

type HeaderView = 'days' | 'months' | 'years';

export function Calendar({
  month,
  selected,
  rangeStart,
  rangeEnd,
  onSelect,
  onMonthChange,
  locale,
  hidePrevButton,
  hideNextButton,
  min,
  max,
  disabledDates,
  ariaLabel,
  compact = true,
  className,
}: CalendarProps) {
  const today = startOfDay(new Date());
  const [view, setView] = useState<HeaderView>('days');
  const [focus, setFocus] = useState<Date>(() => clampToBounds(selected ?? month, min, max));
  const gridRef = useRef<HTMLDivElement | null>(null);
  const captionId = useId();

  // Keep focus inside the visible month when the parent flips months.
  useEffect(() => {
    if (!isSameMonth(focus, month)) {
      setFocus(clampToBounds(new Date(month.getFullYear(), month.getMonth(), Math.min(focus.getDate(), 28)), min, max));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month.getFullYear(), month.getMonth()]);

  const goMonth = useCallback(
    (delta: number) => {
      const next = addMonths(month, delta);
      onMonthChange?.(next);
    },
    [month, onMonthChange],
  );

  const grid = buildMonthGrid(month.getFullYear(), month.getMonth(), locale.weekStartsOn);

  // Weekday header — locale-aware reorder.
  const weekdays: string[] = [];
  for (let i = 0; i < 7; i++) {
    weekdays.push(locale.weekdaysShort[(i + locale.weekStartsOn) % 7]);
  }

  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const r = handleCalendarKey(e, {
      current: focus,
      weekStartsOn: locale.weekStartsOn,
      min,
      max,
      disabledDates,
    });
    if (!r) return;
    setFocus(r.focus);
    if (r.monthChanged) onMonthChange?.(r.focus);
    if (r.shouldSelect) onSelect(r.focus);
  }

  function renderHeader() {
    return (
      <div className="flex items-center justify-between px-2 pt-2 pb-1">
        {!hidePrevButton ? (
          <button
            type="button"
            onClick={() => goMonth(-1)}
            aria-label={locale.messages.prevMonth}
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md',
              'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <span className="h-7 w-7" aria-hidden="true" />
        )}

        <div className="flex items-center gap-1 text-sm font-medium text-text-primary" id={captionId}>
          <button
            type="button"
            onClick={() => setView(view === 'months' ? 'days' : 'months')}
            className={cn(
              'rounded-md px-2 py-1 hover:bg-surface-overlay',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              view === 'months' && 'bg-surface-overlay',
            )}
            aria-haspopup="listbox"
            aria-expanded={view === 'months'}
          >
            {locale.months[month.getMonth()]}
          </button>
          <button
            type="button"
            onClick={() => setView(view === 'years' ? 'days' : 'years')}
            className={cn(
              'rounded-md px-2 py-1 hover:bg-surface-overlay',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              view === 'years' && 'bg-surface-overlay',
            )}
            aria-haspopup="listbox"
            aria-expanded={view === 'years'}
          >
            {month.getFullYear()}
          </button>
        </div>

        {!hideNextButton ? (
          <button
            type="button"
            onClick={() => goMonth(1)}
            aria-label={locale.messages.nextMonth}
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md',
              'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <span className="h-7 w-7" aria-hidden="true" />
        )}
      </div>
    );
  }

  function renderGrid() {
    return (
      <div
        ref={gridRef}
        role="grid"
        aria-labelledby={captionId}
        aria-label={ariaLabel ?? locale.messages.dialogLabel}
        tabIndex={0}
        onKeyDown={onKey}
        className={cn(
          'px-2 pb-2 outline-none',
          'focus-visible:ring-2 focus-visible:ring-border-focus rounded-md',
        )}
      >
        <div className="grid grid-cols-7 gap-0.5" role="row">
          {weekdays.map((w, i) => (
            <div
              key={`wd-${i}`}
              role="columnheader"
              className="py-1 text-center text-[11px] font-medium uppercase tracking-wide text-text-secondary"
            >
              {w}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-0.5">
          {grid.map((d) => {
            const inMonth = isSameMonth(d, month);
            const disabled = isDisabled(d, disabledDates, min, max);
            const isSelected = isSameDay(d, selected);
            const isToday = isSameDay(d, today);
            const isFocus = isSameDay(d, focus) && inMonth;
            const isStart = isSameDay(d, rangeStart);
            const isEnd = isSameDay(d, rangeEnd);
            // TODO M2: compute in-range visual when both ends defined.

            return (
              <button
                key={d.toISOString()}
                type="button"
                role="gridcell"
                aria-selected={isSelected || isStart || isEnd}
                aria-disabled={disabled}
                tabIndex={isFocus ? 0 : -1}
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  setFocus(d);
                  onSelect(d);
                }}
                className={cn(
                  'relative inline-flex items-center justify-center rounded-md text-sm transition-colors',
                  compact ? 'h-8 w-8' : 'h-9 w-9',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                  !inMonth && 'text-text-disabled',
                  inMonth && !disabled && !isSelected && !isStart && !isEnd && 'text-text-primary hover:bg-surface-overlay',
                  disabled && 'opacity-40 cursor-not-allowed',
                  (isSelected || isStart || isEnd) && 'bg-primary text-primary-fg hover:bg-primary-hover',
                  isToday && !isSelected && !isStart && !isEnd && 'ring-1 ring-inset ring-primary',
                )}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-end px-1">
          <button
            type="button"
            onClick={() => {
              const target = clampToBounds(today, min, max);
              if (!isWithinBounds(target, min, max)) return;
              setFocus(target);
              onMonthChange?.(target);
              if (!isDisabled(target, disabledDates, min, max)) onSelect(target);
            }}
            className={cn(
              'rounded-md px-2 py-1 text-xs font-medium text-primary',
              'hover:bg-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
          >
            {locale.messages.today}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'select-none',
        compact ? 'w-[15.5rem]' : 'w-[18rem]',
        className,
      )}
    >
      {renderHeader()}
      {view === 'days' && renderGrid()}
      {view === 'months' && (
        <MonthSelect
          value={month.getMonth()}
          locale={locale}
          onSelect={(m) => {
            const next = new Date(month.getFullYear(), m, 1);
            onMonthChange?.(next);
            setView('days');
          }}
        />
      )}
      {view === 'years' && (
        <YearSelect
          value={month.getFullYear()}
          min={min}
          max={max}
          onSelect={(y) => {
            const next = new Date(y, month.getMonth(), 1);
            onMonthChange?.(next);
            setView('days');
          }}
        />
      )}
    </div>
  );
}
