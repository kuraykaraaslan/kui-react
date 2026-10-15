import { colorField, minBelowMax, opt, rangesFields, since } from '../settings/packs';
import type { SettingsTemplate, Sparse } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** Only a path-absolute internal target: `/x`, never `//host`, `/\host`, a scheme or a control character. */
export function isInternalPath(to: unknown): to is string {
  if (typeof to !== 'string') return false;
  if (!/^\/(?![\/\\])/.test(to)) return false;
   
  if (/[\u0000-\u001f\u007f]/.test(to)) return false;
  return !/^\/\s*[a-z][a-z0-9+.-]*:/i.test(to);
}

/** A link template must be an internal path before any `{column}` is expanded. */
export const internalLinkRule = (key: string) => (v: Sparse) =>
  typeof v[key] === 'string' && v[key] !== '' && !isInternalPath(v[key])
    ? [{ path: key, message: 'The link must be an internal path that starts with a single /' }]
    : [];

/** `map`: bound rows with coordinates as markers. */
export const MAP: SettingsTemplate = {
  id: 'builtin:map',
  version: 1,
  namespace: '',
  label: 'Map',
  format: false,
  exportable: true,
  cardDefaults: { padding: 0 },
  groups: [
    { id: 'columns', label: 'Columns', tab: 'Data', since: 1 },
    { id: 'markers', label: 'Markers', tab: 'Display', since: 1 },
    { id: 'colour', label: 'Marker colour', tab: 'Display', since: 1 },
    { id: 'tooltip', label: 'Labels and tooltips', tab: 'Display', since: 1 },
    { id: 'view', label: 'View', tab: 'Display', since: 1 },
    { id: 'click', label: 'Click', tab: 'Behaviour', since: 1 },
  ],
  fields: since(1, {
    latColumn: { label: 'Latitude column', type: 'data-key', slot: 'points', value: 'lat', required: true, group: 'columns' },
    lngColumn: { label: 'Longitude column', type: 'data-key', slot: 'points', value: 'lng', required: true, group: 'columns' },
    labelColumn: { label: 'Label column', type: 'data-key', slot: 'points', group: 'columns' },
    idColumn: {
      label: 'Row id column', type: 'data-key', slot: 'points', group: 'columns', advanced: true,
      description: 'Identifies the marker in click actions. Empty = the row number.',
    },
    tooltipColumns: {
      label: 'Tooltip columns', type: 'data-key', slot: 'points', multiple: true, max: 6, value: [], group: 'tooltip',
      description: 'Shown as fields in the marker tooltip, titled and formatted as the query declares them.',
    },
    markerStyle: {
      label: 'Marker', type: 'select', display: 'segmented', value: 'pin', group: 'markers', required: true,
      options: [opt('pin', 'Pin'), opt('dot', 'Dot'), opt('icon', 'Icon')],
    },
    markerIcon: { label: 'Marker icon', type: 'icon', group: 'markers', placeholder: 'fas fa-location-dot', showIf: { markerStyle: 'icon' } },
    markerSize: { label: 'Marker size (px)', type: 'number', min: 8, max: 64, value: 24, group: 'markers' },
    cluster: {
      label: 'Group nearby markers', type: 'boolean', value: false, group: 'markers', advanced: true,
      description: 'Markers that overlap become one bubble with a count; clicking it zooms in.',
    },
    colorBy: {
      label: 'Colour from', type: 'select', display: 'segmented', value: 'fixed', group: 'colour', required: true,
      options: [opt('fixed', 'One colour'), opt('column', 'A colour column'), opt('ranges', 'Ranges on a value')],
    },
    markerColor: colorField('Marker colour', 'colour', 'var(--primary)', {
      description: 'Also used when a row has no colour of its own.',
    }),
    colorColumn: {
      label: 'Colour column', type: 'data-key', slot: 'points', group: 'colour', showIf: { colorBy: 'column' },
      description: 'A column holding a colour name (success, warning, error, info, neutral, primary) or a CSS colour.',
    },
    valueColumn: { label: 'Value column', type: 'data-key', slot: 'points', group: 'colour', showIf: { colorBy: 'ranges' } },
    ...rangesFields('The first range the value falls in colours the marker.', 'colour'),
    showLabels: { label: 'Show labels on the map', type: 'boolean', value: false, group: 'tooltip' },
    tooltipTrigger: {
      label: 'Open tooltips on', type: 'select', display: 'segmented', value: 'hover', group: 'tooltip', required: true,
      options: [opt('hover', 'Hover'), opt('click', 'Click')],
      description: 'A click-opened tooltip stays open, so its link can be used.',
    },
    fitBounds: { label: 'Fit the view to the markers', type: 'boolean', value: true, group: 'view' },
    centerLat: { label: 'Centre latitude', type: 'number', nullable: true, display: 'input', min: -90, max: 90, group: 'view', showIf: { fitBounds: false } },
    centerLng: { label: 'Centre longitude', type: 'number', nullable: true, display: 'input', min: -180, max: 180, group: 'view', showIf: { fitBounds: false } },
    zoom: { label: 'Zoom', type: 'number', min: 1, max: 18, value: 4, group: 'view', showIf: { fitBounds: false } },
    minZoom: { label: 'Minimum zoom', type: 'number', nullable: true, display: 'input', min: 0, max: 20, group: 'view', advanced: true },
    maxZoom: { label: 'Maximum zoom', type: 'number', nullable: true, display: 'input', min: 0, max: 20, group: 'view', advanced: true },
    tileStyle: {
      label: 'Map style', type: 'select', value: 'auto', group: 'view', advanced: true, required: true,
      options: [opt('auto', 'Follow the theme'), opt('light', 'Light'), opt('grey', 'Light grey'), opt('dark', 'Dark')],
      description: 'Follow the theme uses the platform\'s tile server when one is configured.',
    },
    linkTemplate: {
      label: 'Marker link', type: 'text', maxLength: 300, placeholder: '/admin/devices/{id}', group: 'click', advanced: true,
      description: 'Internal path only; {column} is replaced by the clicked row\'s value. Empty = markers are not links. Click actions run either way.',
    },
    linkLabel: { label: 'Link text', type: 'text', maxLength: 40, placeholder: 'Open', group: 'click', advanced: true },
  }),
  rules: [minBelowMax('minZoom', 'maxZoom'), internalLinkRule('linkTemplate')],
  migrations: [],
};

export const MAP_KIND: BuiltinKindSpec = {
  type: 'map',
  label: 'Map',
  category: 'Maps & Location',
  description: 'Bound table rows with coordinates, plotted as markers on a map.',
  icon: 'fas fa-map-location-dot',
  defaultW: 6,
  defaultH: 5,
  slots: [{ key: 'points', label: 'Points', shape: 'table', required: true }],
  template: MAP,
};
