'use client';
// modules/ui/DatePicker/index.tsx
//
// Public surface for the DatePicker suite.
//
//   <DatePicker>       — single date selection, popover variant (M1).
//   <DateRangePicker>  — two-month range; M1 keeps existing native-input API
//                        but adds an optional `calendar` popover behind the
//                        same prop names so consumers (FilterBar) don't need
//                        to change. The new popover renders 2 Calendars
//                        side-by-side.
//   <DateTimePicker>   — STUB for M4. Currently aliases DatePicker.
//
// All three components share the same Calendar core in ./calendar/Calendar.
//
// TODO M2: range visuals + presets.
// TODO M3: input-mask + locale-aware typing.
// TODO M4: DateTimePicker — add hour/minute/second slider (TimeStrip).
// TODO M5: BottomSheet variant for touch devices.
// TODO M6: numberOfMonths 1|2|3 + decade view + Hijri toggle.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Calendar } from './calendar/Calendar';
import { PresetList } from './parts/PresetList';
import { Trigger } from './parts/Trigger';
import {
  addMonths,
  clampToBounds,
  formatDate,
  isBefore,
  isDisabled,
  isSameMonth,
  resolveLocale,
  startOfDay,
  startOfMonth,
} from './hooks/useDateFns';
import type {
  DatePickerMessages,
  DatePickerProps,
  DateRange,
  DateRangePickerProps,
  DateTimePickerProps,
} from './types';

// Re-export types so callers can `import type { DateRange } from
// '@/modules/ui/DatePicker'`.
export type {
  DatePickerProps,
  DateRangePickerProps,
  DateTimePickerProps,
  DateRange,
  DateValue,
  LocaleCode,
  DatePickerMessages,
  DatePickerLocale,
  DisabledDates,
} from './types';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function mergeMessages(
  base: DatePickerMessages,
  override?: Partial<DatePickerMessages>,
): DatePickerMessages {
  return override ? { ...base, ...override } : base;
}

/**
 * Tiny click-outside helper — closes the popover when a click lands outside
 * the wrapper element.
 */
function useDismissOnOutside(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const node = ref.current;
      if (!node) return;
      if (e.target instanceof Node && node.contains(e.target)) return;
      onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, ref]);
}

// ---------------------------------------------------------------------------
// DatePicker — single date
// ---------------------------------------------------------------------------

