// The one factory behind the time-series chart templates (chart.line, chart.bar, chart.area).
// Each preset is its own template id and version; they share the series repeater, the axis,
// legend, tooltip and threshold packs. Pure data.

import {
  axisFields, colorField, itemFormatFields, legendFields, minBelowMax, opt, since, thresholdsField, tooltipField,
} from '../settings/packs';
import type { SettingsTemplate, TemplateField, TemplateGroup } from '../settings/types';
import type { BuiltinKindSpec, SlotSpec } from '../kind';

export type SeriesPreset = 'line' | 'bar' | 'area';

/** Card buttons a series chart starts with: full screen and CSV download. */
export const SERIES_CARD_DEFAULTS = { buttons: ['fullscreen', 'export'] };

/** The repeatable series slot every series chart declares (`series`, `series#2` … `series#8`). */
export const SERIES_SLOT: SlotSpec = { key: 'series', label: 'Series', shape: 'series', required: true, repeatable: true };

const CURVE_OPTIONS = [
  opt('smooth', 'Smooth', 'line-smooth'),
  opt('linear', 'Straight', 'line-linear'),
  opt('step', 'Steps', 'line-step'),
];

/** Per-series styling: matched by series name (`*` = every series). */
export function seriesField(preset: SeriesPreset): TemplateField {
  const stroked = preset !== 'bar';
  return {
    since: 1,
    label: 'Series', type: 'repeater', group: 'series', max: 20,
    description: 'Style a series by its name; * matches every series and an exact name wins over *. ${name} in a label stands for the series\' own name.',
    fields: {
      key: { label: 'Series', type: 'data-key', slot: 'series', placeholder: '*', required: true },
      label: { label: 'Label', type: 'text', maxLength: 60, placeholder: '${name}' },
      color: { label: 'Colour', type: 'color', placeholder: 'Automatic' },
      ...itemFormatFields(),
      ...(stroked ? {
        lineStyle: {
          label: 'Line', type: 'select', display: 'segmented', value: 'solid',
          options: [opt('solid', 'Solid'), opt('dashed', 'Dashed'), opt('dotted', 'Dotted')],
        },
        width: { label: 'Line width (px)', type: 'number', nullable: true, display: 'input', min: 1, max: 8, placeholder: 'Chart width' },
        showPoints: {
          label: 'Points', type: 'select', display: 'segmented', value: '',
          options: [opt('', 'Chart setting'), opt('on', 'On'), opt('off', 'Off')],
        },
        fillOpacity: {
          label: 'Fill opacity', type: 'number', nullable: true, display: 'input', min: 0, max: 1, step: 0.05,
          placeholder: preset === 'area' ? 'Chart fill' : 'No fill',
        },
      } : {}),
      startHidden: { label: 'Hidden until clicked in the legend', type: 'boolean', value: false },
    },
  } as TemplateField;
}

const groupsFor = (preset: SeriesPreset): TemplateGroup[] => [
  { id: 'series', label: 'Series', tab: 'Display', since: 1 },
  preset === 'line' ? { id: 'lines', label: 'Lines', tab: 'Display', since: 1 }
    : preset === 'bar' ? { id: 'bars', label: 'Bars', tab: 'Display', since: 1 }
      : { id: 'area', label: 'Area', tab: 'Display', since: 1 },
  { id: 'axis', label: 'Axis', tab: 'Display', since: 1 },
  { id: 'legend', label: 'Legend', tab: 'Display', since: 1 },
  { id: 'tooltip', label: 'Tooltip', tab: 'Display', since: 1 },
  { id: 'thresholds', label: 'Thresholds', tab: 'Display', since: 1 },
];

type Pack = Record<string, Omit<TemplateField, 'since'>>;

const presetFields = (preset: SeriesPreset): Pack => {
  if (preset === 'bar') {
    const bars: Pack = {
      stacked: { label: 'Stack the series', type: 'boolean', value: false, group: 'bars' },
      orientation: {
        label: 'Bars', type: 'select', display: 'segmented', value: 'vertical', group: 'bars', required: true,
        options: [opt('vertical', 'Columns'), opt('horizontal', 'Horizontal bars')],
      },
      valueLabels: {
        label: 'Value labels', type: 'select', display: 'segmented', value: 'none', group: 'bars', required: true,
        options: [opt('none', 'Off'), opt('value', 'Value on each bar')],
      },
      barRadius: { label: 'Corner radius (px)', type: 'number', min: 0, max: 16, value: 4, group: 'bars', advanced: true },
    };
    return bars;
  }
  const g = preset === 'line' ? 'lines' : 'area';
  const stroke: Pack = {
    curve: { label: 'Line shape', type: 'select', display: 'cards', value: 'smooth', group: g, required: true, options: CURVE_OPTIONS },
    lineWidth: { label: 'Line width (px)', type: 'number', min: 1, max: 8, value: 2, group: g, advanced: true },
    showPoints: { label: 'Points on every value', type: 'boolean', value: false, group: g, advanced: true },
  };
  if (preset === 'line') return stroke;
  return {
    ...stroke,
    stacked: { label: 'Stack the series', type: 'boolean', value: false, group: 'area' },
    fill: {
      label: 'Fill', type: 'select', display: 'segmented', value: 'soft', group: 'area', required: true,
      options: [opt('none', 'None'), opt('soft', 'Soft'), opt('medium', 'Medium'), opt('solid', 'Strong')],
    },
  };
};

/** The settings template for one series preset. */
export function seriesTemplate(preset: SeriesPreset, label: string): SettingsTemplate {
  return {
    id: `builtin:chart.${preset}`,
    version: 1,
    namespace: '',
    label,
    format: true,
    exportable: true,
    cardDefaults: SERIES_CARD_DEFAULTS,
    formatDefaults: {},
    groups: groupsFor(preset),
    fields: {
      series: seriesField(preset),
      ...since(1, {
        ...presetFields(preset),
        ...axisFields('axis'),
        ...legendFields('legend', 'auto'),
        ...tooltipField('tooltip'),
        ...thresholdsField('thresholds'),
        defaultColor: colorField('Default colour', 'series', undefined, {
          advanced: true, description: 'Used for series without a colour of their own; empty = the theme palette.',
        }),
      }),
    },
    rules: [minBelowMax('yMin', 'yMax')],
    migrations: [],
  };
}

/** The catalog entry for one series preset. */
export function seriesKind(preset: SeriesPreset, template: SettingsTemplate, label: string, description: string, icon: string): BuiltinKindSpec {
  return {
    type: `chart.${preset}`,
    label,
    category: 'Charts',
    description,
    icon,
    defaultW: 6,
    defaultH: 4,
    slots: [SERIES_SLOT],
    template,
  };
}
