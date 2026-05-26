'use client';
import { useEffect } from 'react';
import type * as LeafletLib from 'leaflet';
import type { Map as LeafletMap } from 'leaflet';
import type { MapMarker } from '../types';

/**
 * Auto-fits the Leaflet map to the supplied markers' bounding box on mount and
 * whenever the marker count changes. No-op when `padding` is `undefined`.
 *
 * Rebinding to `markers.length` (rather than the array identity) avoids
 * thrashing the viewport on tooltip re-renders where the array reference
 * changes but the geometry does not.
 */
export function useFitBounds(
  map: LeafletMap | null,
  L: typeof LeafletLib | null,
  markers: MapMarker[],
  padding: number | undefined,
) {
  useEffect(() => {
    if (!map || !L || padding === undefined) return;
    if (!markers.length) return;
    const bounds = L.latLngBounds(markers.map((m) => m.position));
    if (!bounds.isValid()) return;
    map.fitBounds(bounds, { padding: [padding, padding] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, L, padding, markers.length]);
}
