'use client';
import { cn } from '@/libs/utils/cn';
import { LeafletCanvas } from './parts/LeafletCanvas';
import type { MapMarker, MapRoute, MapTilesConfig, MapZone } from './types';

export type MapCanvasProps = {
  markers?: MapMarker[];
  zones?: MapZone[];
  routes?: MapRoute[];
  center?: [number, number];
  zoom?: number;
  /** One tile layer for both themes, or a light/dark pair. Default: CARTO Voyager / Dark Matter. */
  tiles?: MapTilesConfig;
  /** Fit the view to the markers with this padding (px). Default = 32. */
  fitBoundsPadding?: number;
  onMarkerClick?: (id: string) => void;
  /** Text shown until the map chunk resolves. Default = "Loading map…". */
  loadingLabel?: string;
  /** Accessible name of the map region. Default = "Map". */
  ariaLabel?: string;
  className?: string;
};

const noop = () => {};

/**
 * MapCanvas — a bare, card-less Leaflet map that fills its parent (`h-full w-full`).
 *
 * Use it inside something that already owns the frame (a dashboard cell, a
 * panel). `MapView` is the framed variant with a toolbar. The parent must have
 * a height. Leaflet loads lazily; the stylesheet comes from `app/globals.css`.
 */
export function MapCanvas({
  markers = [],
  zones = [],
  routes = [],
  center = [39.9334, 32.8597],
  zoom = 6,
  tiles,
  fitBoundsPadding = 32,
  onMarkerClick,
  loadingLabel = 'Loading map…',
  ariaLabel = 'Map',
  className,
}: MapCanvasProps) {
  return (
    <div role="region" aria-label={ariaLabel} className={cn('h-full w-full', className)} style={{ isolation: 'isolate' }}>
      <LeafletCanvas
        center={center}
        zoom={zoom}
        markers={markers}
        zones={zones}
        routes={routes}
        showZones
        showRoutes
        addMode={false}
        fitBoundsPadding={fitBoundsPadding}
        onMapClick={noop}
        onMarkerClick={onMarkerClick}
        tiles={tiles}
        loadingLabel={loadingLabel}
      />
    </div>
  );
}
