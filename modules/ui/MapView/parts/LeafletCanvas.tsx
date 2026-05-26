'use client';
import { useEffect, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { loadLeaflet, LEAFLET_TILES, type LeafletBundle } from '../providers/leaflet';
import { useDarkMode } from '../hooks/useDarkMode';
import { useFitBounds } from '../hooks/useFitBounds';
import { MarkerPart } from './Marker';
import { ZoneShape, RouteShape } from './Shapes';
import type { MapMarker, MapZone, MapRoute } from '../types';

type LeafletCanvasProps = {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  zones: MapZone[];
  routes: MapRoute[];
  showZones: boolean;
  showRoutes: boolean;
  addMode: boolean;
  fitBoundsPadding?: number;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick?: (id: string) => void;
};

/**
 * The actual Leaflet renderer. Owns the leaflet bundle lifecycle: imports the
 * package once (cached at module scope by providers/leaflet.ts) and re-mounts
 * the inner `<MapContainer>` only when the bundle resolves.
 *
 * Dark mode is reflected by swapping the tile layer URL — Leaflet recomputes
 * tiles in place, no remount needed.
 */
export function LeafletCanvas(props: LeafletCanvasProps) {
  const [bundle, setBundle] = useState<LeafletBundle | null>(null);

  useEffect(() => {
    let alive = true;
    loadLeaflet().then((b) => { if (alive) setBundle(b); });
    return () => { alive = false; };
  }, []);

  if (!bundle) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-raised">
        <span className="text-sm text-text-secondary">Harita yükleniyor…</span>
      </div>
    );
  }

  return <InnerMap {...props} bundle={bundle} />;
}

function InnerMap({
  center,
  zoom,
  markers,
  zones,
  routes,
  showZones,
  showRoutes,
  addMode,
  fitBoundsPadding,
  onMapClick,
  onMarkerClick,
  bundle,
}: LeafletCanvasProps & { bundle: LeafletBundle }) {
  const { MapContainer, TileLayer, Marker, Tooltip, Polygon, Polyline, useMap, useMapEvents, L } = bundle;
  const isDark = useDarkMode();
  const tiles = isDark ? LEAFLET_TILES.dark : LEAFLET_TILES.light;

  function ClickHandler() {
    useMapEvents({
      click(e: { latlng: { lat: number; lng: number } }) {
        if (addMode) onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  // Side-effect components that need a live map instance.
  function FitBounds() {
    const map = useMap() as LeafletMap;
    useFitBounds(map, L, markers, fitBoundsPadding);
    return null;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      className={addMode ? 'cursor-crosshair' : ''}
    >
      <TileLayer key={isDark ? 'dark' : 'light'} attribution={tiles.attribution} url={tiles.url} />

      <ClickHandler />
      <FitBounds />

      {showZones && zones.map((zone) => (
        <ZoneShape key={zone.id} zone={zone} Polygon={Polygon} Tooltip={Tooltip} />
      ))}

      {showRoutes && routes.map((route) => (
        <RouteShape key={route.id} route={route} Polyline={Polyline} Tooltip={Tooltip} />
      ))}

      {markers.map((marker) => (
        <MarkerPart
          key={marker.id}
          marker={marker}
          L={L}
          RLMarker={Marker}
          RLTooltip={Tooltip}
          onMarkerClick={onMarkerClick}
        />
      ))}
    </MapContainer>
  );
}
