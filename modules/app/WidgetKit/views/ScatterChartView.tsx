'use client';
import { useMemo } from 'react';
import { ScatterChart } from '@/modules/ui/Chart';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { cssColor, formatValue } from '../settings/style';
import { rowsToScatterSeries, tableCsv } from './chart-data';
import { axisProps, legendProps, legendReserve, thresholdLines, useChartHeight } from './chart-props';

type S = Record<string, unknown>;
const col = (v: unknown, fallback: string) => (typeof v === 'string' && v ? v : fallback);
const RADIUS: Record<string, number> = { sm: 3, md: 4, lg: 6 };

const pointsOf = (data: WidgetViewProps['data'], s: S) => rowsToScatterSeries(data.points?.rows, {
  x: col(s.xColumn, 'x'),
  y: col(s.yColumn, 'y'),
  group: typeof s.groupColumn === 'string' && s.groupColumn ? s.groupColumn : undefined,
});

/** `chart.scatter`: points from a bound table, one series per group. */
export function ScatterChartView({ settings, data, locale }: WidgetViewProps) {
  const s = settings;
  const raw = useMemo(() => pointsOf(data, s), [data, s]);
  const series = useMemo(() => {
    if (!raw) return null;
    const pinned = new Map<string, string>();
    if (Array.isArray(s.groupColors)) {
      for (const g of s.groupColors as Array<{ key?: string; color?: string }>) {
        const c = cssColor(g?.color);
        if (g?.key && c) pinned.set(g.key, c);
      }
    }
    const single = raw.length === 1 ? cssColor(s.pointColor) : undefined;
    return raw.map((g) => ({ ...g, ...(pinned.get(g.id) ?? single ? { color: pinned.get(g.id) ?? single } : {}) }));
  }, [raw, s.groupColors, s.pointColor]);
  const legend = legendProps(s, series?.length ?? 0);
  const [ref, height] = useChartHeight(legendReserve(legend.showLegend, legend.legendPosition));
  if (!series) return <div ref={ref} className="h-full" />;
  const dec = (v: unknown) => (typeof v === 'number' ? v : undefined);
  const unit = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
  return (
    <div ref={ref} className="h-full min-h-0 w-full">
      <ScatterChart
        series={series}
        height={height}
        pointRadius={RADIUS[String(s.pointSize)] ?? 4}
        {...legend}
        {...axisProps(s)}
        xMin={typeof s.xMin === 'number' ? s.xMin : undefined}
        xMax={typeof s.xMax === 'number' ? s.xMax : undefined}
        xFormat={(v) => formatValue(v, { unit: unit(s.xUnit), decimals: dec(s.xDecimals) }, {}, locale)}
        yFormat={(v) => formatValue(v, { unit: unit(s.yUnit), decimals: dec(s.yDecimals) }, {}, locale)}
        thresholds={thresholdLines(s.thresholds)}
        showTooltip={s.showTooltip !== false}
        ariaLabel="Scatter chart"
      />
    </div>
  );
}

export const CHART_SCATTER_VIEW: WidgetKindView = {
  View: ScatterChartView,
  isEmpty: (data, settings) => pointsOf(data, settings) === null,
  toCsv: (data) => tableCsv(data.points),
};
