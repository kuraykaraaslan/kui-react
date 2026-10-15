import { axisFields, colorField, minBelowMax, opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `chart.histogram`: the distribution of one numeric column of a bound table, in equal-width bins. */
export const CHART_HISTOGRAM: SettingsTemplate = {
  id: 'builtin:chart.histogram',
  version: 1,
  namespace: '',
  label: 'Histogram',
  format: true,
  exportable: true,
  formatDefaults: { decimals: 1 },
  groups: [
    { id: 'data', label: 'Column', tab: 'Data', since: 1 },
    { id: 'bins', label: 'Bins', tab: 'Display', since: 1 },
    { id: 'bars', label: 'Bars', tab: 'Display', since: 1 },
    { id: 'axis', label: 'Axis', tab: 'Display', since: 1 },
    { id: 'tooltip', label: 'Tooltip', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    valueColumn: { label: 'Value column', type: 'data-key', slot: 'values', value: 'value', placeholder: 'value', group: 'data', required: true },
    bins: { label: 'Bins', type: 'number', nullable: true, display: 'input', min: 1, max: 50, placeholder: 'Automatic', group: 'bins',
      description: 'Empty = chosen from the number of values.' },
    min: { label: 'Range minimum', type: 'number', nullable: true, display: 'input', placeholder: 'From the data', group: 'bins' },
    max: { label: 'Range maximum', type: 'number', nullable: true, display: 'input', placeholder: 'From the data', group: 'bins' },
    barColor: colorField('Bar colour', 'bars', 'var(--primary)'),
    valueLabels: {
      label: 'Value labels', type: 'select', display: 'segmented', value: 'none', group: 'bars', required: true,
      options: [opt('none', 'Off'), opt('value', 'Count on each bar')],
    },
    countLabel: { label: 'Name of the count', type: 'text', maxLength: 30, placeholder: 'Count', group: 'bars', advanced: true },
    ...axisFields('axis'),
    xLabel: { label: 'X axis title', type: 'text', maxLength: 40, group: 'axis', advanced: true },
    showTooltip: { label: 'Tooltip on hover', type: 'boolean', value: true, group: 'tooltip' },
  }),
  rules: [minBelowMax('min', 'max'), minBelowMax('yMin', 'yMax')],
  migrations: [],
};

export const CHART_HISTOGRAM_KIND: BuiltinKindSpec = {
  type: 'chart.histogram',
  label: 'Histogram',
  category: 'Charts',
  description: 'The distribution of one numeric column of a bound table, in equal-width bins.',
  icon: 'fas fa-chart-simple',
  defaultW: 6,
  defaultH: 4,
  slots: [{ key: 'values', label: 'Values', shape: 'table', required: true }],
  template: CHART_HISTOGRAM,
};
