import { colorField, fontField, layoutField, opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `control.button`: one press runs the placement's command (the command alone decides what is written). */
export const CONTROL_BUTTON: SettingsTemplate = {
  id: 'builtin:control.button',
  version: 1,
  namespace: '',
  label: 'Button',
  format: false,
  exportable: false,
  cardDefaults: { buttons: [] },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'button', label: 'Button', tab: 'Display', since: 1 },
    { id: 'appearance', label: 'Appearance', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('button', 'Button', 'button-button'),
      opt('tile', 'Tile with icon', 'button-tile'),
    ]),
    label: { label: 'Button text', type: 'text', maxLength: 40, placeholder: 'Run', group: 'button' },
    labelFont: fontField('Text font', 'button', { advanced: true }),
    icon: { label: 'Icon', type: 'icon', placeholder: 'fas fa-power-off', group: 'button' },
    iconSize: { label: 'Icon size (px)', type: 'number', min: 8, max: 96, value: 16, group: 'button', advanced: true },
    appearance: {
      label: 'Style', type: 'select', display: 'segmented', value: 'filled', group: 'appearance', required: true,
      options: [opt('filled', 'Filled'), opt('outlined', 'Outlined'), opt('ghost', 'Plain'), opt('underlined', 'Underlined')],
    },
    mainColor: colorField('Main colour', 'appearance', 'var(--primary)', {
      description: 'Fill of a filled button; text and border of the others.',
    }),
    textColor: colorField('Text colour', 'appearance', undefined, { advanced: true, description: 'Empty = from the style.' }),
    backgroundColor: colorField('Background colour', 'appearance', undefined, { advanced: true, description: 'Empty = from the style.' }),
    borderRadius: { label: 'Corner radius (px)', type: 'number', nullable: true, display: 'input', min: 0, max: 64,
      placeholder: 'Theme', group: 'appearance', advanced: true },
    size: {
      label: 'Size', type: 'select', display: 'segmented', value: 'md', group: 'appearance', required: true,
      options: [opt('sm', 'S'), opt('md', 'M'), opt('lg', 'L')],
    },
    fullWidth: { label: 'Fill the card width', type: 'boolean', value: true, group: 'appearance' },
  }),
  migrations: [],
};

export const CONTROL_BUTTON_KIND: BuiltinKindSpec = {
  type: 'control.button',
  label: 'Button',
  category: 'Controls',
  description: 'A button that runs a command, with the command’s own confirmation policy.',
  icon: 'fas fa-circle-play',
  defaultW: 3,
  defaultH: 2,
  slots: [],
  template: CONTROL_BUTTON,
};
