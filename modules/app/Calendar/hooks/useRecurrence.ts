'use client';
import { useMemo } from 'react';
import type { Event, EventOccurrence } from '../types';
import { expandRRule, isException, parseRRule } from '../rrule';

/**
 * Expand any events that carry an `rrule` into materialised occurrences
 * within the visible window. Non-recurring events pass through unchanged.
 *
 * The expander is bounded by COUNT / UNTIL / window — so even an "forever"
 * rule like `FREQ=DAILY` only produces what the current view needs.
 *
 * Memoised on `(events, window.start, window.end)`; cheap when nothing
 * recurs.
 */
export function useRecurrence(
  events: Event[],
  windowStart: Date,
  windowEnd: Date,
): EventOccurrence[] {
  return useMemo(() => {
    const out: EventOccurrence[] = [];
    for (const ev of events) {
      if (!ev.rrule) {
        out.push(ev);
        continue;
      }
      let parsed;
      try {
        parsed = parseRRule(ev.rrule);
      } catch {
        // Malformed rule — fall back to the single base event.
        out.push(ev);
        continue;
      }
      const duration = ev.end.getTime() - ev.start.getTime();
      const occurrences = expandRRule(parsed, ev.start, windowStart, windowEnd);
      for (const start of occurrences) {
        if (isException(start, ev.exceptions)) continue;
        out.push({
          ...ev,
          id: `${ev.id}::${start.toISOString()}`,
          start,
          end: new Date(start.getTime() + duration),
          parentId: ev.id,
          originalStart: start,
          isRecurrence: true,
        });
      }
    }
    return out;
  }, [events, windowStart.getTime(), windowEnd.getTime()]);
}
