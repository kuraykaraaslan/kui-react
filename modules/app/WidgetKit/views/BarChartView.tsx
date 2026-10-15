'use client';
import type { WidgetKindView } from '../kind';
import { seriesView } from './SeriesChartView';

/** `chart.bar`: see SeriesChartView. */
export const CHART_BAR_VIEW: WidgetKindView = seriesView('bar');
export const BarChartView = CHART_BAR_VIEW.View;
