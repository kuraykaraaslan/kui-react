// Pure data shaping for the chart views (no React): repeatable slot merging, series for the
// band and time axes, per-series settings, pie slices, scatter groups, histogram bins, heatmap
// cells and CSV rows. Behaviour matches next-boilerplate's renderers it replaces
// (series-chart, series-config, general-logic, widget-logic).

import type { Series } from '@/modules/ui/Chart';
import type { SlotData } from '../kind';
import { cssColor, formatValue, type ValueFormat } from '../settings/style';

type Row = Record<string, unknown>;
type Data = Record<string, SlotData | undefined>;

/** A result value as a finite number, or null. */
export function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

const SUFFIX = /^([^#]+)#([2-8])$/;

/** Every key of `data` that belongs to slot `base`, in source order (`series`, `series#2`, …). */
export function slotKeysOf(base: string, keys: Iterable<string>): string[] {
  const n = (k: string) => {
    const m = SUFFIX.exec(k);
    return m && m[1] === base ? Number(m[2]) : k === base ? 1 : 0;
  };
  return [...keys].filter((k) => n(k) > 0).sort((a, b) => n(a) - n(b));
}

/**
 * One result out of every source bound to a repeatable slot. A source that answered nothing is
 * skipped; a name repeated by a later source becomes `<name> (<n>)` so legend toggling and
 * per-series settings stay unambiguous.
 */
export function mergeSeriesSlots(data: Data | undefined, base = 'series'): SlotData | undefined {
  if (!data) return undefined;
  const keys = slotKeysOf(base, Object.keys(data)).filter((k) => data[k]);
  if (keys.length <= 1) return keys.length === 1 ? data[keys[0]] : undefined;
  const seen = new Map<string, number>();
  const merged: NonNullable<SlotData['series']> = [];
  for (const key of keys) {
    for (const s of data[key]?.series ?? []) {
      const count = (seen.get(s.name) ?? 0) + 1;
      seen.set(s.name, count);
      merged.push(count === 1 ? s : { ...s, name: `${s.name} (${count})` });
    }
  }
  return { ...data[keys[0]], shape: 'series', series: merged };
}

/** `2026-10-06T12:00:00Z` → `12:00` for a short span, `Oct 6` for a long one; non-dates pass through. */
export function formatAxisLabels(labels: string[], locale?: string): string[] {
  const times = labels.map((l) => Date.parse(l));
  if (times.length === 0 || times.some((t) => Number.isNaN(t))) return labels;
  const spanMs = Math.max(...times) - Math.min(...times);
  const options: Intl.DateTimeFormatOptions = spanMs <= 2 * 24 * 3_600_000
    ? { hour: '2-digit', minute: '2-digit' }
    : spanMs <= 120 * 24 * 3_600_000
      ? { month: 'short', day: 'numeric' }
      : { year: '2-digit', month: 'short' };
  return times.map((t) => new Date(t).toLocaleString(locale, options));
}

/** Band-axis series: every series aligned onto the union of timestamps (no shifted second series). */
export function toBandSeries(result: SlotData | undefined, locale?: string): Series[] | null {
  const series = result?.series;
  if (!series || series.length === 0) return null;
  const stamps = [...new Set(series.flatMap((s) => s.points.map((p) => p.t)))].sort();
  if (stamps.length === 0) return null;
  const labels = formatAxisLabels(stamps, locale);
  return series.map((s) => {
    const byT = new Map(s.points.map((p) => [p.t, p.v]));
    return { id: s.name, name: s.name, data: stamps.map((t, i) => ({ x: labels[i], y: byT.get(t) ?? null })) };
  });
}

/** Time-axis series (x = epoch ms). Null when any timestamp is not a date (the band axis then applies). */
export function toTimeSeries(result: SlotData | undefined): Series[] | null {
  const series = result?.series;
  if (!series || series.length === 0) return null;
  const out: Series[] = [];
  let any = false;
  for (const s of series) {
    const data: Series['data'] = [];
    for (const p of s.points) {
      const t = Date.parse(p.t);
      if (Number.isNaN(t)) return null;
      data.push({ x: t, y: p.v });
      any = true;
    }
    out.push({ id: s.name, name: s.name, data });
  }
  return any ? out : null;
}

/** One `series` repeater item as stored. */
export interface SeriesRule {
  key?: string;
  label?: string;
  color?: string;
  unit?: string;
  decimals?: number | null;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  width?: number | null;
  showPoints?: '' | 'on' | 'off';
  fillOpacity?: number | null;
  startHidden?: boolean;
}

const defined = <T extends object>(o: T): Partial<T> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== '')) as Partial<T>;

