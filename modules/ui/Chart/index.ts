// modules/ui/Chart/index.ts
//
// Public barrel for the @/modules/ui/Chart primitive library.
//
// Usage:
//   import { LineChart, BarChart, type Series, type SeriesPoint } from '@/modules/ui/Chart';
//
// Roadmap reference: PLANS/38-Charts.md
//   M1 (this milestone) — Token + theme + primitives + 7 basic charts.
//   M2 — Stacked / horizontal bars, animations, empty + skeleton states.
//   M3 — Heatmap / Treemap / Radar / Funnel / Sankey / Candlestick / Gauge / Bubble.
//   M4 — Brush / pan / zoom / synced tooltips / drilldown.
//   M5 — A11y + i18n + PNG / SVG / CSV export.
//   M6 — Annotations, forecast, streaming, thresholds, period overlay.
//
// The existing aggregator at modules/domains/common/charts/Charts.tsx
// remains untouched in M1 — domain charts will be migrated onto these
// primitives in M5.

// ── Charts (M1 implementations) ────────────────────────────────────
export { LineChart } from './charts/LineChart';
export { BarChart } from './charts/BarChart';
export { AreaChart } from './charts/AreaChart';
export { PieChart } from './charts/PieChart';
export { DonutChart } from './charts/DonutChart';
export { ScatterChart } from './charts/ScatterChart';
export { SparkLine } from './charts/SparkLine';

// ── Charts (M3 stubs — render null today) ──────────────────────────
export { BubbleChart } from './charts/BubbleChart';
export { HeatmapChart } from './charts/HeatmapChart';
export { TreemapChart } from './charts/TreemapChart';
export { RadarChart } from './charts/RadarChart';
export { FunnelChart } from './charts/FunnelChart';
export { SankeyChart } from './charts/SankeyChart';
export { CandlestickChart } from './charts/CandlestickChart';
export { GaugeChart } from './charts/GaugeChart';

// ── Primitives (escape-hatch for advanced consumers) ───────────────
export { XAxis, YAxis } from './primitives/Axis';
export { Grid } from './primitives/Grid';
export { Legend } from './primitives/Legend';
export { ChartTooltip } from './primitives/Tooltip';
export { Crosshair } from './primitives/Crosshair';
export { Brush } from './primitives/Brush';
export { ResponsiveContainer } from './primitives/ResponsiveContainer';

// ── Theme + types ──────────────────────────────────────────────────
export { defaultPalette, paletteColor, chartTheme, animationDuration } from './theme';
export type {
  Series,
  SeriesPoint,
  BaseChartProps,
  TooltipDatum,
  PlotRect,
} from './types';
export type { AxisTick } from './primitives/Axis';
