'use client';
import { useMemo } from 'react';
import { BarChart, type Series } from '@/modules/ui/Chart';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { cssColor, formatValue, type ValueFormat } from '../settings/style';
import { histogramBins, type HistogramBin } from './chart-data';
import { axisProps, useChartHeight } from './chart-props';

type S = Record<string, unknown>;
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

const binsOf = (data: WidgetViewProps['data'], s: S): HistogramBin[] => {
  const col = typeof s.valueColumn === 'string' && s.valueColumn ? s.valueColumn : 'value';
  return histogramBins((data.values?.rows ?? []).map((r) => r[col]), num(s.bins), num(s.min), num(s.max));
};

/** `x – y` bin labels in the widget format (unit, decimals). */
export function binSeries(bins: HistogramBin[], format: ValueFormat, name: string, locale?: string, color?: string): Series[] | null {
  if (bins.length === 0) return null;
  const fmt = (n: number) => formatValue(n, format, {}, locale);
  return [{
    id: 'histogram',
    name,
    ...(color ? { color } : {}),
    format: (v: number) => String(Math.round(v)),
    data: bins.map((b) => ({ x: bins.length === 1 && b.from === b.to ? fmt(b.from) : `${fmt(b.from)}–${fmt(b.to)}`, y: b.count })),
  }];
}

/** `chart.histogram`: equal-width bins of one numeric column, drawn as bars. */
export function HistogramChartView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings;
  const series = useMemo(
    () => binSeries(binsOf(data, s), format, typeof s.countLabel === 'string' && s.countLabel ? s.countLabel : 'Count', locale, cssColor(s.barColor)),
    [data, s, format, locale],
  );
  const [ref, height] = useChartHeight();
  if (!series) return <div ref={ref} className="h-full" />;
  return (
    <div ref={ref} className="h-full min-h-0 w-full">
      <BarChart
        series={series}
        height={height}
        showLegend={false}
        showValues={s.valueLabels === 'value'}
        showTooltip={s.showTooltip !== false}
        yFormat={(v) => String(Math.round(v * 100) / 100)}
        {...axisProps(s)}
        ariaLabel="Histogram"
      />
    </div>
  );
}

export const CHART_HISTOGRAM_VIEW: WidgetKindView = {
  View: HistogramChartView,
  isEmpty: (data, settings) => binsOf(data, settings).length === 0,
  toCsv: (data, settings) => [['from', 'to', 'count'], ...binsOf(data, settings).map((b) => [String(b.from), String(b.to), String(b.count)])],
};
