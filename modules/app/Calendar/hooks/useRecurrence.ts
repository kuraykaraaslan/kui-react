'use client';
import type { Event } from '../types';

// TODO M3: expand RRULE strings into materialised event occurrences.
// For M1 we identity-return the input so the public API is forward-compatible.

export function useRecurrence(events: Event[]): Event[] {
  // TODO M3: dynamically import 'rrule' and expand per visible date range.
  return events;
}
