'use client';
// modules/ui/Chart/charts/AreaChart.tsx
//
// Token-aware filled area chart. Each series is a stroked outline plus a translucent fill
// toward the baseline (or toward the series below when `stacked`). Same settings surface as
// LineChart plus `fillOpacity` and `stacked`. `xAxis="time"` (not combined with `stacked`)
// places points by timestamp and enables viewer-local zoom. Rendered by ./_SeriesChart.tsx.

import { SeriesChart, type SeriesChartProps } from './_SeriesChart';
import type { BaseChartProps, CurveType } from '../types';

export type AreaChartProps = BaseChartProps & {
  /** Smooth curves between points. Default = true (straight when stacked). `curve` wins when set. */
  smooth?: boolean;
  /** How points are joined: 'smooth' | 'linear' | 'step'. */
  curve?: CurveType;
  /** Translucent fill alpha (0..1). Default = 0.2. A series' own `fillOpacity` wins. */
  fillOpacity?: number;
  /** Stack the areas. */
  stacked?: boolean;
  /** Stroke width in pixels. Default = 2. */
  strokeWidth?: number;
  /** Time axis only: locale for tick labels. */
  locale?: string;
} & Pick<SeriesChartProps, 'pointShape' | 'pointSize' | 'showValues' | 'valueLabelPosition'>;

export function AreaChart(props: AreaChartProps) {
  const mode = (props.xAxis ?? props.xScale) === 'time' && !props.stacked ? 'time' : 'band';
  return <SeriesChart variant="area" mode={mode} {...props} />;
}
