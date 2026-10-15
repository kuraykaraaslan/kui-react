'use client';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { Pagination } from '@/modules/ui/Pagination';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, rangeFor, type RangeEdges, type ValueFormat } from '../settings/style';
import type { Sparse } from '../settings/types';
import type { SlotData, WidgetKindView, WidgetViewProps } from '../kind';
import { isInternalPath } from '../templates/map';

// ── Shared data helpers (also used by the feed and map views) ───────────────────

type Row = Record<string, unknown>;
type DeclaredColumn = NonNullable<SlotData['columns']>[number];

export const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '' || typeof v === 'boolean') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

export const TONE_NAMES = ['success', 'warning', 'error', 'info', 'neutral', 'primary'] as const;
export type ToneName = (typeof TONE_NAMES)[number];
const TONE_VAR: Record<ToneName, string> = {
  success: 'var(--success)', warning: 'var(--warning)', error: 'var(--error)',
  info: 'var(--info)', neutral: 'var(--text-secondary)', primary: 'var(--primary)',
};
export const toneOf = (v: unknown): ToneName | undefined => {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  return (TONE_NAMES as readonly string[]).includes(s) ? (s as ToneName) : undefined;
};

/** A colour from DATA: a tone name (`success`) or any CSS colour that `cssColor` accepts; else undefined. */
export function dataColor(v: unknown): string | undefined {
  const tone = toneOf(v);
  return tone ? TONE_VAR[tone] : cssColor(v);
}

/** The declared columns of a table slot; without a declaration, the first row's keys as text. */
export function declaredColumns(slot: SlotData | undefined): DeclaredColumn[] {
  if (slot?.columns?.length) return slot.columns;
  const first = slot?.rows?.[0];
  return first ? Object.keys(first).map((key) => ({ key, label: key, type: typeof first[key] === 'number' ? 'number' : 'text' })) : [];
}

const hasTimeOfDay = (raw: string) => /[T\s]\d{1,2}:\d{2}/.test(raw);

