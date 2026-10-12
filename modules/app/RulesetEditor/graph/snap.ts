/** Grid snap and alignment guides for dragging blocks. Pure: no DOM. */

/** blocks snap to this grid while dragging (Alt moves freely) */
export const SNAP_GRID = 12;
/** a guide line catches within this many screen pixels */
export const GUIDE_PX = 6;

/** A grid snap, or a plain rounding when `free`. */
export function snapValue(value: number, free = false): number {
  return free ? Math.round(value) : Math.round(value / SNAP_GRID) * SNAP_GRID;
}

export type Box = { id: string; x: number; y: number; w: number; h: number };
export type Placement = { id: string; x: number; y: number };

/** A vertical line (`axis: 'x'` at world x `at`, from `from` to `to` in y) or a horizontal one (`axis: 'y'`). */
export type GuideLine = { axis: 'x' | 'y'; at: number; from: number; to: number };

type Hit = { d: number; at: number };

/** the nearest alignment on one axis: [lo, middle, hi] of the moving blocks against the edges of the others */
function nearest(lo: number, hi: number, others: Box[], edges: (o: Box) => number[], tol: number): Hit | null {
  let best: Hit | null = null;
  for (const o of others)
    for (const m of [lo, (lo + hi) / 2, hi])
      for (const t of edges(o)) {
        const d = t - m;
        if (Math.abs(d) <= tol && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, at: t };
      }
  return best;
}

const near = (a: number, b: number) => Math.abs(a - b) < 0.5;

/**
 * Where the dragged blocks go. `moving` holds their free positions (start plus pointer distance), `others`
 * the blocks that stay. The dragged blocks are treated as one box: when its left / middle / right or top /
 * middle / bottom is within `tol` (world units) of the same line of another block, everything jumps onto the
 * line and a guide is returned; otherwise the positions go on the grid. `free` (Alt) rounds to whole pixels and
 * shows no guide.
 */
export function snapDrag(moving: Box[], others: Box[], opts: { tol: number; free?: boolean }): { positions: Placement[]; guides: GuideLine[] } {
  if (opts.free || !moving.length) {
    return { positions: moving.map((m) => ({ id: m.id, x: snapValue(m.x, true), y: snapValue(m.y, true) })), guides: [] };
  }
  const box = {
    x0: Math.min(...moving.map((m) => m.x)), x1: Math.max(...moving.map((m) => m.x + m.w)),
    y0: Math.min(...moving.map((m) => m.y)), y1: Math.max(...moving.map((m) => m.y + m.h)),
  };
  const xEdges = (o: Box) => [o.x, o.x + o.w / 2, o.x + o.w];
  const yEdges = (o: Box) => [o.y, o.y + o.h / 2, o.y + o.h];
  const bx = nearest(box.x0, box.x1, others, xEdges, opts.tol);
  const by = nearest(box.y0, box.y1, others, yEdges, opts.tol);
  const positions = moving.map((m) => ({ id: m.id, x: bx ? m.x + bx.d : snapValue(m.x), y: by ? m.y + by.d : snapValue(m.y) }));

  /* the lines run from the dragged blocks to the blocks that line up with them */
  const mine = positions.map((p, i) => ({ x: p.x, y: p.y, w: moving[i].w, h: moving[i].h }));
  const guides: GuideLine[] = [];
  if (bx) {
    const ys = [
      ...mine.flatMap((m) => [m.y, m.y + m.h]),
      ...others.filter((o) => xEdges(o).some((t) => near(t, bx.at))).flatMap((o) => [o.y, o.y + o.h]),
    ];
    guides.push({ axis: 'x', at: bx.at, from: Math.min(...ys), to: Math.max(...ys) });
  }
  if (by) {
    const xs = [
      ...mine.flatMap((m) => [m.x, m.x + m.w]),
      ...others.filter((o) => yEdges(o).some((t) => near(t, by.at))).flatMap((o) => [o.x, o.x + o.w]),
    ];
    guides.push({ axis: 'y', at: by.at, from: Math.min(...xs), to: Math.max(...xs) });
  }
  return { positions, guides };
}
