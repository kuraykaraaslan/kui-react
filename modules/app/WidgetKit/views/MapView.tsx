'use client';
import { useMemo } from 'react';
import { MapCanvas, type MapMarker, type MapTilesConfig } from '@/modules/ui/MapView';
import { cssColor, rangeColor, type RangeEdges } from '../settings/style';
import type { Sparse } from '../settings/types';
import type { SlotData, WidgetKindView, WidgetViewProps } from '../kind';
import { cellText, dataColor, declaredColumns, expandLinkTemplate, num, rawText } from './DataTableView';

type S = {
  latColumn?: string;
  lngColumn?: string;
  labelColumn?: string;
  idColumn?: string;
  tooltipColumns?: string[];
  markerStyle?: 'pin' | 'dot' | 'icon';
  markerIcon?: string;
  markerSize?: number;
  cluster?: boolean;
  colorBy?: 'fixed' | 'column' | 'ranges';
  markerColor?: string;
  colorColumn?: string;
  valueColumn?: string;
  ranges?: unknown;
  rangeEdges?: RangeEdges;
  showLabels?: boolean;
  tooltipTrigger?: 'hover' | 'click';
  fitBounds?: boolean;
  centerLat?: number | null;
  centerLng?: number | null;
  zoom?: number;
  minZoom?: number | null;
  maxZoom?: number | null;
  tileStyle?: 'auto' | 'light' | 'grey' | 'dark';
  linkTemplate?: string;
  linkLabel?: string;
};

type Row = Record<string, unknown>;

/** At most this many markers: a runaway table must not create thousands of DOM markers. */
export const MAX_MARKERS = 500;
/** At most this many fields in a tooltip: a hover card is a glance, not a table. */
export const MAX_TOOLTIP_FIELDS = 6;

const CARTO_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const carto = (style: string) => ({ url: `https://{s}.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}{r}.png`, attribution: CARTO_ATTRIBUTION });
const TILE_PRESETS: Record<'light' | 'grey' | 'dark', MapTilesConfig> = {
  light: carto('voyager'),
  grey: carto('light_all'),
  dark: carto('dark_all'),
};

const tooltipKeys = (s: S): string[] =>
  [...new Set((Array.isArray(s.tooltipColumns) ? s.tooltipColumns : []).filter((k) => typeof k === 'string' && k))].slice(0, MAX_TOOLTIP_FIELDS);

export interface BuiltMarkers {
  markers: MapMarker[];
  /** The row behind each marker id. */
  rows: Map<string, Row>;
}

/**
 * Table rows → markers. Rows without finite, in-range coordinates are skipped, never plotted at
 * 0,0. A link is attached only when the template is an internal path (checked before expansion,
 * values URL-encoded). Capped at `MAX_MARKERS`.
 */
export function buildMarkers(slot: SlotData | undefined, settings: Sparse, locale?: string): BuiltMarkers {
  const s = settings as S;
  const declared = declaredColumns(slot);
  const lat = s.latColumn || 'lat';
  const lng = s.lngColumn || 'lng';
  const fieldsOf = tooltipKeys(s);
  const fixed = cssColor(s.markerColor) ?? 'var(--primary)';
  const markers: MapMarker[] = [];
  const rows = new Map<string, Row>();
  (slot?.rows ?? []).forEach((row, i) => {
    if (markers.length >= MAX_MARKERS) return;
    const la = num(row[lat]);
    const ln = num(row[lng]);
    if (la === null || ln === null || Math.abs(la) > 90 || Math.abs(ln) > 180) return;
    const rawId = s.idColumn && row[s.idColumn] != null && row[s.idColumn] !== '' ? String(row[s.idColumn]) : String(i);
    const id = rows.has(rawId) ? `${rawId}#${i}` : rawId;
    rows.set(id, row);
    const label = s.labelColumn && row[s.labelColumn] != null && row[s.labelColumn] !== '' ? String(row[s.labelColumn]) : undefined;
    const color = s.colorBy === 'column' && s.colorColumn
      ? dataColor(row[s.colorColumn]) ?? fixed
      : s.colorBy === 'ranges' && s.valueColumn
        ? rangeColor(row[s.valueColumn], s.ranges, s.rangeEdges ?? 'from') ?? fixed
        : fixed;
    // An empty value is left out of the tooltip, never shown as a dash row.
    const fields = fieldsOf.flatMap((key) => {
      const v = row[key];
      if (v === null || v === undefined || v === '') return [];
      const def = declared.find((c) => c.key === key);
      return [{ label: def?.label || key, value: cellText(v, def?.type, {}, {}, locale) }];
    });
    const href = expandLinkTemplate(s.linkTemplate, row) ?? undefined;
    markers.push({
      id,
      position: [la, ln],
      label,
      color,
      shape: s.markerStyle ?? 'pin',
      ...(s.markerStyle === 'icon' && s.markerIcon ? { icon: s.markerIcon } : {}),
      size: s.markerSize ?? 24,
      ...(fields.length > 0 || href
        ? { tooltip: { title: label ?? (s.idColumn ? rawId : `#${i + 1}`), fields, ...(href ? { href, linkLabel: s.linkLabel || 'Open' } : {}) } }
        : {}),
    });
  });
  return { markers, rows };
}

