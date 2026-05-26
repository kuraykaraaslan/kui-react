'use client';
// modules/ui/Chart/charts/SankeyChart.tsx
//
// M3 stub. Returns null. Implement in M3.
//
// TODO M3: Sankey flow diagram. Probably uses visx-sankey (lazy
// dynamic-import). Token-aware ribbon colors; needs a `nodes`/`links`
// data shape that is NOT covered by Series<SeriesPoint> — extend types
// in types.ts when implementing.

type SankeyChartProps = {
  /** TODO M3: { id, name }[] */
  nodes?: unknown[];
  /** TODO M3: { source, target, value }[] */
  links?: unknown[];
  className?: string;
};

export function SankeyChart(_props: SankeyChartProps) {
  // TODO M3: implement Sankey ribbons (visx-sankey).
  return null;
}
