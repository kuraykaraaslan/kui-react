/** Box (frame) select: the frame in screen pixels against the blocks in world coordinates. Pure: no DOM. */

export type Frame = { x0: number; y0: number; x1: number; y1: number };
export type FrameView = { x: number; y: number; k: number };
type Placed = { nodeId: string; x: number; y: number };

/** the frame has to travel this many pixels (|dx| + |dy|) before it counts */
export const FRAME_MIN = 4;

/** the corners put in order: x0 <= x1, y0 <= y1 */
export function normalizeFrame(f: Frame): Frame {
  return { x0: Math.min(f.x0, f.x1), y0: Math.min(f.y0, f.y1), x1: Math.max(f.x0, f.x1), y1: Math.max(f.y0, f.y1) };
}

/** has the pointer moved far enough to draw a frame? */
export function frameMoved(f: Frame): boolean {
  return Math.abs(f.x1 - f.x0) + Math.abs(f.y1 - f.y0) > FRAME_MIN;
}

/** a frame in container pixels as a frame in world coordinates (undoes pan and zoom) */
export function frameToWorld(f: Frame, view: FrameView): Frame {
  const n = normalizeFrame(f);
  return { x0: (n.x0 - view.x) / view.k, y0: (n.y0 - view.y) / view.k, x1: (n.x1 - view.x) / view.k, y1: (n.y1 - view.y) / view.k };
}

/** ids of the blocks a world frame touches (an overlap is enough) */
export function hitNodes(nodes: Placed[], world: Frame, width: number, height: (n: Placed) => number): string[] {
  return nodes
    .filter((n) => n.x < world.x1 && n.x + width > world.x0 && n.y < world.y1 && n.y + height(n) > world.y0)
    .map((n) => n.nodeId);
}

/** the selection after a frame: the hits, added to the current selection with `add` (Shift, Ctrl, ⌘) */
export function mergeSelection(current: string[], hit: string[], add: boolean): string[] {
  if (!add) return hit;
  return [...current.filter((id) => !hit.includes(id)), ...hit];
}
