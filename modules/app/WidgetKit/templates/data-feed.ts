import { colorField, dateDisplayField, fontField, layoutField, opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `data.feed`: a bound table of events as a timeline, a list or compact lines. */
export const DATA_FEED: SettingsTemplate = {
  id: 'builtin:data.feed',
  version: 1,
  namespace: '',
  label: 'Activity feed',
  format: false,
  exportable: true,
  groups: [
    { id: 'columns', label: 'Columns', tab: 'Data', since: 1 },
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'feed', label: 'Feed', tab: 'Display', since: 1 },
    { id: 'title', label: 'Title', tab: 'Look', since: 1 },
    { id: 'description', label: 'Description', tab: 'Look', since: 1 },
    { id: 'time', label: 'Time', tab: 'Look', since: 1 },
    { id: 'marker', label: 'Marker', tab: 'Look', since: 1 },
  ],
  fields: since(1, {
    timeColumn: { label: 'Time column', type: 'data-key', slot: 'events', value: 'time', required: true, group: 'columns' },
    titleColumn: {
      label: 'Title column', type: 'data-key', slot: 'events', value: 'title', required: true, group: 'columns',
      description: 'A row without a title is not shown.',
    },
    descriptionColumn: { label: 'Description column', type: 'data-key', slot: 'events', group: 'columns' },
    colorColumn: {
      label: 'Colour column', type: 'data-key', slot: 'events', group: 'columns',
      description: 'A column holding a colour name (success, warning, error, info, neutral, primary) or a CSS colour.',
    },
    iconColumn: {
      label: 'Icon column', type: 'data-key', slot: 'events', group: 'columns', advanced: true,
      description: 'A column holding an icon name (fas fa-bolt). Empty values use the default icon.',
    },
    layout: layoutField([
      opt('timeline', 'Timeline', 'feed-timeline'),
      opt('list', 'List', 'feed-list'),
      opt('compact', 'One line each', 'feed-compact'),
    ]),
    order: {
      label: 'Order', type: 'select', display: 'segmented', value: 'newest', group: 'feed', required: true,
      options: [opt('newest', 'Newest first'), opt('oldest', 'Oldest first')],
      description: 'An event whose time cannot be read is always last.',
    },
    maxItems: { label: 'Items shown', type: 'number', display: 'input', min: 1, max: 50, value: 10, group: 'feed' },
    timeDisplay: dateDisplayField('Time shown as', 'feed', 'relative'),
    groupByDay: { label: 'Group by day', type: 'boolean', value: false, group: 'feed' },
    titleFont: fontField('Title font', 'title', { advanced: true }),
    titleColor: colorField('Title colour', 'title', 'var(--text-primary)'),
    descriptionFont: fontField('Description font', 'description', { advanced: true }),
    descriptionColor: colorField('Description colour', 'description', 'var(--text-secondary)'),
    descriptionLines: {
      label: 'Description lines', type: 'number', display: 'input', min: 0, max: 10, value: 2, group: 'description', advanced: true,
      description: '0 = the whole text.',
    },
    timeFont: fontField('Time font', 'time', { advanced: true }),
    timeColor: colorField('Time colour', 'time', 'var(--text-secondary)', { advanced: true }),
    markerColor: colorField('Marker colour', 'marker', 'var(--text-disabled)', {
      description: 'Used when the row has no colour of its own.',
    }),
    icon: { label: 'Default icon', type: 'icon', group: 'marker', placeholder: 'A dot', advanced: true },
    lineColor: colorField('Timeline line colour', 'marker', 'var(--border)', { advanced: true, showIf: { layout: 'timeline' } }),
  }),
  migrations: [],
};

export const DATA_FEED_KIND: BuiltinKindSpec = {
  type: 'data.feed',
  label: 'Activity feed',
  category: 'Data',
  description: 'A bound table of events as a timeline or a list, newest or oldest first.',
  icon: 'fas fa-timeline',
  defaultW: 4,
  defaultH: 5,
  slots: [{ key: 'events', label: 'Events', shape: 'table', required: true }],
  template: DATA_FEED,
};
