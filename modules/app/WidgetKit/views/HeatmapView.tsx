'use client';
import { useMemo } from 'react';
import { HeatmapChart } from '@/modules/ui/Chart';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { cssColor, formatValue, rangeFor, type ColorRange, type RangeEdges } from '../settings/style';
import { rowsToHeatCells, tableCsv } from './chart-data';
import { legendProps, legendReserve, tickStyleOf, useChartHeight } from './chart-props';

type S = Record<string, unknown>;
const col = (v: unknown, fallback: string) => (typeof v === 'string' && v ? v : fallback);

const cellsOf = (data: WidgetViewProps['data'], s: S) => rowsToHeatCells(data.cells?.rows, {
  x: col(s.xColumn, 'x'), y: col(s.yColumn, 'y'), value: col(s.valueColumn, 'value'),
});

/** `heatmap`: a colour grid; one colour light-to-strong, or colour ranges (bands). */
export function HeatmapView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings;
  const cells = useMemo(() => cellsOf(data, s), [data, s]);
  const legend = legendProps(s, 2);
  const [ref, height] = useChartHeight(legendReserve(legend.showLegend, legend.legendPosition) ? 28 : 0);
  if (cells.length === 0) return <div ref={ref} className="h-full" />;
  const fmt = (v: number) => formatValue(v, format, {}, locale);
  const bands = s.scale === 'bands' && Array.isArray(s.ranges) ? (s.ranges as ColorRange[]) : null;
  const edges: RangeEdges = s.rangeEdges === 'to' ? 'to' : 'from';
  const legendItems = bands
    ? bands.flatMap((r) => {
      const c = cssColor(r?.color);
      if (!c) return [];
      const from = typeof r.from === 'number' ? fmt(r.from) : '';
      const to = typeof r.to === 'number' ? fmt(r.to) : '';
      return [{ color: c, label: r.label || (from && to ? `${from} – ${to}` : from ? `≥ ${from}` : to ? `< ${to}` : 'All') }];
    })
    : undefined;
  return (
    <div ref={ref} className="h-full min-h-0 w-full">
      <HeatmapChart
        cells={cells}
        height={height}
        min={typeof s.min === 'number' ? s.min : undefined}
        max={typeof s.max === 'number' ? s.max : undefined}
        color={cssColor(s.color) ?? 'var(--primary)'}
        colorFor={bands ? (v) => cssColor(rangeFor(v, bands, edges)?.color) : undefined}
        valueFormat={fmt}
        valueLabel={typeof s.valueName === 'string' && s.valueName ? s.valueName : 'Value'}
        showValues={s.valueLabels === 'value'}
        showLegend={legend.showLegend}
        legendPosition={legend.legendPosition}
        legendItems={legendItems}
        showTooltip={s.showTooltip !== false}
        tickStyle={tickStyleOf(s)}
        ariaLabel="Heatmap"
      />
    </div>
  );
}

export const HEATMAP_VIEW: WidgetKindView = {
  View: HeatmapView,
  isEmpty: (data, settings) => cellsOf(data, settings).length === 0,
  toCsv: (data) => tableCsv(data.cells),
};
