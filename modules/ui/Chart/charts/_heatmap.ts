// Grid maths for HeatmapChart (phase 9 §9.4). Pure, dependency-free.

export interface HeatCell { x: string | number; y: string | number; value: number | null }

export interface HeatGrid {
  xs: string[];
  ys: string[];
  /** `values[yi][xi]`; null = no cell. */
  values: Array<Array<number | null>>;
  min: number;
  max: number;
}

const MAX_AXIS = 200;

/**
 * Cells (long format) → a dense grid. Axis order is first appearance, except that
 * an all-numeric axis is sorted numerically. A repeated (x, y) keeps the LAST value
 * (newest wins); a non-finite value is an empty cell. Axes are capped so a runaway
 * table cannot create a million SVG rects.
 */
export function buildHeatGrid(cells: HeatCell[], maxAxis = MAX_AXIS): HeatGrid {
  const order = (get: (c: HeatCell) => string | number): string[] => {
    const seen = new Map<string, number | string>();
    for (const c of cells) {
      const raw = get(c);
      const key = String(raw);
      if (!seen.has(key)) seen.set(key, raw);
    }
    const keys = [...seen.keys()];
    const numeric = keys.length > 0 && keys.every((k) => k.trim() !== '' && Number.isFinite(Number(k)));
    if (numeric) keys.sort((a, b) => Number(a) - Number(b));
    return keys.slice(0, maxAxis);
  };
  const xs = order((c) => c.x);
  const ys = order((c) => c.y);
  const xi = new Map(xs.map((k, i) => [k, i]));
  const yi = new Map(ys.map((k, i) => [k, i]));
  const values: Array<Array<number | null>> = ys.map(() => xs.map(() => null));
  let min = Infinity;
  let max = -Infinity;
  for (const c of cells) {
    const i = xi.get(String(c.x));
    const j = yi.get(String(c.y));
    if (i === undefined || j === undefined) continue;
    const v = typeof c.value === 'number' && Number.isFinite(c.value) ? c.value : null;
    values[j][i] = v;
  }
  for (const row of values) for (const v of row) {
    if (v === null) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min)) { min = 0; max = 1; }
  return { xs, ys, values, min, max };
}

/** 0..1 position of `v` in `[min, max]`; a flat range maps to 1 (a single value is "full"). */
export function heatIntensity(v: number, min: number, max: number): number {
  if (max <= min) return 1;
  return Math.min(1, Math.max(0, (v - min) / (max - min)));
}
