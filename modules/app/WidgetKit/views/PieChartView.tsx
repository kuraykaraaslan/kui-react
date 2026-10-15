'use client';
import { useMemo } from 'react';
import { PieChart } from '@/modules/ui/Chart';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { formatValue } from '../settings/style';
import { rowsToPieSeries, tableCsv } from './chart-data';
import { legendProps, legendReserve, useChartHeight } from './chart-props';

type S = Record<string, unknown>;
const col = (v: unknown, fallback: string) => (typeof v === 'string' && v ? v : fallback);

const slicesOf = (data: WidgetViewProps['data'], s: S) => rowsToPieSeries(data.slices?.rows, {
  label: col(s.labelColumn, 'label'),
  value: col(s.valueColumn, 'value'),
  max: typeof s.maxSlices === 'number' ? s.maxSlices : 8,
  sort: s.sort === 'asc' || s.sort === 'none' ? s.sort : 'desc',
  otherLabel: typeof s.otherLabel === 'string' ? s.otherLabel : undefined,
  colors: s.colors,
});

/** `chart.pie`: slices from a bound table; pie, donut or donut with the total in the centre. */
export function PieChartView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings;
  const series = useMemo(() => slicesOf(data, s), [data, s]);
  const legend = legendProps(s, series?.[0]?.data.length ?? 0);
  const [ref, height] = useChartHeight(legendReserve(legend.showLegend, legend.legendPosition));
  if (!series) return <div ref={ref} className="h-full" />;
  const layout = s.layout === 'donut' || s.layout === 'donut-total' ? s.layout : 'pie';
  const ring = typeof s.donutWidth === 'number' ? s.donutWidth : 40;
  const labels = s.valueLabels === 'percent' || s.valueLabels === 'value' || s.valueLabels === 'name' ? s.valueLabels : 'none';
  return (
    <div ref={ref} className="h-full min-h-0 w-full">
      <PieChart
        series={series}
        height={height}
        innerRadius={layout === 'pie' ? 0 : 1 - ring / 100}
        showCenter={layout === 'donut-total'}
        centerLabel={typeof s.totalLabel === 'string' && s.totalLabel ? s.totalLabel : layout === 'donut-total' ? 'Total' : undefined}
        labels={labels}
        valueFormat={(v) => formatValue(v, format, {}, locale)}
        showLegend={legend.showLegend}
        legendPosition={legend.legendPosition}
        legendStyle={legend.legendStyle}
        legendToggle
        legendValue={s.legendValue === 'value' || s.legendValue === 'percent' ? s.legendValue : 'none'}
        showTooltip={s.showTooltip !== false}
        ariaLabel="Pie chart"
      />
    </div>
  );
}

export const CHART_PIE_VIEW: WidgetKindView = {
  View: PieChartView,
  isEmpty: (data, settings) => slicesOf(data, settings) === null,
  toCsv: (data) => tableCsv(data.slices),
};
