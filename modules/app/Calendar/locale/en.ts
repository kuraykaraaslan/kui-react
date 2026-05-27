'use client';
import type { CalendarMessages } from '../types';

export const EN_MESSAGES: CalendarMessages = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  resource: 'Resource',
  allDay: 'All-day',
  noEvents: 'No events',
  more: (n) => `+${n} more`,
  edit: 'Edit',
  delete: 'Delete',
  confirmDelete: 'Confirm delete?',
  close: 'Close',
};

/** Sunday-start (US default). */
export const EN_WEEK_START = 0;

export const EN_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Weekday headers, indexed Sun..Sat. */
export const EN_DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const EN_DAY_LONG  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
