import { colorField, disableWhenField, layoutField, minBelowMax, opt, since, valueStyleFields } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';
import { positiveStep } from '../views/content-logic';

/** `control.setpoint`: type a number and apply it, or step it up and down. */
export const CONTROL_SETPOINT: SettingsTemplate = {
  id: 'builtin:control.setpoint',
  version: 1,
  namespace: '',
  label: 'Set point',
  format: true,
  exportable: false,
  cardDefaults: { buttons: [] },
  formatDefaults: { decimals: 0 },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'range', label: 'Range', tab: 'Display', since: 1 },
    { id: 'value', label: 'Value', tab: 'Display', since: 1 },
    { id: 'appearance', label: 'Appearance', tab: 'Display', since: 1 },
    { id: 'safety', label: 'Safety', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('input', 'Type and apply', 'setpoint-input'),
      opt('stepper', 'Minus and plus buttons', 'setpoint-stepper'),
    ]),
    min: { label: 'Minimum', type: 'number', display: 'input', value: 0, group: 'range' },
    max: { label: 'Maximum', type: 'number', display: 'input', value: 100, group: 'range' },
    step: { label: 'Step', type: 'number', display: 'input', min: 0, value: 1, group: 'range' },
    showValue: { label: 'Show the current value', type: 'boolean', value: true, group: 'value',
      description: 'The value the device reports, next to the one being set.' },
    ...valueStyleFields('value'),
    applyLabel: { label: 'Apply button text', type: 'text', maxLength: 24, placeholder: 'Apply', group: 'appearance',
      showIf: { layout: 'input' } },
    buttonColor: colorField('Button colour', 'appearance', 'var(--primary)'),
    borderColor: colorField('Border colour', 'appearance', 'var(--border)', { advanced: true }),
    disableWhen: disableWhenField(),
  }),
  rules: [minBelowMax('min', 'max'), positiveStep('step')],
  migrations: [],
};

export const CONTROL_SETPOINT_KIND: BuiltinKindSpec = {
  type: 'control.setpoint',
  label: 'Set point',
  category: 'Device Controls',
  description: 'A number input with Apply, or a stepper; out-of-range entries are a field error and send nothing.',
  icon: 'fas fa-gauge-simple',
  defaultW: 3,
  defaultH: 2,
  slots: [{ key: 'value', label: 'Current value', shape: 'scalar', required: false }],
  template: CONTROL_SETPOINT,
};
