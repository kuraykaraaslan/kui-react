'use client';
// modules/ui/DatePicker.tsx
//
// Thin re-export shim — the real implementation now lives in the
// directory-style module `./DatePicker/`. Existing imports such as
//   import { DatePicker } from '@/modules/ui/DatePicker';
// continue to resolve through this barrel.

export { DatePicker, DateRangePicker, DateTimePicker } from './DatePicker/index';
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
} from './DatePicker/index';
