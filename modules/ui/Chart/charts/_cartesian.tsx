'use client';
// Shared pieces of the cartesian charts (Line, Area, Bar, Scatter, the time axis): which series
// the viewer has hidden from the legend, the legend itself (position, values, toggling), plot
// padding that leaves room for long tick labels and axis titles, and the value text of a point.

import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { Legend } from '../primitives/Legend';
import { paletteColor } from '../theme';
import type { AxisTextStyle, LegendPosition, LegendValue, Series, SeriesPoint } from '../types';
import { defaultNumber, labelWidth, seriesStats } from './_helpers';

/** Series with their palette colour fixed by ORIGINAL index (hiding one never recolours the rest). */
export function useSeriesVisibility(series: Series[]) {
  const seed = series.filter((s) => s.hidden).map((s) => s.id).join('\u0000');
  const [state, setState] = useState(() => ({ seed, hidden: new Set(series.filter((s) => s.hidden).map((s) => s.id)) }));
  // New `hidden` flags from the caller reset the viewer's toggles (render-time state sync).
  let hidden = state.hidden;
  if (state.seed !== seed) {
    hidden = new Set(series.filter((s) => s.hidden).map((s) => s.id));
    setState({ seed, hidden });
  }
  const toggle = useCallback((id: string) => setState((prev) => {
    const next = new Set(prev.hidden);
    if (next.has(id)) next.delete(id); else next.add(id);
    return { seed: prev.seed, hidden: next };
  }), []);
  const colored = useMemo(() => series.map((s, i) => ({ ...s, color: paletteColor(i, s.color) })), [series]);
  const visible = useMemo(() => colored.filter((s) => !hidden.has(s.id)), [colored, hidden]);
  return { hidden, toggle, colored, visible };
}

const LEGEND_WORD: Record<LegendValue, string> = { latest: '', min: 'min ', max: 'max ', avg: 'avg ', total: 'total ' };

/** The text a series prints for a value: its point label, its own format, the chart's, or the default. */
export function valueText(s: Pick<Series, 'format'>, y: number, point?: Pick<SeriesPoint, 'label'>, yFormat?: (v: number) => string): string {
  return point?.label ?? s.format?.(y) ?? (yFormat ?? defaultNumber)(y);
}

/** Legend values per series id, e.g. `"21.4 °C · max 24 °C"`. */
export function legendValueTexts(series: Series[], values: LegendValue[] | undefined, yFormat?: (v: number) => string): Record<string, string> | undefined {
  if (!values?.length) return undefined;
  const out: Record<string, string> = {};
  for (const s of series) {
    const st = seriesStats(s);
    if (!st) continue;
    out[s.id] = values.map((v) => `${LEGEND_WORD[v]}${valueText(s, st[v], undefined, yFormat)}`).join(' · ');
  }
  return out;
}

type ChartLegendOptions = {
  show: boolean;
  series: Series[];
  hidden: ReadonlySet<string>;
  toggle: (id: string) => void;
  position?: LegendPosition;
  values?: LegendValue[];
  style?: CSSProperties;
  /** Undefined = on when any series starts hidden. */
  toggleable?: boolean;
  yFormat?: (v: number) => string;
};

/** The legend element for a chart, or null. */
export function chartLegend(o: ChartLegendOptions) {
  if (!o.show || !o.series.length) return null;
  const toggleable = o.toggleable ?? o.series.some((s) => s.hidden);
  return (
    <Legend
      series={o.series}
      position={o.position}
      hiddenIds={o.hidden}
      onToggle={toggleable ? o.toggle : undefined}
      values={legendValueTexts(o.series, o.values, o.yFormat)}
      style={o.style}
    />
  );
}

const fontPx = (style?: AxisTextStyle) => (typeof style?.fontSize === 'number' ? style.fontSize : 11);

/** Plot padding: room for the longest y tick label and the axis titles. */
export function plotPadding(o: { yTickLabels: string[]; xLabel?: string; yLabel?: string; tickStyle?: AxisTextStyle; minLeft?: number }) {
  const fs = fontPx(o.tickStyle);
  return {
    top: 12,
    right: 16,
    bottom: 28 + (fs > 11 ? fs - 11 : 0) + (o.xLabel ? 16 : 0),
    left: Math.max(o.minLeft ?? 40, labelWidth(o.yTickLabels, fs) + 14) + (o.yLabel ? 18 : 0),
  };
}
