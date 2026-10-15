import { colorField, fontField, itemFormatFields, opt, rangesFields, since } from '../settings/packs';
import type { FieldSchema } from '../../SchemaForm/types';
import type { SettingsTemplate, Sparse } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';
import { isInternalPath } from './map';

const RANGE_ITEM: Record<string, FieldSchema> = {
  from: { label: 'From', type: 'number', nullable: true, display: 'input', placeholder: 'open' },
  to: { label: 'To', type: 'number', nullable: true, display: 'input', placeholder: 'open' },
  color: { label: 'Colour', type: 'color', required: true, value: 'var(--success)' },
  label: { label: 'Label', type: 'text', maxLength: 40, placeholder: 'High' },
};

/** Every column link template is an internal path before `{column}` expansion. */
const columnLinksAreInternal = (v: Sparse) =>
  (Array.isArray(v.columns) ? v.columns : []).flatMap((c, i) => {
    const t = c && typeof c === 'object' ? (c as Sparse).linkTemplate : undefined;
    return typeof t === 'string' && t !== '' && !isInternalPath(t)
      ? [{ path: `columns.${i}.linkTemplate`, message: 'The link must be an internal path that starts with a single /' }]
      : [];
  });

/** `data.table`: a bound table with per-column display, viewer sort/search/paging and full styling. */
export const DATA_TABLE: SettingsTemplate = {
  id: 'builtin:data.table',
  version: 1,
  namespace: '',
  label: 'Table',
  format: true,
  exportable: true,
  cardDefaults: { padding: 4, buttons: ['fullscreen', 'export'] },
  groups: [
    { id: 'columns', label: 'Columns', tab: 'Display', since: 1 },
    { id: 'rows', label: 'Rows', tab: 'Display', since: 1 },
    { id: 'look', label: 'Look', tab: 'Look', since: 1 },
    { id: 'header', label: 'Header', tab: 'Look', since: 1 },
    { id: 'cells', label: 'Cells', tab: 'Look', since: 1 },
    { id: 'colour', label: 'Colour ranges', tab: 'Look', since: 1 },
  ],
  fields: since(1, {
    columns: {
      label: 'Columns', type: 'repeater', group: 'columns', max: 30, value: [],
      description: 'Pick, rename and order the columns the query declares. Empty = all of them, in the query\'s order. A key the query no longer declares is skipped.',
      fields: {
        key: { label: 'Column', type: 'data-key', slot: 'rows', required: true },
        label: { label: 'Header', type: 'text', maxLength: 60, placeholder: 'As declared' },
        visible: {
          label: 'Show', type: 'select', value: 'always', required: true,
          options: [opt('always', 'Always'), opt('desktop', 'Not on phones'), opt('hidden', 'Hidden')],
        },
        cell: {
          label: 'Cell', type: 'select', display: 'segmented', value: 'auto', required: true,
          options: [opt('auto', 'Auto'), opt('text', 'Text'), opt('badge', 'Badge'), opt('bar', 'Bar'), opt('link', 'Link')],
          description: 'Auto: a badge for badge columns, otherwise text. Badge: the value names a colour (success, warning, error, info, neutral, primary). Bar: a bar on the raw number, coloured by the ranges. Link: internal paths only.',
        },
        linkTemplate: {
          label: 'Link', type: 'text', maxLength: 300, placeholder: '/admin/devices/{id}', showIf: { cell: 'link' },
          description: 'Internal path only; {column} is replaced by the row\'s value. Empty = the cell value is the path.',
        },
        sortable: { label: 'Sortable', type: 'boolean', value: true, advanced: true },
        align: {
          label: 'Align', type: 'select', value: 'auto', advanced: true,
          options: [opt('auto', 'Auto (numbers right)'), opt('start', 'Start'), opt('center', 'Centre'), opt('end', 'End')],
        },
        width: {
          label: 'Width', type: 'select', value: 'auto', advanced: true,
          options: [opt('auto', 'Auto'), opt('narrow', 'Narrow'), opt('wide', 'Wide'), opt('px', 'Fixed (px)')],
        },
        widthPx: { label: 'Width (px)', type: 'number', min: 24, max: 800, value: 120, advanced: true, showIf: { width: 'px' } },
        ...itemFormatFields(),
        color: { label: 'Text colour', type: 'color', advanced: true },
        headerColor: { label: 'Header colour', type: 'color', advanced: true },
        barMax: {
          label: 'Bar maximum', type: 'number', nullable: true, display: 'input', advanced: true, placeholder: 'Largest value',
          showIf: { cell: 'bar' }, description: 'The value of a full bar. Empty = the largest value in the loaded rows.',
        },
        ranges: {
          label: 'Colour ranges', type: 'repeater', max: 20, advanced: true, fields: { ...RANGE_ITEM },
          description: 'Bar cells take the colour of the first range the value falls in (text cells too, when set). Empty = the table\'s ranges.',
        },
      },
    },
    maxRows: {
      label: 'Rows shown', type: 'number', display: 'input', min: 1, max: 100, value: 10, group: 'rows',
      description: 'Per page with page buttons. For a query that pages on the server, the server decides the page size.',
    },
    paging: {
      label: 'More rows', type: 'select', display: 'segmented', value: 'none', group: 'rows', required: true,
      options: [opt('none', 'None'), opt('pages', 'Page buttons')],
      description: 'Pages through the loaded rows. A query that pages on the server always shows its own pager.',
    },
    sortable: { label: 'Viewers can sort', type: 'boolean', value: true, group: 'rows' },
    defaultSort: { label: 'Sort by', type: 'data-key', slot: 'rows', group: 'rows', advanced: true, placeholder: 'The query\'s order' },
    defaultSortDir: {
      label: 'Direction', type: 'select', display: 'segmented', value: 'desc', group: 'rows', advanced: true, required: true,
      options: [opt('desc', 'Descending'), opt('asc', 'Ascending')],
    },
    search: {
      label: 'Search box', type: 'boolean', value: true, group: 'rows',
      description: 'Filters the loaded rows; for a query that pages on the server, shown when the query supports search.',
    },
    columnPicker: { label: 'Viewers can hide columns', type: 'boolean', value: false, group: 'rows', advanced: true },
    density: {
      label: 'Row height', type: 'select', display: 'segmented', value: 'compact', group: 'look', required: true,
      options: [opt('compact', 'Compact'), opt('normal', 'Normal'), opt('comfortable', 'Roomy')],
    },
    stickyHeader: { label: 'Keep the header visible', type: 'boolean', value: true, group: 'look', advanced: true },
    striped: { label: 'Striped rows', type: 'boolean', value: false, group: 'look' },
    stripeColor: colorField('Stripe colour', 'look', 'var(--surface-sunken)', { advanced: true, showIf: { striped: true } }),
    borderColor: colorField('Border colour', 'look', 'var(--border)', { advanced: true }),
    rowColorColumn: {
      label: 'Row colour column', type: 'data-key', slot: 'rows', group: 'look', advanced: true,
      description: 'A column holding a colour name (success, warning, error, info, neutral, primary) or a CSS colour tints the row.',
    },
    headerFont: fontField('Header font', 'header', { advanced: true }),
    headerColor: colorField('Header text colour', 'header', 'var(--text-secondary)'),
    headerBackground: colorField('Header background', 'header', undefined, { advanced: true }),
    cellFont: fontField('Cell font', 'cells', { advanced: true }),
    cellColor: colorField('Cell text colour', 'cells', 'var(--text-primary)', { advanced: true }),
    ...rangesFields('Colours for Bar cells (on the raw value) when the column has no ranges of its own.', 'colour'),
  }),
  rules: [columnLinksAreInternal],
  migrations: [],
};

export const DATA_TABLE_KIND: BuiltinKindSpec = {
  type: 'data.table',
  label: 'Table',
  category: 'Data',
  description: 'A bound table: pick, rename and style columns, with sort, search and paging for viewers.',
  icon: 'fas fa-table',
  defaultW: 6,
  defaultH: 4,
  slots: [{ key: 'rows', label: 'Rows', shape: 'table', required: true }],
  template: DATA_TABLE,
};
