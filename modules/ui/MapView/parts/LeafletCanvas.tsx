'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import type { Map as LeafletMap } from 'leaflet';
import { loadLeaflet, LEAFLET_TILES, type LeafletBundle } from '../providers/leaflet';
import { useDarkMode } from '../hooks/useDarkMode';
import { useFitBounds } from '../hooks/useFitBounds';
import { MarkerPart } from './Marker';
import { ClusteredMarkers } from './Cluster';
import { ZoneShape, RouteShape } from './Shapes';
import { CANVAS_CLASS } from './styles';
import type { MapDisplayOptions, MapMarker, MapZone, MapRoute, MapTilesConfig } from '../types';

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
  tiles?: MapTilesConfig;
  loadingLabel?: string;
} & MapDisplayOptions;

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
        <span className="text-sm text-text-secondary">{props.loadingLabel ?? 'Loading map…'}</span>
      </div>
    );
  }

  return <InnerMap {...props} bundle={bundle} />;
}

// Side-effect components that need a live map instance. react-leaflet's hooks
// come from the lazily-loaded bundle.

function ClickHandler({
  bundle,
  addMode,
  onMapClick,
}: {
  bundle: LeafletBundle;
  addMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
}) {
  const { useMapEvents } = bundle;
  useMapEvents({
    click(e: { latlng: { lat: number; lng: number } }) {
      if (addMode) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FitBounds({
  bundle,
  markers,
  padding,
  maxZoom,
}: {
  bundle: LeafletBundle;
  markers: MapMarker[];
  padding?: number;
  maxZoom?: number;
}) {
  const { useMap, L } = bundle;
  const map = useMap() as LeafletMap;
  useFitBounds(map, L, markers, padding, maxZoom);
  return null;
}

/**
 * Keeps the live map in step with options react-leaflet only reads at mount: the view (when not
 * fitting to markers), the zoom limits and wheel zoom. A settings change therefore shows at once.
 */
function ViewSync({
  bundle, center, zoom, fitting, minZoom, maxZoom, scrollWheelZoom,
}: {
  bundle: LeafletBundle;
  center: [number, number];
  zoom: number;
  fitting: boolean;
  minZoom?: number;
  maxZoom?: number;
  scrollWheelZoom: boolean;
}) {
  const map = bundle.useMap() as LeafletMap;
  const [lat, lng] = center;
  useEffect(() => {
    if (!fitting) map.setView([lat, lng], zoom);
  }, [map, fitting, lat, lng, zoom]);
  useEffect(() => { map.setMinZoom(minZoom ?? 0); }, [map, minZoom]);
  useEffect(() => { map.setMaxZoom(maxZoom ?? 20); }, [map, maxZoom]);
  useEffect(() => {
    if (scrollWheelZoom) map.scrollWheelZoom.enable();
    else map.scrollWheelZoom.disable();
  }, [map, scrollWheelZoom]);
  useEffect(() => {
    // The Leaflet credit without its flag: shorter, and the attribution stays one small line.
    map.attributionControl?.setPrefix('<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">Leaflet</a>');
  }, [map]);
  return null;
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
  tiles: tilesProp,
  minZoom,
  maxZoom,
  cluster = false,
  showLabels = false,
  tooltipTrigger = 'hover',
  renderLink,
  clusterRadius,
  scrollWheelZoom = true,
  zoomControl = true,
  controlsPosition = 'topleft',
  fitMaxZoom,
  bundle,
}: LeafletCanvasProps & { bundle: LeafletBundle }) {
  const { MapContainer, TileLayer, Marker, Tooltip, Popup, Polygon, Polyline, ZoomControl, L } = bundle;
  const isDark = useDarkMode();
  const set = tilesProp ? ('url' in tilesProp ? { light: tilesProp, dark: tilesProp } : tilesProp) : LEAFLET_TILES;
  const tiles = isDark ? set.dark : set.light;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      {...(minZoom !== undefined ? { minZoom } : {})}
      {...(maxZoom !== undefined ? { maxZoom } : {})}
      zoomControl={false}
      scrollWheelZoom={scrollWheelZoom}
      style={{ width: '100%', height: '100%', background: 'var(--surface-sunken)', fontFamily: 'inherit' }}
      className={cn(CANVAS_CLASS, addMode && 'cursor-crosshair')}
    >
      <TileLayer key={`${isDark ? 'dark' : 'light'}-${tiles.url}`} attribution={tiles.attribution} url={tiles.url} maxNativeZoom={16} maxZoom={20} />
      {'labels' in tiles && tiles.labels && (
        <TileLayer key={`labels-${tiles.labels}`} url={tiles.labels} maxNativeZoom={16} maxZoom={20} zIndex={2} />
      )}
      {zoomControl && ZoomControl && <ZoomControl key={controlsPosition} position={controlsPosition} />}

      <ClickHandler bundle={bundle} addMode={addMode} onMapClick={onMapClick} />
      <FitBounds bundle={bundle} markers={markers} padding={fitBoundsPadding} maxZoom={fitMaxZoom} />
      <ViewSync
        bundle={bundle}
        center={center}
        zoom={zoom}
        fitting={fitBoundsPadding !== undefined && markers.length > 0}
        minZoom={minZoom}
        maxZoom={maxZoom}
        scrollWheelZoom={scrollWheelZoom}
      />

      {showZones && zones.map((zone) => (
        <ZoneShape key={zone.id} zone={zone} Polygon={Polygon} Tooltip={Tooltip} />
      ))}

      {showRoutes && routes.map((route) => (
        <RouteShape key={route.id} route={route} Polyline={Polyline} Tooltip={Tooltip} />
      ))}

      {cluster ? (
        <ClusteredMarkers
          bundle={bundle}
          markers={markers}
          onMarkerClick={onMarkerClick}
          showLabels={showLabels}
          tooltipTrigger={tooltipTrigger}
          renderLink={renderLink}
          radius={clusterRadius}
        />
      ) : markers.map((marker) => (
        <MarkerPart
          key={marker.id}
          marker={marker}
          L={L}
          RLMarker={Marker}
          RLTooltip={Tooltip}
          RLPopup={Popup}
          onMarkerClick={onMarkerClick}
          showLabel={showLabels}
          tooltipTrigger={tooltipTrigger}
          renderLink={renderLink}
        />
      ))}
    </MapContainer>
  );
}
