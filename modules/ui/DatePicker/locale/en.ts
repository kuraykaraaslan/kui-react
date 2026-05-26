// modules/ui/DatePicker/locale/en.ts
import type { DatePickerLocale } from '../types';

export const enLocale: DatePickerLocale = {
  code: 'en',
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  monthsShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ],
  // EN convention: Sunday-first week.
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekStartsOn: 0,
  displayFormat: 'MM/DD/YYYY',
  messages: {
    placeholder: 'MM/DD/YYYY',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',
    clear: 'Clear date',
    dialogLabel: 'Choose date',
    disabledDate: 'Disabled date',
  },
};
