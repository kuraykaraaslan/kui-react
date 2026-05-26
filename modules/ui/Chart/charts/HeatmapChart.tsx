'use client';
// modules/ui/Chart/charts/HeatmapChart.tsx
//
// M3 stub. Returns null. Implement in M3.
//
// TODO M3: matrix / calendar heatmap. Color scale interpolates between
// `var(--surface-overlay)` (low) and `var(--primary)` (high). Supports
// a `calendar` mode where x is week-of-year and y is day-of-week.

import type { BaseChartProps } from '../types';

type HeatmapChartProps = BaseChartProps & {
  /** 'matrix' (default) or 'calendar'. */
  mode?: 'matrix' | 'calendar';
};

export function HeatmapChart(_props: HeatmapChartProps) {
  // TODO M3: implement matrix + calendar heatmap.
  return null;
}
