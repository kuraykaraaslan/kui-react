'use client';
// modules/ui/Chart/charts/BubbleChart.tsx
//
// M3 stub. Returns null so it can be safely imported by callers and
// the registry can list it as "planned". Implement in M3.
//
// TODO M3: extend ScatterChart with a per-point `size` channel (z value);
// area-encoded radius (sqrt scale), legend swatch becomes a triple-bubble.

import type { BaseChartProps } from '../types';

type BubbleChartProps = BaseChartProps & {
  /** Domain field on each point that drives bubble area. */
  sizeKey?: string;
};

export function BubbleChart(_props: BubbleChartProps) {
  // TODO M3: implement bubble chart on top of ScatterChart math.
  return null;
}
