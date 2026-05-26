'use client';
// TODO M4: render a thin outline bar beneath the actual TaskBar to show the
// original planned dates. Useful for "we said two weeks, took five" reviews.
import type { Baseline } from '../types';

type BaselineGhostProps = {
  baseline: Baseline;
  rangeStart: Date;
  pixelsPerDay: number;
  rowIndex: number;
};

export function BaselineGhost(_props: BaselineGhostProps) {
  // TODO M4: position absolute, height 6, top offset = ROW_HEIGHT - 8,
  // bg = transparent, border = dashed border-strong.
  return null;
}
