'use client';
// modules/ui/Chart/charts/GaugeChart.tsx
//
// M3 stub. Returns null. Implement in M3.
//
// TODO M3: half-donut gauge with threshold band coloring
// (`--success` / `--warning` / `--error`), value label in the center,
// optional needle indicator.

type GaugeChartProps = {
  /** 0..1 normalized value, or use min/max for raw input. */
  value?: number;
  min?: number;
  max?: number;
  className?: string;
};

export function GaugeChart(_props: GaugeChartProps) {
  // TODO M3: implement gauge with threshold bands.
  return null;
}