export function DatePicker({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  disabled,
  required,
  min,
  max,
  disabledDates,
  locale: localeCode,
  format,
  messages,
  variant = 'popover',
  className,
  name,
}: DatePickerProps) {
  const reactId = useId();
  const baseId = id ?? `dp-${reactId}`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const popoverId = `${baseId}-popover`;

  const locale = resolveLocale(localeCode);
  const msgs = mergeMessages(locale.messages, messages);
  const fmt = format ?? locale.displayFormat;

  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    startOfMonth(value ?? clampToBounds(new Date(), min, max)),
  );

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useDismissOnOutside(wrapperRef, open, () => setOpen(false));

  // Sync visible month when an external value lands outside it.
  useEffect(() => {
    if (value && !isSameMonth(value, visibleMonth)) {
      setVisibleMonth(startOfMonth(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.getTime()]);

  const display = formatDate(value, fmt);

  const handleSelect = useCallback(
    (d: Date) => {
      if (isDisabled(d, disabledDates, min, max)) return;
      onChange(startOfDay(d));
      setOpen(false);
    },
    [disabledDates, min, max, onChange],
  );

  // TODO M5: switch to portal+positioning library for fixed-strategy popover.
  return (
    <div ref={wrapperRef} className={cn('relative space-y-1', className)} data-testid={`datepicker-${baseId}`}>
      {label ? (
        <label htmlFor={baseId} className="block text-sm font-medium text-text-primary">
          {label}
          {required ? (
            <>
              <span className="text-error ml-1" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </>
          ) : null}
        </label>
      ) : null}

      <Trigger
        display={display}
        placeholder={msgs.placeholder}
        open={open}
        disabled={disabled}
        invalid={!!error}
        showClear={!!value}
        clearLabel={msgs.clear}
        onToggle={() => setOpen((o) => !o)}
        onClear={() => onChange(null)}
        controlsId={popoverId}
        ariaLabel={label}
        ariaDescribedBy={describedBy}
        required={required}
        testId={`datepicker-${baseId}-trigger`}
      />

      {name ? <input type="hidden" name={name} value={display} /> : null}

      {open && variant === 'popover' ? (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="false"
          aria-label={msgs.dialogLabel}
          className={cn(
            'absolute z-30 mt-1 rounded-lg border border-border bg-surface-raised shadow-lg',
            'p-1',
          )}
        >
          <PresetList />
          <Calendar
            month={visibleMonth}
            selected={value ?? null}
            onSelect={handleSelect}
            onMonthChange={(m) => setVisibleMonth(startOfMonth(m))}
            locale={locale}
            min={min}
            max={max}
            disabledDates={disabledDates}
            ariaLabel={msgs.dialogLabel}
          />
        </div>
      ) : null}

      {hint && !error ? (
        <p id={hintId} className="text-xs text-text-secondary">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-error" role="alert">{error}</p>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DateRangePicker — start + end with two side-by-side calendars
// ---------------------------------------------------------------------------

function normaliseRange(r: DateRange | null | undefined): DateRange {
  return { start: r?.start ?? null, end: r?.end ?? null };
}

export function DateRangePicker({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  disabled,
  required,
  min,
  max,
  disabledDates,
  locale: localeCode,
  format,
  messages,
  variant = 'popover',
  className,
}: DateRangePickerProps) {
  const reactId = useId();
  const baseId = id ?? `dr-${reactId}`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const popoverId = `${baseId}-popover`;

  const locale = resolveLocale(localeCode);
  const msgs = mergeMessages(locale.messages, messages);
  const fmt = format ?? locale.displayFormat;

  const range = normaliseRange(value);
  const [open, setOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState<Date>(() =>
    startOfMonth(range.start ?? clampToBounds(new Date(), min, max)),
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useDismissOnOutside(wrapperRef, open, () => setOpen(false));

  // M1: simple two-tap selection — first click sets start, second sets end.
  // Resets to a new start when the user picks before the current start or
  // the range is already complete. TODO M2: in-range highlight & preview.

  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const startStr = formatDate(range.start, fmt);
  const endStr = formatDate(range.end, fmt);
  const display = range.start || range.end
    ? `${startStr || msgs.placeholder}  →  ${endStr || msgs.placeholder}`
    : '';

  const handleSelect = useCallback(
    (d: Date) => {
      if (isDisabled(d, disabledDates, min, max)) return;
      const day = startOfDay(d);
      if (!range.start || (range.start && range.end)) {
        onChange({ start: day, end: null });
        return;
      }
      // We have a start, no end. If user clicked before start, restart.
      if (isBefore(day, range.start)) {
        onChange({ start: day, end: null });
        return;
      }
      onChange({ start: range.start, end: day });
      setOpen(false);
    },
    [range.start, range.end, disabledDates, min, max, onChange],
  );

  return (
    <div ref={wrapperRef} className={cn('relative space-y-1', className)} data-testid={`daterangepicker-${baseId}`}>
      {label ? (
        <span className="block text-sm font-medium text-text-primary">
          {label}
          {required ? (
            <>
              <span className="text-error ml-1" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </>
          ) : null}
        </span>
      ) : null}

      <Trigger
        display={display}
        placeholder={`${msgs.placeholder}  →  ${msgs.placeholder}`}
        open={open}
        disabled={disabled}
        invalid={!!error}
        showClear={!!(range.start || range.end)}
        clearLabel={msgs.clear}
        onToggle={() => setOpen((o) => !o)}
        onClear={() => onChange({ start: null, end: null })}
        controlsId={popoverId}
        ariaLabel={label}
        ariaDescribedBy={describedBy}
        required={required}
        testId={`daterangepicker-${baseId}-trigger`}
      />

      {open && variant === 'popover' ? (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="false"
          aria-label={msgs.dialogLabel}
          className={cn(
            'absolute z-30 mt-1 rounded-lg border border-border bg-surface-raised shadow-lg p-1',
            'flex',
          )}
        >
          <PresetList />
          <Calendar
            month={leftMonth}
            selected={range.start ?? null}
            rangeStart={range.start ?? null}
            rangeEnd={range.end ?? null}
            onSelect={handleSelect}
            onMonthChange={(m) => setLeftMonth(startOfMonth(m))}
            locale={locale}
            min={min}
            max={max}
            disabledDates={disabledDates}
            hideNextButton
            ariaLabel={msgs.dialogLabel}
          />
          <Calendar
            month={rightMonth}
            selected={range.end ?? null}
            rangeStart={range.start ?? null}
            rangeEnd={range.end ?? null}
            onSelect={handleSelect}
            onMonthChange={(m) => setLeftMonth(startOfMonth(addMonths(m, -1)))}
            locale={locale}
            min={min}
            max={max}
            disabledDates={disabledDates}
            hidePrevButton
            ariaLabel={msgs.dialogLabel}
          />
        </div>
      ) : null}

      {hint && !error ? (
        <p id={hintId} className="text-xs text-text-secondary">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-error" role="alert">{error}</p>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DateTimePicker — stub
// ---------------------------------------------------------------------------

// TODO M4: real DateTimePicker with hour/minute (+ optional seconds) +
// 12h/24h locale-aware + timezone-aware value vs display.
export function DateTimePicker(props: DateTimePickerProps) {
  // For now we just render the date-only picker so consumers can adopt the
  // type today and we can swap the impl in M4 without breaking imports.
  return <DatePicker {...props} />;
}

