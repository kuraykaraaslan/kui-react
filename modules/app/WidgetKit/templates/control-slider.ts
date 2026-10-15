import { colorField, disableWhenField, layoutField, minBelowMax, opt, since, valueStyleFields } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';
import { positiveStep } from '../views/content-logic';

/** `control.slider`: a bound number, written once per gesture (or debounced). */
export const CONTROL_SLIDER: SettingsTemplate = {
  id: 'builtin:control.slider',
  version: 1,
  namespace: '',
  label: 'Slider',
  format: true,
  exportable: false,
  cardDefaults: { buttons: [] },
  formatDefaults: { decimals: 0 },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'range', label: 'Range', tab: 'Display', since: 1 },
    { id: 'value', label: 'Value', tab: 'Display', since: 1 },
    { id: 'ticks', label: 'Ticks', tab: 'Display', since: 1 },
    { id: 'colours', label: 'Colours', tab: 'Display', since: 1 },
    { id: 'icons', label: 'Icons', tab: 'Display', since: 1 },
    { id: 'commit', label: 'Sending', tab: 'Display', since: 1 },
    { id: 'safety', label: 'Safety', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('default', 'Value above the slider', 'slider-default'),
      opt('extended', 'With icons at both ends', 'slider-extended'),
      opt('compact', 'One line', 'slider-compact'),
    ]),
    min: { label: 'Minimum', type: 'number', display: 'input', value: 0, group: 'range' },
    max: { label: 'Maximum', type: 'number', display: 'input', value: 100, group: 'range' },
    step: { label: 'Step', type: 'number', display: 'input', min: 0, value: 1, group: 'range' },
    showValue: { label: 'Show the value', type: 'boolean', value: true, group: 'value' },
    ...valueStyleFields('value'),
    showTicks: { label: 'Show minimum and maximum', type: 'boolean', value: true, group: 'ticks' },
    tickMarks: { label: 'Tick marks', type: 'number', nullable: true, display: 'input', min: 2, max: 21, group: 'ticks', advanced: true,
      placeholder: 'None', description: 'How many evenly spaced marks to draw under the track.' },
    mainColor: colorField('Main colour', 'colours', 'var(--primary)'),
    trackColor: colorField('Track colour', 'colours', 'var(--surface-sunken)', { advanced: true }),
    disabledMainColor: colorField('Main colour when disabled', 'colours', 'var(--text-disabled)', { advanced: true }),
    disabledTrackColor: colorField('Track colour when disabled', 'colours', 'var(--surface-sunken)', { advanced: true }),
    startIcon: { label: 'Start icon', type: 'icon', placeholder: 'fas fa-volume-low', group: 'icons', showIf: { layout: 'extended' } },
    endIcon: { label: 'End icon', type: 'icon', placeholder: 'fas fa-volume-high', group: 'icons', showIf: { layout: 'extended' } },
    iconColor: colorField('Icon colour', 'icons', 'var(--text-secondary)', { advanced: true, showIf: { layout: 'extended' } }),
    commit: {
      label: 'Send the value', type: 'select', display: 'segmented', value: 'release', group: 'commit', required: true, advanced: true,
      options: [opt('release', 'When released'), opt('debounced', 'While dragging, after a pause')],
    },
    debounceMs: { label: 'Pause before sending (ms)', type: 'number', display: 'input', min: 100, max: 5000, value: 500,
      group: 'commit', advanced: true, showIf: { commit: 'debounced' } },
    disableWhen: disableWhenField(),
  }),
  rules: [minBelowMax('min', 'max'), positiveStep('step')],
  migrations: [],
};

export const CONTROL_SLIDER_KIND: BuiltinKindSpec = {
  type: 'control.slider',
  label: 'Slider',
  category: 'Device Controls',
  description: 'A slider reading a bound number and writing once, on release.',
  icon: 'fas fa-sliders',
  defaultW: 4,
  defaultH: 3,
  slots: [{ key: 'value', label: 'Current value', shape: 'scalar', required: false }],
  template: CONTROL_SLIDER,
};
