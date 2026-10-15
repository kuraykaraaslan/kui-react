import { colorField, fontField, layoutField, opt, rangesFields, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `stat.sparkline`: the latest value of a series with its trend line and change badge. */
export const STAT_SPARKLINE: SettingsTemplate = {
  id: 'builtin:stat.sparkline',
  version: 1,
  namespace: '',
  label: 'Stat with trend',
  format: true,
  exportable: false,
  formatDefaults: { decimals: 0 },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'value', label: 'Value', tab: 'Display', since: 1 },
    { id: 'trend', label: 'Trend line', tab: 'Display', since: 1 },
    { id: 'colour', label: 'Colour ranges', tab: 'Display', since: 1 },
    { id: 'change', label: 'Change', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('value-top', 'Value above the line', 'spark-value-top'),
      opt('value-left', 'Value beside the line', 'spark-value-left'),
      opt('chart-only', 'Line only', 'spark-chart-only'),
    ]),
    autoScale: { label: 'Scale the number to the card', type: 'boolean', value: true, group: 'value' },
    valueFont: fontField('Value font', 'value', { showIf: { autoScale: false } }),
    valueColor: colorField('Value colour', 'value', 'var(--text-primary)'),
    curve: {
      label: 'Line shape', type: 'select', display: 'segmented', value: 'smooth', group: 'trend', required: true,
      options: [opt('smooth', 'Smooth'), opt('linear', 'Straight'), opt('step', 'Steps')],
    },
    lineColor: colorField('Line colour', 'trend', 'var(--primary)'),
    lineWidth: { label: 'Line width (px)', type: 'number', min: 0.5, max: 8, step: 0.5, value: 1.5, group: 'trend' },
    fillOpacity: {
      label: 'Fill under the line (%)', type: 'number', min: 0, max: 100, step: 5, value: 15, group: 'trend',
      description: '0 = no fill.',
    },
    ...rangesFields('The first range the latest value falls in colours it. Leave an end empty for open-ended.'),
    rangeTarget: {
      label: 'Range colour applies to', type: 'select', display: 'segmented', value: 'value', group: 'colour', advanced: true, required: true,
      options: [opt('value', 'Number'), opt('both', 'Number and line')],
    },
    showChange: {
      label: 'Change since the first point', type: 'select', display: 'segmented', value: 'percent', group: 'change', required: true,
      options: [opt('off', 'Off'), opt('percent', '+12 %'), opt('delta', '+34')],
    },
    increaseIs: {
      label: 'An increase is', type: 'select', display: 'segmented', value: 'neutral', group: 'change', required: true,
      showIf: { showChange: ['percent', 'delta'] },
      options: [opt('good', 'Good'), opt('bad', 'Bad'), opt('neutral', 'Neutral')],
    },
    upColor: colorField('Colour when good', 'change', 'var(--success)', { advanced: true }),
    downColor: colorField('Colour when bad', 'change', 'var(--error)', { advanced: true }),
  }),
  migrations: [],
};

export const STAT_SPARKLINE_KIND: BuiltinKindSpec = {
  type: 'stat.sparkline',
  label: 'Stat with trend',
  category: 'Data',
  description: 'The latest value of a bound series with its trend line beside it.',
  icon: 'fas fa-arrow-trend-up',
  defaultW: 3,
  defaultH: 3,
  slots: [{ key: 'series', label: 'Series', shape: 'series', required: true }],
  template: STAT_SPARKLINE,
};