/** The rule for a series: an exact name beats `*`; later items beat earlier ones of the same kind. */
export function ruleFor(name: string, rules: unknown): SeriesRule | undefined {
  if (!Array.isArray(rules)) return undefined;
  let exact: SeriesRule | undefined;
  let any: SeriesRule | undefined;
  for (const r of rules as SeriesRule[]) {
    if (!r || typeof r !== 'object') continue;
    const key = r.key || '*';
    if (key === name) exact = { ...exact, ...defined(r) };
    else if (key === '*') any = { ...any, ...defined(r) };
  }
  return exact || any ? { ...any, ...exact } : undefined;
}

export interface SeriesStyleOptions {
  format: ValueFormat;
  locale?: string;
  /** Chart-level stroke width / points (series rules override). */
  lineWidth?: number;
  showPoints?: boolean;
  /** Colour for series without their own (else the palette). */
  defaultColor?: string;
}

/** Apply the `series` repeater (label, colour, format, stroke) to chart series. Ids stay the source names. */
export function applySeriesRules(series: Series[], rules: unknown, o: SeriesStyleOptions): Series[] {
  return series.map((s) => {
    const r = ruleFor(s.id, rules) ?? {};
    const override = defined({ unit: r.unit, decimals: typeof r.decimals === 'number' ? r.decimals : undefined });
    const color = cssColor(r.color) ?? cssColor(o.defaultColor);
    const width = typeof r.width === 'number' ? r.width : o.lineWidth;
    const points = r.showPoints === 'on' ? true : r.showPoints === 'off' ? false : o.showPoints;
    return {
      ...s,
      name: r.label ? r.label.replaceAll('${name}', s.name) : s.name,
      ...(color ? { color } : {}),
      ...(r.lineStyle ? { lineStyle: r.lineStyle } : {}),
      ...(width !== undefined ? { strokeWidth: width } : {}),
      ...(points !== undefined ? { showPoints: points } : {}),
      ...(typeof r.fillOpacity === 'number' ? { fillOpacity: r.fillOpacity } : {}),
      ...(r.startHidden ? { hidden: true } : {}),
      format: (v: number) => formatValue(v, o.format, override, o.locale),
    };
  });
}

/**
 * The value-axis formatter: a per-series unit/decimals override is used on the axis only when
 * every series that has one agrees and no series is left on the widget format with a unit clash.
 */
export function axisFormat(series: Series[], rules: unknown, format: ValueFormat, locale?: string): (v: number) => string {
  const overrides = new Set<string>();
  let sample: { unit?: string; decimals?: number } | undefined;
  for (const s of series) {
    const r = ruleFor(s.id, rules);
    const o = defined({ unit: r?.unit, decimals: typeof r?.decimals === 'number' ? r.decimals : undefined });
    overrides.add(JSON.stringify([o.unit ?? null, o.decimals ?? null]));
    sample = o;
  }
  const one = overrides.size === 1 && sample ? sample : {};
  return (v) => formatValue(v, format, one, locale);
}

// ── chart.pie ──────────────────────────────────────────────────────────────

export interface PieOptions {
  label: string;
  value: string;
  max?: number;
  sort?: 'desc' | 'asc' | 'none';
  otherLabel?: string;
  colors?: unknown;
}

/**
 * Table rows → one series whose points are the slices. Negative, zero and non-numeric values are
 * not slices. Past `max`, the smallest fold into one "Other" (always last). `sort` orders the rest.
 */
export function rowsToPieSeries(rows: Row[] | undefined, o: PieOptions): Series[] | null {
  const slices: Array<{ x: string; y: number; at: number }> = [];
  for (const row of rows ?? []) {
    const v = asNumber(row[o.value]);
    const l = row[o.label];
    if (v === null || v <= 0 || l === null || l === undefined || l === '') continue;
    slices.push({ x: String(l), y: v, at: slices.length });
  }
  if (slices.length === 0) return null;
  const limit = Math.max(2, Math.trunc(o.max ?? 8) || 8);
  let kept = slices;
  let other: number | null = null;
  if (slices.length > limit) {
    const bySize = [...slices].sort((a, b) => b.y - a.y);
    kept = bySize.slice(0, limit - 1);
    other = bySize.slice(limit - 1).reduce((acc, s) => acc + s.y, 0);
  }
  const sort = o.sort ?? 'desc';
  kept = [...kept].sort((a, b) => (sort === 'desc' ? b.y - a.y : sort === 'asc' ? a.y - b.y : a.at - b.at));
  const pinned = new Map<string, string>();
  if (Array.isArray(o.colors)) {
    for (const c of o.colors as Array<{ key?: string; color?: string }>) {
      const color = cssColor(c?.color);
      if (c?.key && color) pinned.set(c.key, color);
    }
  }
  const data = kept.map((s) => ({ x: s.x, y: s.y, ...(pinned.has(s.x) ? { color: pinned.get(s.x) } : {}) }));
  if (other !== null) {
    const name = o.otherLabel || 'Other';
    data.push({ x: name, y: other, ...(pinned.has(name) ? { color: pinned.get(name) } : {}) });
  }
  return [{ id: 'pie', name: 'pie', data }];
}

