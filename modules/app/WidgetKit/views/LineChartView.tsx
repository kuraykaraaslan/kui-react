'use client';
import type { WidgetKindView } from '../kind';
import { seriesView } from './SeriesChartView';

/** `chart.line`: see SeriesChartView. */
export const CHART_LINE_VIEW: WidgetKindView = seriesView('line');
export const LineChartView = CHART_LINE_VIEW.View;
