'use client';
import type * as ReactLeaflet from 'react-leaflet';
import { VARIANT_HEX, VARIANT_FILL, type MapZone, type MapRoute } from '../types';

type ZoneProps = {
  zone: MapZone;
  Polygon: typeof ReactLeaflet.Polygon;
  Tooltip: typeof ReactLeaflet.Tooltip;
};

export function ZoneShape({ zone, Polygon, Tooltip }: ZoneProps) {
  const variant = zone.variant ?? 'primary';
  const strokeColor = VARIANT_HEX[variant];
  const fillColor = VARIANT_FILL[variant];
  return (
    <Polygon
      positions={zone.positions}
      pathOptions={{
        color: strokeColor,
        fillColor,
        fillOpacity: zone.fillOpacity ?? 0.25,
        weight: 2,
      }}
    >
      {zone.label && (
        <Tooltip sticky>
          <span style={{ fontWeight: 600, fontSize: 12, color: strokeColor }}>{zone.label}</span>
        </Tooltip>
      )}
    </Polygon>
  );
}

type RouteProps = {
  route: MapRoute;
  Polyline: typeof ReactLeaflet.Polyline;
  Tooltip: typeof ReactLeaflet.Tooltip;
};

export function RouteShape({ route, Polyline, Tooltip }: RouteProps) {
  return (
    <Polyline
      positions={route.positions}
      pathOptions={{
        color: route.color ?? VARIANT_HEX.primary,
        weight: route.weight ?? 3,
        dashArray: route.dashed ? '8 6' : undefined,
      }}
    >
      {route.label && (
        <Tooltip sticky>
          <span style={{ fontWeight: 600, fontSize: 12 }}>{route.label}</span>
        </Tooltip>
      )}
    </Polyline>
  );
}
