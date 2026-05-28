'use client';
import { useMemo } from 'react';
import { addDays } from '../hooks/useTimelineScale';

type NonWorkingDaysLayerProps = {
  rangeStart: Date;
  rangeEnd: Date;
  pixelsPerDay: number;
  totalHeight: number;
  /** Working weekday indices (0=Sun … 6=Sat). Defaults to [1,2,3,4,5]. */
  workingDays?: number[];
  /** Holiday dates that should also be shaded. */
  holidays?: Date[];
};

const DEFAULT_WORKING = [1, 2, 3, 4, 5];
/** Stripe is only readable above this px-per-day threshold (day + week scales). */
const MIN_PPD = 8;

/**
 * Vertical stripes for weekends + holidays. Consecutive non-working days
 * collapse into a single rectangle. Skipped when the scale is too coarse
 * to make the stripe meaningful.
 */
export function NonWorkingDaysLayer({
  rangeStart,
  rangeEnd,
  pixelsPerDay,
  totalHeight,
  workingDays,
  holidays,
}: NonWorkingDaysLayerProps) {
  const stripes = useMemo(() => {
    if (pixelsPerDay < MIN_PPD) return [];
    const work = new Set(workingDays && workingDays.length > 0 ? workingDays : DEFAULT_WORKING);
    const holidaySet = new Set<number>();
    for (const h of holidays ?? []) {
      const d = new Date(h);
      d.setHours(0, 0, 0, 0);
      holidaySet.add(d.getTime());
    }
    const out: { left: number; width: number }[] = [];
    let cur = new Date(rangeStart);
    let runStart: number | null = null;
    let day = 0;
    while (cur < rangeEnd) {
      const stamp = new Date(cur);
      stamp.setHours(0, 0, 0, 0);
      const isNonWorking = !work.has(cur.getDay()) || holidaySet.has(stamp.getTime());
      if (isNonWorking) {
        if (runStart === null) runStart = day;
      } else if (runStart !== null) {
        out.push({ left: runStart * pixelsPerDay, width: (day - runStart) * pixelsPerDay });
        runStart = null;
      }
      cur = addDays(cur, 1);
      day++;
    }
    if (runStart !== null) {
      out.push({ left: runStart * pixelsPerDay, width: (day - runStart) * pixelsPerDay });
    }
    return out;
  }, [rangeStart, rangeEnd, pixelsPerDay, workingDays, holidays]);

  if (stripes.length === 0) return null;

  return (
    <>
      {stripes.map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute top-0 bg-surface-overlay/40 pointer-events-none"
          style={{ left: s.left, width: s.width, height: totalHeight }}
        />
      ))}
    </>
  );
}
