'use client';
import { useCallback, useRef, useState } from 'react';
import type { MapMarker } from '../types';

/**
 * Manages "click-to-add" markers when the consumer does not provide an
 * `onMarkerAdd` callback. Returns the auto-generated marker list, an
 * onMapClick handler, and a setter for external consumers.
 */
export function useAutoMarkers(onMarkerAdd: ((position: [number, number]) => void) | undefined) {
  const [extras, setExtras] = useState<MapMarker[]>([]);
  const counter = useRef(0);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    const pos: [number, number] = [lat, lng];
    if (onMarkerAdd) {
      onMarkerAdd(pos);
      return;
    }
    counter.current += 1;
    setExtras((prev) => [
      ...prev,
      {
        id: `auto-${counter.current}`,
        position: pos,
        variant: 'primary',
        tooltip: {
          title: `İşaretçi ${counter.current}`,
          fields: [
            { label: 'Enlem', value: lat.toFixed(5) },
            { label: 'Boylam', value: lng.toFixed(5) },
          ],
        },
      },
    ]);
  }, [onMarkerAdd]);

  return { extras, handleMapClick } as const;
}
