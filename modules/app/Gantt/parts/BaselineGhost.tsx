'use client';
import type { Baseline } from '../types';
import { BAR_HEIGHT, ROW_HEIGHT } from '../types';
import { diffDays } from '../hooks/useTimelineScale';

type BaselineGhostProps = {
  baseline: Baseline;
  rangeStart: Date;
  pixelsPerDay: number;
  rowIndex: number;
};

const GHOST_HEIGHT = 5;

/**
 * Thin outline strip sitting just below the actual TaskBar, drawn from the
 * baseline's planned start/end. Useful in "we said two weeks, took five"
 * reviews. Pure visual — no interaction.
 */
export function BaselineGhost({
  baseline,
  rangeStart,
  pixelsPerDay,
  rowIndex,
}: BaselineGhostProps) {
  const startOffset = diffDays(rangeStart, baseline.start);
  const duration = Math.max(1, diffDays(baseline.start, baseline.end));
  const left = startOffset * pixelsPerDay;
  const width = duration * pixelsPerDay;
  const top = rowIndex * ROW_HEIGHT + (ROW_HEIGHT + BAR_HEIGHT) / 2 + 1;

  return (
    <div
      aria-hidden="true"
      className="gantt-baseline absolute rounded-sm border border-dashed border-text-secondary/60 bg-text-secondary/10 pointer-events-none"
      style={{ left, top, width, height: GHOST_HEIGHT }}
    />
  );
}
