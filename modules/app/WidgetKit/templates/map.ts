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
    { id: 'legend', label: 'Legend', tab: 'Display', since: 1 },
    { id: 'tooltip', label: 'Labels and tooltips', tab: 'Display', since: 1 },
    { id: 'view', label: 'View', tab: 'Display', since: 1 },
    { id: 'controls', label: 'Map controls', tab: 'Behaviour', since: 1 },
    { id: 'click', label: 'Click', tab: 'Behaviour', since: 1 },
  ],
  fields: since(1, {
    latColumn: { label: 'Latitude column', type: 'data-key', slot: 'points', value: 'lat', required: true, group: 'columns' },
    lngColumn: { label: 'Longitude column', type: 'data-key', slot: 'points', value: 'lng', required: true, group: 'columns' },
    labelColumn: { label: 'Label column', type: 'data-key', slot: 'points', value: 'label', group: 'columns', description: 'The marker\'s name: its tooltip title and its label on the map.' },
    idColumn: {
      label: 'Row id column', type: 'data-key', slot: 'points', group: 'columns', advanced: true,
      description: 'Identifies the marker in click actions. Empty = the row number.',
    },
    markerStyle: {
      label: 'Marker', type: 'select', display: 'segmented', value: 'pin', group: 'markers', required: true,
      options: [opt('pin', 'Pin'), opt('dot', 'Dot'), opt('circle', 'Circle'), opt('icon', 'Icon')],
    },
    markerIcon: { label: 'Marker icon', type: 'icon', group: 'markers', placeholder: 'fas fa-location-dot', showIf: { markerStyle: 'icon' } },
    markerSize: { label: 'Marker size (px)', type: 'number', min: 8, max: 64, value: 24, group: 'markers' },
    cluster: {
      label: 'Group nearby markers', type: 'boolean', value: false, group: 'markers',
      description: 'Markers that overlap become one bubble with a count (in their shared colour); clicking it zooms in.',
    },
    clusterRadius: { label: 'Grouping distance (px)', type: 'number', min: 10, max: 200, value: 40, group: 'markers', advanced: true, showIf: { cluster: true } },
    colorBy: {
      label: 'Colour from', type: 'select', display: 'segmented', value: 'column', group: 'colour', required: true,
      options: [opt('fixed', 'One colour'), opt('column', 'A status column'), opt('ranges', 'Ranges on a value')],
    },
    markerColor: colorField('Marker colour', 'colour', 'var(--primary)', {
      description: 'Also used when a row has no colour of its own.',
    }),
    colorColumn: {
      label: 'Status column', type: 'data-key', slot: 'points', value: 'status', group: 'colour', showIf: { colorBy: 'column' },
      description: 'Its value picks the colour: a value named below, a status word (Online, Warning, Offline…), a colour name (success, warning, error, info, neutral, primary) or a CSS colour.',
    },
    valueColors: {
      label: 'Status colours', type: 'repeater', group: 'colour', max: 20, value: [], showIf: { colorBy: 'column' },
      description: 'Maps a value of the status column (case does not matter) to a colour and a legend label.',
      fields: {
        value: { label: 'Value', type: 'text', maxLength: 80, required: true, placeholder: 'Online' },
        color: { label: 'Colour', type: 'color', value: 'var(--success)' },
        label: { label: 'Shown as', type: 'text', maxLength: 40, placeholder: 'The value' },
      },
    },
    valueColumn: { label: 'Value column', type: 'data-key', slot: 'points', group: 'colour', showIf: { colorBy: 'ranges' } },
    ...rangesFields('The first range the value falls in colours the marker.', 'colour'),
    legend: {
      label: 'Show a legend', type: 'boolean', value: true, group: 'legend',
      description: 'What each colour means, with a count per status. Hidden with one colour.',
    },
    legendPosition: {
      label: 'Legend corner', type: 'select', value: 'bottomleft', group: 'legend', required: true, showIf: { legend: true },
      options: [opt('bottomleft', 'Bottom left'), opt('bottomright', 'Bottom right'), opt('topleft', 'Top left'), opt('topright', 'Top right')],
    },
    showLabels: { label: 'Show labels on the map', type: 'boolean', value: false, group: 'tooltip' },
    tooltipTrigger: {
      label: 'Open tooltips on', type: 'select', display: 'segmented', value: 'hover', group: 'tooltip', required: true,
      options: [opt('hover', 'Hover'), opt('click', 'Click'), opt('none', 'Never')],
      description: 'A click-opened tooltip stays open, so its link can be used.',
    },
    tooltipColumns: {
      label: 'Tooltip fields', type: 'data-key', slot: 'points', multiple: true, max: 6, value: [], group: 'tooltip',
      description: 'Shown as label / value rows under the title, titled and formatted as the query declares them.',
    },
    tileStyle: {
      label: 'Map style', type: 'select', value: 'auto', group: 'view', required: true,
      options: [
        opt('auto', 'Follow the theme'), opt('light', 'Light'), opt('grey', 'Light, no labels'),
        opt('dark', 'Dark'), opt('streets', 'Streets (colour)'),
      ],
      description: 'Follow the theme: light or dark with the app, or the platform\'s tile server when one is configured.',
    },
    fitBounds: { label: 'Fit the view to the markers', type: 'boolean', value: true, group: 'view' },
    fitPadding: { label: 'Space around the markers (px)', type: 'number', min: 0, max: 200, value: 32, group: 'view', advanced: true, showIf: { fitBounds: true } },
    centerLat: {
      label: 'Centre latitude', type: 'number', nullable: true, display: 'input', min: -90, max: 90, group: 'view',
      description: 'Where the map looks when it does not fit to the markers (or there are none).',
    },
    centerLng: { label: 'Centre longitude', type: 'number', nullable: true, display: 'input', min: -180, max: 180, group: 'view' },
    zoom: { label: 'Zoom', type: 'number', min: 1, max: 18, value: 4, group: 'view', showIf: { fitBounds: false } },
    minZoom: { label: 'Minimum zoom', type: 'number', nullable: true, display: 'input', min: 0, max: 20, group: 'view', advanced: true },
    maxZoom: { label: 'Maximum zoom', type: 'number', nullable: true, display: 'input', min: 0, max: 20, group: 'view', advanced: true },
    zoomButtons: { label: 'Zoom buttons', type: 'boolean', value: true, group: 'controls' },
    controlsPosition: {
      label: 'Zoom buttons corner', type: 'select', value: 'topleft', group: 'controls', required: true, showIf: { zoomButtons: true },
      options: [opt('topleft', 'Top left'), opt('topright', 'Top right'), opt('bottomleft', 'Bottom left'), opt('bottomright', 'Bottom right')],
    },
    scrollZoom: {
      label: 'Zoom with the mouse wheel', type: 'boolean', value: false, group: 'controls',
      description: 'Off: the wheel scrolls the board past the map; use the buttons or a pinch to zoom.',
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
