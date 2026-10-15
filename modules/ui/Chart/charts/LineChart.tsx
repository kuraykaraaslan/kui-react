'use client';
// modules/ui/Chart/charts/LineChart.tsx
//
// Token-aware line chart: curve (smooth / linear / step), per-series stroke style, width,
// points and fill, legend position / values / toggling, fixed y bounds, axis titles,
// thresholds and tooltip mode. Band (category) axis by default; `xAxis="time"` places points
// by timestamp and enables viewer-local zoom. Rendered by ./_SeriesChart.tsx. No external
// chart library.

import { SeriesChart, type SeriesChartProps } from './_SeriesChart';
import type { BaseChartProps, CurveType } from '../types';

export type LineChartProps = BaseChartProps & {
  /** Render smooth curves instead of straight segments. Default = true. `curve` wins when set. */
  smooth?: boolean;
  /** How points are joined: 'smooth' | 'linear' | 'step'. */
  curve?: CurveType;
  /** Stroke width in pixels. Default = 2. */
  strokeWidth?: number;
  /** Time axis only: locale for tick labels. */
  locale?: string;
} & Pick<SeriesChartProps, 'pointShape' | 'pointSize' | 'showValues' | 'valueLabelPosition'>;

export function LineChart(props: LineChartProps) {
  const mode = (props.xAxis ?? props.xScale) === 'time' ? 'time' : 'band';
  return <SeriesChart variant="line" mode={mode} {...props} />;
}
