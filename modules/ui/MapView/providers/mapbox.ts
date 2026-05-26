// TODO M1+: Mapbox GL JS adapter.
// Mirrors providers/leaflet.ts API surface so MapView can swap providers
// via the `provider="mapbox"` prop. Requires apiKey.

export function loadMapbox(): never {
  throw new Error('MapView provider "mapbox" is not yet implemented — TODO M1+');
}
