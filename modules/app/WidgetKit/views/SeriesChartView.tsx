'use client';
import { useMemo } from 'react';
import { AreaChart, BarChart, LineChart, type CurveType, type Series } from '@/modules/ui/Chart';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import type { SeriesPreset } from '../templates/series';
import { applySeriesRules, axisFormat, mergeSeriesSlots, seriesCsv, toBandSeries, toTimeSeries } from './chart-data';
import { axisProps, legendProps, legendReserve, thresholdLines, tooltipModeOf, useChartHeight } from './chart-props';

const FILL: Record<string, number> = { none: 0, soft: 0.2, medium: 0.35, solid: 0.6 };

/**
 * The view behind chart.line / chart.bar / chart.area: every source bound to the `series` slot,
 * on a time axis when every x is a date (line, and area unless stacked) or on a band axis of
 * formatted timestamps (bars, stacked areas, non-date x values). Zoom on the time axis is
 * viewer-local and never changes the board window.
 */
export function SeriesChartView({ preset, settings, format, data, locale }: WidgetViewProps & { preset: SeriesPreset }) {
  const s = settings;
  const stacked = preset !== 'line' && s.stacked === true;
  const result = useMemo(() => mergeSeriesSlots(data), [data]);
  const timeSeries = useMemo(
    () => (preset === 'bar' || (preset === 'area' && stacked) ? null : toTimeSeries(result)),
    [result, preset, stacked],
  );
  const series: Series[] | null = useMemo(() => {
    const base = timeSeries ?? toBandSeries(result, locale);
    return base
      ? applySeriesRules(base, s.series, {
        format, locale,
        lineWidth: typeof s.lineWidth === 'number' ? s.lineWidth : undefined,
        showPoints: s.showPoints === true ? true : undefined,
        defaultColor: s.defaultColor as string | undefined,
      })
      : null;
  }, [timeSeries, result, locale, s.series, s.lineWidth, s.showPoints, s.defaultColor, format]);
  const yFormat = useMemo(() => (series ? axisFormat(series, s.series, format, locale) : undefined), [series, s.series, format, locale]);
  const legend = legendProps(s, series?.length ?? 0);
  const [ref, height] = useChartHeight(legendReserve(legend.showLegend, legend.legendPosition));

  if (!series) return <div ref={ref} className="h-full" />;

  const common = {
    series,
    height,
    yFormat,
    ...legend,
    ...axisProps(s),
    thresholds: thresholdLines(s.thresholds),
    tooltipMode: tooltipModeOf(s),
    ariaLabel: preset === 'bar' ? 'Bar chart' : preset === 'area' ? 'Area chart' : 'Line chart',
  };
  const curve = (s.curve === 'linear' || s.curve === 'step' ? s.curve : 'smooth') as CurveType;
  const lineWidth = typeof s.lineWidth === 'number' ? s.lineWidth : 2;
  // A host may pass the board window's explicit zone along with the result (next-boilerplate does).
  const timeZone = result?.window?.explicitTimezone;

  return (
    <div ref={ref} className="h-full min-h-0 w-full">
      {preset === 'bar' ? (
        <BarChart
          {...common}
          stacked={stacked}
          orientation={s.orientation === 'horizontal' ? 'horizontal' : 'vertical'}
          showValues={s.valueLabels === 'value'}
          radius={typeof s.barRadius === 'number' ? s.barRadius : 4}
        />
      ) : preset === 'area' ? (
        <AreaChart
          {...common}
          stacked={stacked}
          curve={curve}
          strokeWidth={lineWidth}
          fillOpacity={FILL[String(s.fill)] ?? 0.2}
          xAxis={timeSeries ? 'time' : 'band'}
          timeZone={timeZone}
          locale={locale}
        />
      ) : (
        <LineChart
          {...common}
          curve={curve}
          strokeWidth={lineWidth}
          xAxis={timeSeries ? 'time' : 'band'}
          timeZone={timeZone}
          locale={locale}
        />
      )}
    </div>
  );
}

const isEmpty: WidgetKindView['isEmpty'] = (data) => {
  const r = mergeSeriesSlots(data);
  return !r?.series?.some((s) => s.points.length > 0);
};

const toCsv: WidgetKindView['toCsv'] = (data) => seriesCsv(mergeSeriesSlots(data));

/** The kind view for one series preset. */
export function seriesView(preset: SeriesPreset): WidgetKindView {
  function View(props: WidgetViewProps) {
    return <SeriesChartView preset={preset} {...props} />;
  }
  View.displayName = `SeriesChartView(${preset})`;
  return { View, isEmpty, toCsv };
}
