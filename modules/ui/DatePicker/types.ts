// modules/ui/DatePicker/types.ts
// Shared types for the DatePicker suite (M1 — Calendar core).
//
// TODO M2: Add Preset and DateRangePickerExtras (compareToPreviousPeriod).
// TODO M3: Add input-mask + locale-aware format options.
// TODO M4: Add `withTime`, `timezone` props (hour/minute/second pickers).
// TODO M5: Add `variant: 'bottom-sheet'` for mobile.
// TODO M6: Add `numberOfMonths` 1|2|3 and calendar system options.

export type DateValue = Date | null;

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type LocaleCode = 'tr' | 'en';

export type DisabledDates = Date[] | ((d: Date) => boolean);

export type DatePickerMessages = {
  /** Trigger placeholder when no date selected. */
  placeholder: string;
  /** Aria-label for the chevron-left (previous month) button. */
  prevMonth: string;
  /** Aria-label for the chevron-right (next month) button. */
  nextMonth: string;
  /** Button label that jumps to today. */
  today: string;
  /** Aria-label for the clear (×) button on the trigger. */
  clear: string;
  /** Aria-label for the calendar dialog. */
  dialogLabel: string;
  /** Visible label when the user reaches a disabled day via keyboard. */
  disabledDate: string;
};

export type DatePickerLocale = {
  code: LocaleCode;
  /** Full month names index 0–11. */
  months: string[];
  /** Short month names index 0–11. */
  monthsShort: string[];
  /** Day-of-week labels starting Monday (TR) or Sunday (EN). */
  weekdaysShort: string[];
  /** ISO day index that starts the week: 1 = Monday, 0 = Sunday. */
  weekStartsOn: 0 | 1;
  /** Display format token string e.g. "DD.MM.YYYY" or "MM/DD/YYYY". */
  displayFormat: string;
  /** Default ARIA / button copy. */
  messages: DatePickerMessages;
};

export type CommonPickerProps = {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  min?: Date;
  max?: Date;
  disabledDates?: DisabledDates;
  /** Locale code — defaults to 'tr'. */
  locale?: LocaleCode;
  /** Override the locale-default display format. */
  format?: string;
  /** Override individual messages (placeholder, today, …). */
  messages?: Partial<DatePickerMessages>;
  /** Popover (default) is the only M1 variant. */
  variant?: 'popover';
  className?: string;
  /** Pass-through name attribute for native form submission. */
  name?: string;
};

export type DatePickerProps = CommonPickerProps & {
  value: DateValue;
  onChange: (d: Date | null) => void;
};

export type DateRangePickerProps = CommonPickerProps & {
  value: DateRange | null;
  onChange: (r: DateRange) => void;
};

// TODO M4: real DateTimePicker — for M1 this is exported as a stub alias.
export type DateTimePickerProps = DatePickerProps;