/** One cell as display text, by its declared type and the value format. */
export function cellText(
  value: unknown, type: DeclaredColumn['type'] | undefined, format: ValueFormat, override: { unit?: string; decimals?: number }, locale?: string,
): string {
  if (value === null || value === undefined || value === '') return '—';
  if (type === 'number' || override.unit !== undefined || override.decimals !== undefined) {
    if (num(value) !== null) return formatValue(value, type === 'number' ? format : {}, override, locale);
    if (type === 'number') return String(value);
  }
  if (type === 'date') {
    const d = new Date(typeof value === 'number' ? value : String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    return typeof value === 'string' && !hasTimeOfDay(value) ? d.toLocaleDateString(locale) : d.toLocaleString(locale);
  }
  if (typeof value === 'object') {
    const json = JSON.stringify(value);
    return json.length > 200 ? `${json.slice(0, 197)}…` : json;
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

/**
 * Expand `/admin/devices/{id}` with a row's values. Only an INTERNAL path may come out: the
 * template is checked BEFORE expansion, and each value is URL-encoded, so a row value cannot add
 * a scheme, a host or a path escape. Null when the template is unsafe or a token has no value.
 */
export function expandLinkTemplate(template: unknown, row: Row | undefined): string | null {
  if (typeof template !== 'string' || !template || !row || !isInternalPath(template)) return null;
  let missing = false;
  const out = template.replace(/\{([A-Za-z0-9_.-]+)\}/g, (_, key: string) => {
    const v = row[key];
    if (v === null || v === undefined || v === '') { missing = true; return ''; }
    return encodeURIComponent(String(v));
  });
  return missing || !isInternalPath(out) ? null : out;
}

/** A CSV cell's raw text. */
export const rawText = (v: unknown): string =>
  v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);

/** Plain anchor or the host's router link. */
export function linkTo(
  href: string, children: ReactNode, className: string, renderLink?: WidgetViewProps['renderLink'],
): ReactNode {
  return renderLink ? renderLink(href, children, className) : <a href={href} className={className}>{children}</a>;
}

const LINK_CLASS = 'text-primary underline-offset-2 hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

// ── Table settings and columns ────────────────────────────────────────────────

type Visible = 'always' | 'desktop' | 'hidden';
type Cell = 'auto' | 'text' | 'badge' | 'bar' | 'link';

interface ColumnSetting {
  key?: string; label?: string; visible?: Visible; cell?: Cell; linkTemplate?: string; sortable?: boolean;
  align?: 'auto' | 'start' | 'center' | 'end'; width?: 'auto' | 'narrow' | 'wide' | 'px'; widthPx?: number;
  unit?: string; decimals?: number; color?: string; headerColor?: string; barMax?: number; ranges?: unknown[];
}

type S = {
  columns?: ColumnSetting[];
  maxRows?: number;
  paging?: 'none' | 'pages';
  sortable?: boolean;
  defaultSort?: string;
  defaultSortDir?: 'asc' | 'desc';
  search?: boolean;
  columnPicker?: boolean;
  density?: 'compact' | 'normal' | 'comfortable';
  stickyHeader?: boolean;
  striped?: boolean;
  stripeColor?: string;
  borderColor?: string;
  rowColorColumn?: string;
  headerFont?: FontValue;
  headerColor?: string;
  headerBackground?: string;
  cellFont?: FontValue;
  cellColor?: string;
  ranges?: unknown;
  rangeEdges?: RangeEdges;
};

/** One effective column: its declaration merged with its settings. */
export interface TableColumn {
  key: string;
  label: string;
  type: DeclaredColumn['type'];
  visible: Visible;
  cell: Exclude<Cell, 'auto'>;
  linkTemplate?: string;
  sortable: boolean;
  align: 'start' | 'center' | 'end';
  width: 'auto' | 'narrow' | 'wide' | 'px';
  widthPx?: number;
  override: { unit?: string; decimals?: number };
  color?: string;
  headerColor?: string;
  barMax?: number;
  ranges?: unknown[];
}

/**
 * The columns a table shows: the configured ones in their order (a key the query no longer
 * declares is skipped, never shown with an empty header), or every declared column when none is
 * configured. Hidden columns are left out.
 */
export function tableColumns(slot: SlotData | undefined, settings: Sparse): TableColumn[] {
  const s = settings as S;
  const declared = declaredColumns(slot);
  const byKey = new Map(declared.map((c) => [c.key, c]));
  const configured = (Array.isArray(s.columns) ? s.columns : []).filter((c) => c && typeof c.key === 'string' && c.key);
  const source: Array<{ decl: DeclaredColumn; cfg: ColumnSetting }> = configured.length
    ? configured.flatMap((cfg) => (byKey.has(cfg.key!) ? [{ decl: byKey.get(cfg.key!)!, cfg }] : []))
    : declared.map((decl) => ({ decl, cfg: {} }));
  const seen = new Set<string>();
  const out: TableColumn[] = [];
  for (const { decl, cfg } of source) {
    if (seen.has(decl.key) || cfg.visible === 'hidden') continue;
    seen.add(decl.key);
    const cell = cfg.cell && cfg.cell !== 'auto' ? cfg.cell : decl.type === 'badge' ? 'badge' : 'text';
    out.push({
      key: decl.key,
      label: cfg.label?.trim() || decl.label || decl.key,
      type: decl.type,
      visible: cfg.visible ?? 'always',
      cell,
      linkTemplate: cfg.linkTemplate || undefined,
      sortable: cfg.sortable !== false,
      align: cfg.align && cfg.align !== 'auto' ? cfg.align : decl.type === 'number' || cell === 'bar' ? 'end' : 'start',
      width: cfg.width ?? 'auto',
      widthPx: cfg.widthPx,
      override: {
        ...(cfg.unit ? { unit: cfg.unit } : {}),
        ...(typeof cfg.decimals === 'number' ? { decimals: cfg.decimals } : {}),
      },
      color: cfg.color,
      headerColor: cfg.headerColor,
      barMax: typeof cfg.barMax === 'number' ? cfg.barMax : undefined,
      ranges: Array.isArray(cfg.ranges) && cfg.ranges.length ? cfg.ranges : undefined,
    });
  }
  return out;
}

const compareValues = (a: unknown, b: unknown, type: DeclaredColumn['type']): number => {
  const emptyA = a === null || a === undefined || a === '';
  const emptyB = b === null || b === undefined || b === '';
  if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
  const na = num(a);
  const nb = num(b);
  if (na !== null && nb !== null) return na - nb;
  if (type === 'date') {
    const ta = Date.parse(String(a));
    const tb = Date.parse(String(b));
    if (Number.isFinite(ta) && Number.isFinite(tb)) return ta - tb;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
};

/** Rows sorted by a column (empty values last in both directions). Stable; never mutates. */
export function sortRows(rows: Row[], key: string, dir: 'asc' | 'desc', type?: DeclaredColumn['type']): Row[] {
  return rows
    .map((row, i) => ({ row, i }))
    .sort((x, y) => {
      const ex = x.row[key] === null || x.row[key] === undefined || x.row[key] === '';
      const ey = y.row[key] === null || y.row[key] === undefined || y.row[key] === '';
      if (ex || ey) return ex === ey ? x.i - y.i : ex ? 1 : -1;
      const c = compareValues(x.row[key], y.row[key], type ?? 'text');
      return (dir === 'asc' ? c : -c) || x.i - y.i;
    })
    .map((x) => x.row);
}

// ── View ──────────────────────────────────────────────────────────────────────

/** Row, cell and button actions of a table placement (the host runs them; the view never names what happens). */
export interface TableRowActions {
  rowClick?: (row: Row) => void;
  rowDoubleClick?: (row: Row) => void;
  /** Columns that have a cell action; `'*'` = every column. */
  cellClickColumns: string[];
  cellClick: (columnKey: string, row: Row) => void;
  buttons: Array<{ id: string; label: string }>;
  runButton: (id: string, row: Row) => void;
}

export type { PagedEcho } from '../kind';

export interface TableMessages {
  search: string;
  clearSearch: string;
  columns: string;
  actions: string;
  noMatches: string;
  rowsShown: (shown: number, total: number) => string;
  pageOf: (page: number, pages: number | null) => string;
  rowCount: (count: number) => string;
  previous: string;
  next: string;
  pager: string;
}

const MESSAGES: TableMessages = {
  search: 'Search',
  clearSearch: 'Clear',
  columns: 'Columns',
  actions: 'Actions',
  noMatches: 'No matching rows.',
  rowsShown: (shown, total) => `Showing ${shown} of ${total} rows`,
  pageOf: (page, pages) => (pages === null ? `Page ${page}` : `Page ${page} of ${pages}`),
  rowCount: (count) => `${count} rows`,
  previous: 'Previous',
  next: 'Next',
  pager: 'Table pages',
};

export type DataTableViewProps = WidgetViewProps & {
  /** Row / cell / button actions (16.4). */
  rowActions?: TableRowActions;
  /** Set when the host can page the `rows` slot on the server; used only when the result echoes `paging`. */
  paging?: { set: (patch: { page?: number; sort?: { key: string; dir: 'asc' | 'desc' } | undefined; q?: string }) => void };
  messages?: Partial<TableMessages>;
};

const DENSITY: Record<NonNullable<S['density']>, string> = {
  compact: 'px-2 py-1',
  normal: 'px-3 py-2',
  comfortable: 'px-3 py-3',
};
const ALIGN: Record<TableColumn['align'], string> = { start: 'text-left', center: 'text-center', end: 'text-right' };
const WIDTH: Record<TableColumn['width'], string> = { auto: '', narrow: 'w-20', wide: 'min-w-60', px: '' };
const CONTROL = 'rounded-md border border-border bg-surface-overlay px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
const SMALL_BUTTON = 'cursor-pointer rounded border border-border px-2 py-0.5 text-xs hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed';

/** `data.table`: the bound rows with per-column display, viewer sort/search/paging and full styling. */
export function DataTableView({
  settings, format, data, locale, renderLink, rowActions, paging, messages,
}: DataTableViewProps) {
  const s = settings as S;
  const m = { ...MESSAGES, ...messages };
  const result = data.rows;
  const echo = result?.paging;
  const paged = !!echo && !!paging;
  const allColumns = useMemo(() => tableColumns(result, settings), [result, settings]);
  const [hiddenByViewer, setHiddenByViewer] = useState<string[]>([]);
  const columns = allColumns.filter((c) => !hiddenByViewer.includes(c.key));
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(
    s.defaultSort ? { key: s.defaultSort, dir: s.defaultSortDir ?? 'desc' } : null,
  );
  const [query, setQuery] = useState('');
  const [serverQuery, setServerQuery] = useState(echo?.q ?? '');
  const [page, setPage] = useState(1);

  const allRows = useMemo(() => result?.rows ?? [], [result]);
  const pageSize = Math.max(1, Math.min(100, Number(s.maxRows) || 10));
  const viewerSort = s.sortable !== false;
  const clientSearch = !paged && s.search !== false;

  const prepared = useMemo(() => {
    if (paged) return allRows;
    let rows = allRows;
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((row) => columns.some((c) => cellText(row[c.key], c.type, format, c.override, locale).toLowerCase().includes(q)));
    }
    if (sort) {
      const col = allColumns.find((c) => c.key === sort.key) ?? declaredColumns(result).find((c) => c.key === sort.key);
      rows = sortRows(rows, sort.key, sort.dir, col?.type);
    }
    return rows;
  }, [paged, allRows, query, sort, columns, allColumns, result, format, locale]);

  const clientPages = !paged && s.paging === 'pages' ? Math.max(1, Math.ceil(prepared.length / pageSize)) : 1;
  const current = Math.min(page, clientPages);
  const rows = paged
    ? prepared
    : s.paging === 'pages'
      ? prepared.slice((current - 1) * pageSize, current * pageSize)
      : prepared.slice(0, pageSize);

  // Bar scales: the largest absolute value per bar column over the loaded rows.
  const barMax = useMemo(() => {
    const out: Record<string, number> = {};
    for (const c of allColumns) {
      if (c.cell !== 'bar') continue;
      out[c.key] = c.barMax ?? Math.max(0, ...allRows.map((r) => Math.abs(num(r[c.key]) ?? 0)));
    }
    return out;
  }, [allColumns, allRows]);

  const onRow = rowActions?.rowClick;
  const onDouble = rowActions?.rowDoubleClick;
  const interactive = !!(onRow || onDouble);
  const buttons = rowActions?.buttons ?? [];
  const cellCols = rowActions?.cellClickColumns ?? [];
  const cellClickable = (key: string) => cellCols.includes('*') || cellCols.includes(key);
  const pad = DENSITY[s.density ?? 'compact'];
  const border = cssColor(s.borderColor);
  const edges = s.rangeEdges ?? 'from';

  const headerStyle: CSSProperties = {
    ...fontStyle(s.headerFont, s.headerColor),
    ...(cssColor(s.headerBackground) ? { background: cssColor(s.headerBackground) } : {}),
  };

  const sortDirOf = (key: string) => (paged ? (echo!.sort?.key === key ? echo!.sort.dir : null) : sort?.key === key ? sort.dir : null);
  const canSort = (c: TableColumn) => viewerSort && c.sortable && (paged ? echo!.sortable.includes(c.key) : true);
  const toggleSort = (key: string) => {
    const dir = sortDirOf(key);
    const next = dir === 'asc' ? { key, dir: 'desc' as const } : dir === 'desc' ? undefined : { key, dir: 'asc' as const };
    if (paged) paging!.set({ sort: next });
    else { setSort(next ?? null); setPage(1); }
  };

  const renderCell = (c: TableColumn, row: Row): ReactNode => {
    const raw = row[c.key];
    const text = cellText(raw, c.type, format, c.override, locale);
    const n = num(raw);
    if (c.cell === 'badge') {
      if (raw === null || raw === undefined || raw === '') return text;
      return <Badge size="sm" variant={toneOf(raw) ?? 'neutral'}>{text}</Badge>;
    }
    if (c.cell === 'bar') {
      if (n === null) return text;
      const max = barMax[c.key] || 0;
      const pct = max > 0 ? Math.min(100, Math.max(0, (Math.abs(n) / max) * 100)) : 0;
      const color = cssColor(rangeFor(n, c.ranges ?? s.ranges, edges)?.color) ?? cssColor(c.color) ?? 'var(--primary)';
      return (
        <span className="flex items-center justify-end gap-2">
          <span
            role="meter"
            aria-valuenow={n}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={c.label}
            className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-surface-sunken"
          >
            <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
          </span>
          <span className="tabular-nums">{text}</span>
        </span>
      );
    }
    if (c.cell === 'link') {
      const href = c.linkTemplate
        ? expandLinkTemplate(c.linkTemplate, row)
        : isInternalPath(raw) ? raw : null;
      if (href) return linkTo(href, text, LINK_CLASS, renderLink);
    }
    return text;
  };

  const textColor = (c: TableColumn, row: Row): string | undefined =>
    (c.cell === 'text' && c.ranges ? cssColor(rangeFor(row[c.key], c.ranges, edges)?.color) : undefined) ?? cssColor(c.color);

  const rowBackground = (row: Row, i: number): string | undefined => {
    const tint = s.rowColorColumn ? dataColor(row[s.rowColorColumn]) : undefined;
    if (tint) return `color-mix(in srgb, ${tint} 14%, transparent)`;
    return s.striped && i % 2 === 1 ? cssColor(s.stripeColor) ?? 'var(--surface-sunken)' : undefined;
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {(clientSearch || (paged && echo!.searchable && s.search !== false) || s.columnPicker) && (
        <div className="flex items-center gap-2">
          {clientSearch && (
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              maxLength={200}
              placeholder={m.search}
              aria-label={m.search}
              className={cn(CONTROL, 'min-w-0 flex-1')}
            />
          )}
          {paged && echo!.searchable && s.search !== false && (
            <form
              role="search"
              className="flex min-w-0 flex-1 items-center gap-2"
              onSubmit={(e) => { e.preventDefault(); paging!.set({ q: serverQuery.trim() }); }}
            >
              <input
                type="search"
                value={serverQuery}
                onChange={(e) => setServerQuery(e.target.value)}
                maxLength={200}
                placeholder={m.search}
                aria-label={m.search}
                className={cn(CONTROL, 'min-w-0 flex-1')}
              />
              {echo!.q && (
                <button
                  type="button"
                  className="shrink-0 rounded-sm text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  onClick={() => { setServerQuery(''); paging!.set({ q: '' }); }}
                >
                  {m.clearSearch}
                </button>
              )}
            </form>
          )}
          {s.columnPicker && (
            <details className="relative ml-auto shrink-0">
              <summary className={cn(SMALL_BUTTON, 'list-none')}>{m.columns}</summary>
              <fieldset className="absolute right-0 z-20 mt-1 flex min-w-40 flex-col gap-1 rounded-md border border-border bg-surface-raised p-2 shadow-md">
                <legend className="sr-only">{m.columns}</legend>
                {allColumns.map((c) => (
                  <label key={c.key} className="flex cursor-pointer items-center gap-2 text-xs text-text-primary">
                    <input
                      type="checkbox"
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      checked={!hiddenByViewer.includes(c.key)}
                      onChange={(e) => setHiddenByViewer((h) => (e.target.checked ? h.filter((k) => k !== c.key) : [...h, c.key]))}
                    />
                    {c.label}
                  </label>
                ))}
              </fieldset>
            </details>
          )}
        </div>
      )}

      {/* Its own scroller: a wide result must not widen the board's grid cell. */}
      <div className="min-h-0 flex-1 overflow-auto">
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-secondary">{m.noMatches}</p>
        ) : (
          <table className="w-full border-collapse text-sm" style={fontStyle(s.cellFont, s.cellColor)}>
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-secondary" style={border ? { borderColor: border } : undefined}>
                {columns.map((c) => {
                  const dir = sortDirOf(c.key);
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      aria-sort={dir ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
                      className={cn(
                        pad, 'font-medium', ALIGN[c.align], WIDTH[c.width],
                        c.visible === 'desktop' && 'hidden md:table-cell',
                        s.stickyHeader !== false && 'sticky top-0 z-10 bg-surface-raised',
                      )}
                      style={{
                        ...headerStyle,
                        ...(c.headerColor && cssColor(c.headerColor) ? { color: cssColor(c.headerColor) } : {}),
                        ...(c.width === 'px' && c.widthPx ? { width: c.widthPx, minWidth: c.widthPx } : {}),
                      }}
                    >
                      {canSort(c) ? (
                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-1 rounded-sm font-medium hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                          onClick={() => toggleSort(c.key)}
                        >
                          {c.label}<span aria-hidden="true">{dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : ''}</span>
                        </button>
                      ) : c.label}
                    </th>
                  );
                })}
                {buttons.length > 0 && (
                  <th scope="col" className={cn(pad, 'font-medium', s.stickyHeader !== false && 'sticky top-0 z-10 bg-surface-raised')} style={headerStyle}>
                    <span className="sr-only">{m.actions}</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-border/50 last:border-0',
                    interactive && 'cursor-pointer hover:bg-surface-sunken focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus',
                  )}
                  style={{ ...(border ? { borderColor: border } : {}), ...(rowBackground(row, i) ? { background: rowBackground(row, i) } : {}) }}
                  {...(interactive ? {
                    tabIndex: 0,
                    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onRow?.(row); },
                    onDoubleClick: onDouble ? (e: React.MouseEvent) => { e.stopPropagation(); onDouble(row); } : undefined,
                    onKeyDown: (e: React.KeyboardEvent) => {
                      // Only the row's own Enter/Space: a key press on an inner button belongs to that button.
                      if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                        e.preventDefault(); e.stopPropagation(); (onRow ?? onDouble)?.(row);
                      }
                    },
                  } : {})}
                >
                  {columns.map((c) => {
                    const color = textColor(c, row);
                    const content = renderCell(c, row);
                    return (
                      <td
                        key={c.key}
                        className={cn(
                          pad, ALIGN[c.align], WIDTH[c.width],
                          (c.type === 'number' || c.cell === 'bar') && 'tabular-nums',
                          c.visible === 'desktop' && 'hidden md:table-cell',
                        )}
                        style={{
                          ...(color ? { color } : {}),
                          ...(c.width === 'px' && c.widthPx ? { width: c.widthPx, minWidth: c.widthPx } : {}),
                        }}
                      >
                        {rowActions && cellClickable(c.key) && c.cell !== 'link' ? (
                          <button
                            type="button"
                            className="cursor-pointer rounded-sm text-left underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                            onClick={(e) => { e.stopPropagation(); rowActions.cellClick(c.key, row); }}
                            onDoubleClick={(e) => e.stopPropagation()}
                          >
                            {content}
                          </button>
                        ) : content}
                      </td>
                    );
                  })}
                  {buttons.length > 0 && (
                    <td className={cn(pad, 'whitespace-nowrap text-right')}>
                      {buttons.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          className={cn(SMALL_BUTTON, 'ml-1')}
                          onClick={(e) => { e.stopPropagation(); rowActions?.runButton(b.id, row); }}
                          onDoubleClick={(e) => e.stopPropagation()}
                        >
                          {b.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!paged && s.paging !== 'pages' && prepared.length > rows.length && (
        <p className="px-2 text-xs text-text-secondary">{m.rowsShown(rows.length, prepared.length)}</p>
      )}
      {!paged && s.paging === 'pages' && clientPages > 1 && (
        <Pagination size="sm" page={current} totalPages={clientPages} onPageChange={setPage} className="justify-end" />
      )}
      {paged && (() => {
        const total = result?.total;
        const pages = total !== undefined ? Math.max(1, Math.ceil(total / echo!.pageSize)) : null;
        return (
          <nav className="flex items-center justify-between gap-2 text-xs text-text-secondary" aria-label={m.pager}>
            <span>
              {m.pageOf(echo!.page, pages)}
              {total !== undefined && ` · ${m.rowCount(total)}`}
            </span>
            <span className="flex gap-1">
              <button type="button" className={SMALL_BUTTON} disabled={echo!.page <= 1} onClick={() => paging!.set({ page: echo!.page - 1 })}>
                {m.previous}
              </button>
              <button
                type="button"
                className={SMALL_BUTTON}
                disabled={pages !== null ? echo!.page >= pages : allRows.length < echo!.pageSize}
                onClick={() => paging!.set({ page: echo!.page + 1 })}
              >
                {m.next}
              </button>
            </span>
          </nav>
        );
      })()}
    </div>
  );
}

export const DATA_TABLE_VIEW: WidgetKindView = {
  View: DataTableView,
  isEmpty: (data, settings) => !data.rows?.rows?.length || tableColumns(data.rows, settings).length === 0,
  toCsv: (data, settings) => {
    const cols = tableColumns(data.rows, settings);
    if (!cols.length) return [];
    return [cols.map((c) => c.label), ...(data.rows?.rows ?? []).map((row) => cols.map((c) => rawText(row[c.key])))];
  },
};
