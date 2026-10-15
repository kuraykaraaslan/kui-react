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
  Popup:        typeof ReactLeaflet.Popup;
  Polygon:      typeof ReactLeaflet.Polygon;
  Polyline:     typeof ReactLeaflet.Polyline;
  ZoomControl:  typeof ReactLeaflet.ZoomControl;
  useMap:       typeof ReactLeaflet.useMap;
  useMapEvents: typeof ReactLeaflet.useMapEvents;
  L:            typeof LeafletLib;
};

// Keyless raster basemaps that follow the theme: Esri's Light Gray and Dark Gray Canvas, with their
// place-name layers on top. (CARTO's basemaps, the previous default, now answer every keyless
// request with an "API key required" tile.) A host with its own tile server passes `tiles`.
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services';
export const ESRI_ATTRIBUTION = 'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const esriTiles = (service: string) => `${ESRI}/${service}/MapServer/tile/{z}/{y}/{x}`;

export const LEAFLET_TILES = {
  light: {
    url: esriTiles('Canvas/World_Light_Gray_Base'),
    labels: esriTiles('Canvas/World_Light_Gray_Reference'),
    attribution: ESRI_ATTRIBUTION,
  },
  dark: {
    url: esriTiles('Canvas/World_Dark_Gray_Base'),
    labels: esriTiles('Canvas/World_Dark_Gray_Reference'),
    attribution: ESRI_ATTRIBUTION,
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
      Popup:        rl.Popup,
      Polygon:      rl.Polygon,
      Polyline:     rl.Polyline,
      ZoomControl:  rl.ZoomControl,
      useMap:       rl.useMap,
      useMapEvents: rl.useMapEvents,
      L:            leaflet as unknown as typeof LeafletLib,
    };
  })();
  return _cached;
}
