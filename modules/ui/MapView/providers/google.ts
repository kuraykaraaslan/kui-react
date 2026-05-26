// TODO M1+: Google Maps JS adapter.
// Mirrors providers/leaflet.ts API surface so MapView can swap providers
// via the `provider="google"` prop. Requires apiKey.

export function loadGoogle(): never {
  throw new Error('MapView provider "google" is not yet implemented — TODO M1+');
}
