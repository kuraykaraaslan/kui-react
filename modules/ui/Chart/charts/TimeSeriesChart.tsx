'use client';
// The time-axis renderer behind LineChart / AreaChart `xAxis="time"` (phase 9 §9.1 / §9.2:
// timestamps in `x`, uneven sampling, gaps, drag-to-zoom). Kept as its own entry point for
// callers that import it directly; the drawing is ./_SeriesChart.tsx in `mode="time"`.

import { SeriesChart, type SeriesChartProps } from './_SeriesChart';
import type { BaseChartProps, CurveType } from '../types';

export type TimeSeriesChartProps = BaseChartProps & {
  variant: 'line' | 'area';
  smooth?: boolean;
  curve?: CurveType;
  strokeWidth?: number;
  fillOpacity?: number;
  /** Locale for tick labels; default = the runtime's. */
  locale?: string;
} & Pick<SeriesChartProps, 'pointShape' | 'pointSize' | 'showValues' | 'valueLabelPosition' | 'stacked'>;

export function TimeSeriesChart(props: TimeSeriesChartProps) {
  return <SeriesChart mode="time" {...props} />;
}
