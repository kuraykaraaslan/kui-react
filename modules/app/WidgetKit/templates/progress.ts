import { colorField, fontField, layoutField, opt, rangesFields, since, valueStyleFields } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `progress`: a bound number against a target, as a bar or a ring. */
export const PROGRESS: SettingsTemplate = {
  id: 'builtin:progress',
  version: 1,
  namespace: '',
  label: 'Progress',
  format: true,
  exportable: false,
  formatDefaults: { decimals: 0 },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'target', label: 'Target', tab: 'Data', since: 1 },
    { id: 'value', label: 'Value text', tab: 'Display', since: 1 },
    { id: 'bar', label: 'Bar', tab: 'Display', since: 1 },
    { id: 'colour', label: 'Colour ranges', tab: 'Display', since: 1 },
    { id: 'ticks', label: 'Scale', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('bar-labelled', 'Bar with the value above', 'progress-bar-labelled'),
      opt('bar', 'Bar with the value beside', 'progress-bar'),
      opt('ring', 'Ring', 'progress-ring'),
    ]),
    target: {
      label: 'Target', type: 'number', display: 'input', min: 0, value: 100, group: 'target',
      description: 'Used when no target slot is bound.',
    },
    valueText: {
      label: 'Show', type: 'select', display: 'segmented', value: 'value', group: 'value', required: true,
      options: [opt('value', '42 of 100'), opt('percent', '42 %'), opt('both', '42 of 100 · 42 %'), opt('none', 'Nothing')],
    },
    ...valueStyleFields('value'),
    barColor: colorField('Bar colour', 'bar', 'var(--primary)'),
    trackColor: colorField('Track colour', 'bar', 'var(--surface-overlay)', { advanced: true }),
    thickness: { label: 'Thickness (px)', type: 'number', min: 2, max: 48, value: 8, group: 'bar' },
    roundedEnds: { label: 'Rounded ends', type: 'boolean', value: true, group: 'bar', advanced: true },
    ringSize: { label: 'Ring size (px)', type: 'number', min: 40, max: 400, value: 96, group: 'bar', showIf: { layout: 'ring' } },
    ...rangesFields('The first range the value (not the percentage) falls in colours the bar.'),
    showTicks: { label: 'Show 0 and the target under the bar', type: 'boolean', value: false, group: 'ticks', showIf: { layout: ['bar', 'bar-labelled'] } },
    ticksFont: fontField('Scale font', 'ticks', { advanced: true, showIf: { showTicks: true } }),
    ticksColor: colorField('Scale colour', 'ticks', 'var(--text-secondary)', { advanced: true, showIf: { showTicks: true } }),
  }),
  migrations: [],
};

export const PROGRESS_KIND: BuiltinKindSpec = {
  type: 'progress',
  label: 'Progress',
  category: 'Data',
  description: 'A bound number against a target, as a bar.',
  icon: 'fas fa-bars-progress',
  defaultW: 3,
  defaultH: 2,
  slots: [
    { key: 'value', label: 'Value', shape: 'scalar', required: true },
    { key: 'target', label: 'Target', shape: 'scalar', required: false },
  ],
  template: PROGRESS,
};
