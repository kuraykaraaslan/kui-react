import { colorField, fontField, layoutField, minBelowMax, opt, rangesFields, since, valueStyleFields } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

const ranges = rangesFields('The value takes the colour of the range it falls in. Leave empty for a single colour.');

/** `gauge`: one bound number on an arc, a donut or a bar, with colour bands. */
export const GAUGE: SettingsTemplate = {
  id: 'builtin:gauge',
  version: 1,
  namespace: '',
  label: 'Gauge',
  format: true,
  exportable: false,
  formatDefaults: { decimals: 0 },
  cardDefaults: { staleDisplay: 'dim' },
  rules: [
    minBelowMax('min', 'max'),
    (v) => typeof v.startAngle === 'number' && typeof v.endAngle === 'number' && v.startAngle >= v.endAngle
      ? [{ path: 'endAngle', message: 'End angle must be greater than start angle' }]
      : [],
  ],
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'scale', label: 'Scale', tab: 'Display', since: 1 },
    { id: 'value', label: 'Value', tab: 'Display', since: 1 },
    { id: 'needle', label: 'Needle', tab: 'Display', since: 1 },
    { id: 'bar', label: 'Bar and track', tab: 'Display', since: 1 },
    { id: 'colour', label: 'Colour ranges', tab: 'Display', since: 1 },
    { id: 'motion', label: 'Animation', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('arc', 'Half circle', 'gauge-arc'),
      opt('donut', 'Donut', 'gauge-donut'),
      opt('bar-horizontal', 'Horizontal bar', 'gauge-bar-h'),
      opt('bar-vertical', 'Vertical bar', 'gauge-bar-v'),
    ]),
    startAngle: {
      label: 'Start angle (°)', type: 'number', display: 'input', min: -360, max: 360, value: -135, group: 'layout', advanced: true,
      showIf: { layout: 'donut' }, description: 'Clockwise from 12 o\'clock.',
    },
    endAngle: {
      label: 'End angle (°)', type: 'number', display: 'input', min: -360, max: 360, value: 135, group: 'layout', advanced: true,
      showIf: { layout: 'donut' },
    },
    min: { label: 'Minimum', type: 'number', display: 'input', value: 0, group: 'scale', description: 'Used when no minimum slot is bound.' },
    max: { label: 'Maximum', type: 'number', display: 'input', value: 100, group: 'scale', description: 'Used when no maximum slot is bound.' },
    showMinMax: { label: 'Show min and max', type: 'boolean', value: true, group: 'scale' },
    minMaxFont: fontField('Min / max font', 'scale', { advanced: true, showIf: { showMinMax: true } }),
    minMaxColor: colorField('Min / max colour', 'scale', 'var(--text-secondary)', { advanced: true, showIf: { showMinMax: true } }),
    ticks: { label: 'Tick marks', type: 'number', min: 0, max: 21, value: 0, group: 'scale', advanced: true, description: '0 = none; ends included.' },
    showValue: { label: 'Show the number', type: 'boolean', value: true, group: 'value' },
    ...valueStyleFields('value'),
    unitTitle: { label: 'Units title', type: 'text', maxLength: 40, placeholder: 'Temperature', group: 'value', description: 'A caption under the gauge.' },
    needle: { label: 'Needle', type: 'boolean', value: false, group: 'needle' },
    needleColor: colorField('Needle colour', 'needle', 'var(--text-primary)', { advanced: true, showIf: { needle: true } }),
    barColor: colorField('Bar colour', 'bar', 'var(--primary)', { description: 'Used when no colour range matches.' }),
    trackColor: colorField('Track colour', 'bar', 'var(--border)', { advanced: true }),
    thickness: { label: 'Thickness', type: 'number', min: 2, max: 40, value: 16, group: 'bar' },
    roundedCaps: { label: 'Rounded ends', type: 'boolean', value: false, group: 'bar', advanced: true },
    ranges: ranges.ranges,
    // Today's gauge counts a value on a boundary in the band ending there.
    rangeEdges: { ...ranges.rangeEdges, value: 'to' },
    rangeTarget: {
      label: 'Ranges show as', type: 'select', display: 'segmented', value: 'both', group: 'colour', required: true,
      options: [opt('both', 'Bands and bar colour'), opt('bar', 'Bar colour'), opt('track', 'Bands on the track')],
    },
    animation: { label: 'Animate changes', type: 'boolean', value: true, group: 'motion', advanced: true },
  }),
  migrations: [],
};

export const GAUGE_KIND: BuiltinKindSpec = {
  type: 'gauge',
  label: 'Gauge',
  category: 'Gauges & Levels',
  description: 'One bound number on a half-donut gauge with threshold bands.',
  icon: 'fas fa-gauge-high',
  defaultW: 3,
  defaultH: 3,
  slots: [
    { key: 'value', label: 'Value', shape: 'scalar', required: true },
    { key: 'min', label: 'Minimum', shape: 'scalar', required: false },
    { key: 'max', label: 'Maximum', shape: 'scalar', required: false },
  ],
  template: GAUGE,
};
