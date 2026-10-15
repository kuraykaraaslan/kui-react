import { colorField, itemFormatFields, labelStyleFields, layoutField, opt, since, valueStyleFields } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `stat.attributes`: a bound record as label / value rows. */
export const STAT_ATTRIBUTES: SettingsTemplate = {
  id: 'builtin:stat.attributes',
  version: 1,
  namespace: '',
  label: 'Attributes',
  format: true,
  exportable: true,
  formatDefaults: { decimals: 2 },
  cardDefaults: { buttons: ['fullscreen', 'export'] },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'fields', label: 'Fields', tab: 'Data', since: 1 },
    { id: 'label', label: 'Labels', tab: 'Display', since: 1 },
    { id: 'value', label: 'Values', tab: 'Display', since: 1 },
    { id: 'rows', label: 'Rows', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('list', 'List', 'attributes-list'),
      opt('grid-2', 'Two columns', 'attributes-grid-2'),
      opt('grid-3', 'Three columns', 'attributes-grid-3'),
    ]),
    fields: {
      label: 'Fields', type: 'repeater', group: 'fields', max: 50,
      description: 'Which keys to show, in order. Leave empty to show every key of the record.',
      fields: {
        key: { label: 'Record key', type: 'data-key', slot: 'record', required: true },
        label: { label: 'Label', type: 'text', maxLength: 60, placeholder: 'The key, humanised' },
        ...itemFormatFields(),
        color: { label: 'Value colour', type: 'color' },
      },
    },
    ...labelStyleFields('label'),
    ...valueStyleFields('value'),
    maxRows: { label: 'Max rows', type: 'number', min: 1, max: 50, value: 20, group: 'rows' },
    emptyValue: { label: 'Shown for an empty value', type: 'text', maxLength: 20, value: '—', group: 'rows', advanced: true },
    dividers: { label: 'Lines between rows', type: 'boolean', value: true, group: 'rows' },
    dividerColor: colorField('Line colour', 'rows', undefined, { advanced: true, showIf: { dividers: true } }),
  }),
  migrations: [],
};

export const STAT_ATTRIBUTES_KIND: BuiltinKindSpec = {
  type: 'stat.attributes',
  label: 'Attributes',
  category: 'Data',
  description: 'A bound record as a label / value list.',
  icon: 'fas fa-list-ul',
  defaultW: 3,
  defaultH: 3,
  slots: [{ key: 'record', label: 'Record', shape: 'record', required: true }],
  template: STAT_ATTRIBUTES,
};