export type MapWidgetViewProps = WidgetViewProps & {
  /** Run the placement's marker-click actions with the marker's row. */
  onMarkerClick?: (row: Row) => void;
  /** Navigate to a marker's (validated, internal) link on click; without it, the link is offered in the tooltip only. */
  onNavigate?: (href: string) => void;
  /** The platform's tile server, used by the "Follow the theme" style. */
  tiles?: MapTilesConfig;
  loadingLabel?: string;
  ariaLabel?: string;
};

/** `map`: bound rows as markers on a card-less map that fills the card. */
export function MapWidgetView({
  settings, data, locale, renderLink, onMarkerClick, onNavigate, tiles, loadingLabel, ariaLabel,
}: MapWidgetViewProps) {
  const s = settings as S;
  const { markers, rows } = useMemo(() => buildMarkers(data.points, settings, locale), [data.points, settings, locale]);
  const fit = s.fitBounds !== false;
  const center: [number, number] | undefined = !fit && typeof s.centerLat === 'number' && typeof s.centerLng === 'number'
    ? [s.centerLat, s.centerLng] : undefined;
  const tileSet = s.tileStyle && s.tileStyle !== 'auto' ? TILE_PRESETS[s.tileStyle] : tiles;
  const clickable = !!onMarkerClick || (!!onNavigate && !!s.linkTemplate);

  const handleClick = (id: string) => {
    const row = rows.get(id);
    if (!row) return;
    onMarkerClick?.(row);
    const href = expandLinkTemplate(s.linkTemplate, row);
    if (href && onNavigate) onNavigate(href);
  };

  return (
    <div className="h-full min-h-40 w-full">
      <MapCanvas
        markers={markers}
        tiles={tileSet}
        fitBounds={fit}
        {...(center ? { center } : {})}
        {...(!fit && typeof s.zoom === 'number' ? { zoom: s.zoom } : {})}
        {...(typeof s.minZoom === 'number' ? { minZoom: s.minZoom } : {})}
        {...(typeof s.maxZoom === 'number' ? { maxZoom: s.maxZoom } : {})}
        cluster={!!s.cluster}
        showLabels={!!s.showLabels}
        tooltipTrigger={s.tooltipTrigger ?? 'hover'}
        renderLink={renderLink}
        onMarkerClick={clickable ? handleClick : undefined}
        loadingLabel={loadingLabel}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}

export const MAP_VIEW: WidgetKindView = {
  View: MapWidgetView,
  isEmpty: (data, settings) => buildMarkers(data.points, settings).markers.length === 0,
  toCsv: (data, settings) => {
    const s = settings as S;
    const keys = [
      s.latColumn || 'lat', s.lngColumn || 'lng', s.labelColumn, s.idColumn,
      s.colorBy === 'column' ? s.colorColumn : s.colorBy === 'ranges' ? s.valueColumn : undefined,
      ...tooltipKeys(s),
    ].filter((k, i, a): k is string => !!k && a.indexOf(k) === i);
    const label = (k: string) => declaredColumns(data.points).find((c) => c.key === k)?.label || k;
    const { rows } = buildMarkers(data.points, settings);
    return [keys.map(label), ...[...rows.values()].map((row) => keys.map((k) => rawText(row[k])))];
  },
};
