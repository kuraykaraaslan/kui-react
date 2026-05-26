'use client';
// modules/ui/Chart/charts/DonutChart.tsx
//
// Donut chart — thin wrapper around PieChart with a non-zero inner
// radius. Re-exported separately so callers can stay semantically
// clear: `<DonutChart …/>` vs `<PieChart innerRadius={0.6} …/>`.

import { PieChart } from './PieChart';
import type { BaseChartProps } from '../types';

type DonutChartProps = BaseChartProps & {
  /** Inner-to-outer radius ratio. Default = 0.6. */
  innerRadius?: number;
};

export function DonutChart({ innerRadius = 0.6, ...rest }: DonutChartProps) {
  return <PieChart {...rest} innerRadius={innerRadius} />;
}
