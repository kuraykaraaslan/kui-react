'use client';
import type { WidgetKindView } from '../kind';
import { seriesView } from './SeriesChartView';

/** `chart.area`: see SeriesChartView. */
export const CHART_AREA_VIEW: WidgetKindView = seriesView('area');
export const AreaChartView = CHART_AREA_VIEW.View;
