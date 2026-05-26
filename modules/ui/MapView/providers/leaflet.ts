// Leaflet provider — runtime-only. Imports leaflet/react-leaflet lazily so the
// 100 kB+ bundle is never shipped to clients that do not render a map.
//
// This module exports a `loadLeaflet()` function. It is intentionally NOT a
// React component — the parts/LeafletCanvas.tsx component owns rendering and
// calls into here for the bundle.

import type * as ReactLeaflet from 'react-leaflet';
import type * as LeafletLib from 'leaflet';

export type LeafletBundle = {
  MapContainer: typeof ReactLeaflet.MapContainer;
  TileLayer:    typeof ReactLeaflet.TileLayer;
  Marker:       typeof ReactLeaflet.Marker;
  Tooltip:      typeof ReactLeaflet.Tooltip;
  Polygon:      typeof ReactLeaflet.Polygon;
  Polyline:     typeof ReactLeaflet.Polyline;
  useMap:       typeof ReactLeaflet.useMap;
  useMapEvents: typeof ReactLeaflet.useMapEvents;
  L:            typeof LeafletLib;
};

// CartoDB raster tiles — free, no API key, dark+light variants that respect
// the design-token surfaces in app/globals.css.
export const LEAFLET_TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
} as const;

let _cached: Promise<LeafletBundle> | null = null;

export function loadLeaflet(): Promise<LeafletBundle> {
  if (_cached) return _cached;
  _cached = (async () => {
    // Leaflet's stylesheet is already bundled globally via app/globals.css
    // (`@import "leaflet/dist/leaflet.css"`), so we only need the JS here.
    const [rl, leaflet] = await Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ]);
    return {
      MapContainer: rl.MapContainer,
      TileLayer:    rl.TileLayer,
      Marker:       rl.Marker,
      Tooltip:      rl.Tooltip,
      Polygon:      rl.Polygon,
      Polyline:     rl.Polyline,
      useMap:       rl.useMap,
      useMapEvents: rl.useMapEvents,
      L:            leaflet as unknown as typeof LeafletLib,
    };
  })();
  return _cached;
}
