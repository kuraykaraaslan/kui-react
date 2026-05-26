// modules/ui/Chart/types.ts
//
// Shared type definitions for the @/modules/ui/Chart primitive library.
//
// All chart primitives below operate on the same `Series<T>` shape so a
// caller can swap chart types without rewriting data. The companion EJS
// renderer at modules/ui/Chart/Chart.ejs accepts a JSON-equivalent of
// these structures for pixel-identical output.

export type SeriesPoint = {
  /** Categorical or numeric x value. Strings are placed on a band scale. */
  x: string | number;
  /** Numeric y value. `null` skips the point (line gaps, missing bars). */
  y: number | null;
  /** Optional override color (else picked from theme palette by series index). */
  color?: string;
  /** Free-form label override for tooltips / a11y. */
  label?: string;
};

export type Series = {
  /** Stable identifier; used for legend toggle (M4) and series lookup. */
  id: string;
  /** Human-readable label shown in the legend + tooltip. */
  name: string;
  /** Points in plotted order. */
  data: SeriesPoint[];
  /** Optional override color. Falls back to defaultPalette[seriesIndex]. */
  color?: string;
};

/**
 * Common props every chart accepts. Individual chart components may extend
 * this with chart-specific options (e.g. `stacked` on BarChart).
 */
export type BaseChartProps = {
  /** Series array. At least one series is required for non-empty charts. */
  series: Series[];
  /** Optional fixed height (px). Default = 240. Width is 100% of parent. */
  height?: number;
  /** Show the legend strip below the chart. Default = true. */
  showLegend?: boolean;
  /** Show grid lines behind plotted shapes. Default = true. */
  showGrid?: boolean;
  /** Show hover tooltip. Default = true. */
  showTooltip?: boolean;
  /** Optional ARIA label override for the chart wrapper. */
  ariaLabel?: string;
  /** Extra className applied to the outer responsive container. */
  className?: string;
};

/**
 * Tooltip payload passed to consumers wanting to customise rendering
 * (M2+). The default tooltip is rendered by primitives/Tooltip.tsx.
 */
export type TooltipDatum = {
  seriesId: string;
  seriesName: string;
  color: string;
  x: string | number;
  y: number | null;
};

/** Computed pixel rectangle of the plotting area (inside axes/padding). */
export type PlotRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
