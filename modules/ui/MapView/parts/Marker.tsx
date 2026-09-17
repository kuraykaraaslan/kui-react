'use client';
import type * as LeafletLib from 'leaflet';
import type * as ReactLeaflet from 'react-leaflet';
import { Popup } from './Popup';
import { VARIANT_HEX, markerSvg, type MapMarker } from '../types';

type MarkerProps = {
  marker: MapMarker;
  L: typeof LeafletLib;
  RLMarker: typeof ReactLeaflet.Marker;
  RLTooltip: typeof ReactLeaflet.Tooltip;
  onMarkerClick?: (id: string) => void;
};

/**
 * Renders a single Leaflet marker with the project's pin SVG + optional
 * tooltip. Variant colors come from VARIANT_HEX so design tokens stay the
 * single source of truth.
 */
export function MarkerPart({ marker, L, RLMarker, RLTooltip, onMarkerClick }: MarkerProps) {
  const variant = marker.variant ?? 'primary';
  const color = VARIANT_HEX[variant];
  const icon = L.divIcon({
    html: markerSvg(color),
    className: '',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    tooltipAnchor: [0, -38],
  });

  // TODO M2: hover popup auto-open
  // TODO M2: activeMarkerId visual state (scale + ring)
  // TODO M2: custom marker.icon (ReactNode | FontAwesome)

  // Leaflet's marker element is a keyboard-focusable role="button" div, but
  // has no accessible name unless one is set explicitly (axe:
  // aria-command-name). `alt` is react-leaflet's pass-through for it.
  const accessibleName = marker.tooltip?.title ?? marker.label ?? 'Map marker';

  return (
    <RLMarker
      position={marker.position}
      icon={icon}
      alt={accessibleName}
      eventHandlers={{ click: () => onMarkerClick?.(marker.id) }}
    >
      {marker.tooltip && (
        <RLTooltip>
          <Popup tooltip={marker.tooltip} />
        </RLTooltip>
      )}
      {!marker.tooltip && marker.label && (
        <RLTooltip>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{marker.label}</span>
        </RLTooltip>
      )}
    </RLMarker>
  );
}
