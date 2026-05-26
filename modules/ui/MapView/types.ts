// Public types for MapView. Kept framework-agnostic so providers
// (leaflet / mapbox / google) can share a single contract.

export type MapVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type MapTooltipField = { label: string; value: string };

export type MapTooltipData = {
  title: string;
  description?: string;
  fields?: MapTooltipField[];
};

export type MapMarker = {
  id: string;
  position: [number, number];
  variant?: MapVariant;
  tooltip?: MapTooltipData;
  label?: string;
};

export type MapZone = {
  id: string;
  positions: [number, number][];
  label?: string;
  variant?: MapVariant;
  fillOpacity?: number;
};

export type MapRoute = {
  id: string;
  positions: [number, number][];
  label?: string;
  color?: string;
  weight?: number;
  dashed?: boolean;
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type MapProviderId = 'leaflet' | 'mapbox' | 'google';

export type MapViewProps = {
  /** Map provider implementation. Default: 'leaflet'. */
  provider?: MapProviderId;
  /** Provider API key (mapbox/google). Ignored by leaflet. */
  apiKey?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  zones?: MapZone[];
  routes?: MapRoute[];
  /** When set, the map auto-fits to marker bounds with this padding (px). */
  fitBoundsPadding?: number;
  onMarkerAdd?: (position: [number, number]) => void;
  onMarkerClick?: (id: string) => void;
  height?: string | number;
  className?: string;
  // TODO M2: activeMarkerId, cluster, mode (markers|cluster|heatmap)
  // TODO M3: search, route, reverse geocode
  // TODO M4: drawTools, locate, layerToggle
  // TODO M5: reducedMotion, messages (i18n), onTelemetry
};

// ─── color tables shared across providers ────────────────────────────────────

export const VARIANT_HEX: Record<MapVariant, string> = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  error:   '#ef4444',
  info:    '#06b6d4',
  neutral: '#6b7280',
};

export const VARIANT_FILL: Record<MapVariant, string> = {
  primary: '#3b82f620',
  success: '#22c55e20',
  warning: '#f59e0b20',
  error:   '#ef444420',
  info:    '#06b6d420',
  neutral: '#6b728020',
};

export function markerSvg(color: string): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.143 1.204 5.997 3.17 8.126L12 36l8.83-15.874A11.945 11.945 0 0 0 24 12C24 5.373 18.627 0 12 0z" fill="${color}"/>
      <circle cx="12" cy="12" r="4.5" fill="white" opacity="0.9"/>
    </svg>`;
}
