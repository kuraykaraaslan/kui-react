import { colorField, disableWhenField, fontField, iconFields, layoutField, opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `control.switch`: reads a bound state, asks the host to write the toggled value. */
export const CONTROL_SWITCH: SettingsTemplate = {
  id: 'builtin:control.switch',
  version: 1,
  namespace: '',
  label: 'Switch',
  format: false,
  exportable: false,
  cardDefaults: { buttons: [] },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'label', label: 'Label', tab: 'Display', since: 1 },
    { id: 'states', label: 'States', tab: 'Display', since: 1 },
    { id: 'colours', label: 'Switch colours', tab: 'Display', since: 1 },
    { id: 'reading', label: 'Reading', tab: 'Data', since: 1 },
    { id: 'safety', label: 'Safety', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('right', 'Label left, switch right', 'switch-right'),
      opt('left', 'Switch left, label right', 'switch-left'),
      opt('centered', 'Centred, large', 'switch-centered'),
    ]),
    label: { label: 'Label', type: 'text', maxLength: 40, group: 'label',
      description: 'Text next to the switch. Empty = none (the card title often says it).' },
    labelFont: fontField('Label font', 'label', { advanced: true }),
    labelColor: colorField('Label colour', 'label', 'var(--text-primary)', { advanced: true }),
    ...iconFields('label', 'var(--text-secondary)', 20),
    showStateText: { label: 'Show on/off text', type: 'boolean', value: true, group: 'states' },
    onLabel: { label: 'On text', type: 'text', maxLength: 24, placeholder: 'On', group: 'states', showIf: { showStateText: true } },
    offLabel: { label: 'Off text', type: 'text', maxLength: 24, placeholder: 'Off', group: 'states', showIf: { showStateText: true } },
    unknownLabel: { label: 'Unknown text', type: 'text', maxLength: 24, placeholder: 'State unknown', group: 'states', advanced: true },
    stateFont: fontField('State text font', 'states', { advanced: true, showIf: { showStateText: true } }),
    onTextColor: colorField('On text colour', 'states', 'var(--text-primary)', { advanced: true, showIf: { showStateText: true } }),
    offTextColor: colorField('Off text colour', 'states', 'var(--text-secondary)', { advanced: true, showIf: { showStateText: true } }),
    unknownTextColor: colorField('Unknown text colour', 'states', 'var(--warning)', { advanced: true }),
    onColor: colorField('Colour when on', 'colours', 'var(--success)'),
    offColor: colorField('Colour when off', 'colours', 'var(--border-strong)', { advanced: true }),
    disabledColor: colorField('Colour when disabled', 'colours', 'var(--surface-sunken)', { advanced: true }),
    thumbColor: colorField('Knob colour', 'colours', 'var(--primary-fg)', { advanced: true }),
    onMatch: { label: 'Value that means on', type: 'text', maxLength: 40, placeholder: 'true, 1, on', group: 'reading', advanced: true,
      description: 'Empty = true, 1, "on", "yes" and "true" mean on. Otherwise only this exact value does.' },
    disableWhen: disableWhenField(),
  }),
  migrations: [],
};

export const CONTROL_SWITCH_KIND: BuiltinKindSpec = {
  type: 'control.switch',
  label: 'Switch',
  category: 'Device Controls',
  description: 'An on/off switch reading a bound boolean and writing on toggle.',
  icon: 'fas fa-toggle-on',
  defaultW: 3,
  defaultH: 2,
  slots: [{ key: 'value', label: 'Current state', shape: 'scalar', required: false }],
  template: CONTROL_SWITCH,
};
