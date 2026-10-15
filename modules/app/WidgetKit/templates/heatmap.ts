import { colorField, fontField, legendFields, minBelowMax, opt, rangesFields, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

const bands = rangesFields('Cells whose value falls in a range take its colour; others use the sequential colour.', 'scale');

/** `heatmap`: bound table rows (x, y, value) as a colour grid. */
export const HEATMAP: SettingsTemplate = {
  id: 'builtin:heatmap',
  version: 1,
  namespace: '',
  label: 'Heatmap',
  format: true,
  exportable: true,
  formatDefaults: { decimals: 1 },
  cardDefaults: { padding: 8 },
  groups: [
    { id: 'data', label: 'Columns', tab: 'Data', since: 1 },
    { id: 'scale', label: 'Colour scale', tab: 'Display', since: 1 },
    { id: 'cells', label: 'Cells', tab: 'Display', since: 1 },
    { id: 'legend', label: 'Legend', tab: 'Display', since: 1 },
    { id: 'tooltip', label: 'Tooltip', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    xColumn: { label: 'X column', type: 'data-key', slot: 'cells', value: 'x', placeholder: 'x', group: 'data', required: true },
    yColumn: { label: 'Y column', type: 'data-key', slot: 'cells', value: 'y', placeholder: 'y', group: 'data', required: true },
    valueColumn: { label: 'Value column', type: 'data-key', slot: 'cells', value: 'value', placeholder: 'value', group: 'data', required: true },
    scale: {
      label: 'Colours', type: 'select', display: 'segmented', value: 'sequential', group: 'scale', required: true,
      options: [opt('sequential', 'One colour, light to strong'), opt('bands', 'Colour ranges')],
    },
    color: colorField('Colour', 'scale', 'var(--primary)'),
    ranges: { ...bands.ranges, showIf: { scale: 'bands' } },
    rangeEdges: { ...bands.rangeEdges, showIf: { scale: 'bands' } },
    min: { label: 'Scale minimum', type: 'number', nullable: true, display: 'input', placeholder: 'From the data', group: 'scale' },
    max: { label: 'Scale maximum', type: 'number', nullable: true, display: 'input', placeholder: 'From the data', group: 'scale' },
    valueLabels: {
      label: 'Value in each cell', type: 'select', display: 'segmented', value: 'none', group: 'cells', required: true,
      options: [opt('none', 'Off'), opt('value', 'On')],
      description: 'Hidden automatically when cells are too small.',
    },
    tickFont: fontField('Axis label font', 'cells', { advanced: true }),
    tickColor: colorField('Axis label colour', 'cells', undefined, { advanced: true }),
    ...legendFields('legend', 'bottom', false),
    valueName: { label: 'Value name in the tooltip', type: 'text', maxLength: 30, placeholder: 'Value', group: 'tooltip', advanced: true },
    showTooltip: { label: 'Tooltip on hover', type: 'boolean', value: true, group: 'tooltip' },
  }),
  rules: [minBelowMax('min', 'max')],
  migrations: [],
};

export const HEATMAP_KIND: BuiltinKindSpec = {
  type: 'heatmap',
  label: 'Heatmap',
  category: 'Charts',
  description: 'Bound table rows (x, y, value) as a colour grid — e.g. hour of day by weekday, device by day.',
  icon: 'fas fa-table-cells',
  defaultW: 6,
  defaultH: 4,
  slots: [{ key: 'cells', label: 'Cells', shape: 'table', required: true }],
  template: HEATMAP,
};