// ── chart.scatter ──────────────────────────────────────────────────────────

/** Table rows → scatter series (one per distinct group, ≤ 8). A row without a finite x AND y is skipped. Capped. */
export function rowsToScatterSeries(
  rows: Row[] | undefined,
  cols: { x: string; y: string; group?: string },
  maxPoints = 5000,
  maxGroups = 8,
): Series[] | null {
  const groups = new Map<string, Series>();
  let count = 0;
  for (const row of rows ?? []) {
    if (count >= maxPoints) break;
    const x = asNumber(row[cols.x]);
    const y = asNumber(row[cols.y]);
    if (x === null || y === null) continue;
    const raw = cols.group ? row[cols.group] : undefined;
    const g = raw === null || raw === undefined || raw === '' ? 'Series' : String(raw);
    let s = groups.get(g);
    if (!s) {
      if (groups.size >= maxGroups) continue;
      s = { id: g, name: g, data: [] };
      groups.set(g, s);
    }
    s.data.push({ x, y });
    count += 1;
  }
  return count === 0 ? null : [...groups.values()];
}

// ── chart.histogram ────────────────────────────────────────────────────────

export interface HistogramBin { from: number; to: number; count: number }

/** Sturges' rule, clamped to 3..50. */
export function autoBinCount(n: number): number {
  return Math.min(50, Math.max(3, Math.ceil(Math.log2(Math.max(1, n)) + 1)));
}

/** Equal-width bins over [min, max]; the last bin is closed on the right. All-equal values give one bin. */
export function histogramBins(values: unknown[], bins?: number | null, rangeMin?: number | null, rangeMax?: number | null): HistogramBin[] {
  const nums = values.map(asNumber).filter((v): v is number => v !== null);
  if (nums.length === 0) return [];
  const lo = rangeMin ?? Math.min(...nums);
  const hi = rangeMax ?? Math.max(...nums);
  if (!(hi > lo)) return [{ from: lo, to: hi, count: nums.filter((v) => v === lo).length }];
  const k = Math.min(50, Math.max(1, Math.trunc(bins ?? autoBinCount(nums.length)) || autoBinCount(nums.length)));
  const width = (hi - lo) / k;
  const out: HistogramBin[] = Array.from({ length: k }, (_, i) => ({ from: lo + i * width, to: lo + (i + 1) * width, count: 0 }));
  for (const v of nums) {
    if (v < lo || v > hi) continue;
    out[Math.min(k - 1, Math.floor((v - lo) / width))].count += 1;
  }
  return out;
}

// ── heatmap ───────────────────────────────────────────────────────────────

/** Table rows → heatmap cells. A row missing x or y is skipped; a non-numeric value is an empty cell, never 0. */
export function rowsToHeatCells(
  rows: Row[] | undefined,
  cols: { x: string; y: string; value: string },
  max = 20_000,
): Array<{ x: string | number; y: string | number; value: number | null }> {
  const out: Array<{ x: string | number; y: string | number; value: number | null }> = [];
  for (const row of rows ?? []) {
    if (out.length >= max) break;
    const x = row[cols.x];
    const y = row[cols.y];
    if (x === null || x === undefined || x === '' || y === null || y === undefined || y === '') continue;
    out.push({ x: x as string | number, y: y as string | number, value: asNumber(row[cols.value]) });
  }
  return out;
}

// ── CSV ───────────────────────────────────────────────────────────────────

const cell = (v: unknown): string => (v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));

/** Series → `time, series, value` rows (raw values; the host guards formula injection). */
export function seriesCsv(result: SlotData | undefined): string[][] {
  const out: string[][] = [['time', 'series', 'value']];
  for (const s of result?.series ?? []) for (const p of s.points) out.push([p.t, s.name, cell(p.v)]);
  return out;
}

/** A table slot → its declared columns (header = column keys), else the keys of the first row. */
export function tableCsv(slot: SlotData | undefined): string[][] {
  const rows = slot?.rows ?? [];
  const keys = slot?.columns?.length ? slot.columns.map((c) => c.key) : Object.keys(rows[0] ?? {});
  if (!keys.length) return [];
  return [keys, ...rows.map((r) => keys.map((k) => cell(r[k])))];
}
