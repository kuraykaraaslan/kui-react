import type { GraphEdge, GraphNode } from './types';

export type LayoutOptions = {
  /** width of a box */
  w?: number;
  /** height of a box: a number, or a function of the node */
  h?: number | ((node: GraphNode) => number);
  /** gap between columns and between boxes of a column */
  gx?: number;
  gy?: number;
};

export type Positions = Record<string, { x: number; y: number }>;

type LayoutNode = Pick<GraphNode, 'nodeId' | 'x' | 'y'>;

/**
 * Auto layout: layered (a simple Sugiyama), deterministic. The layer of a block is the longest path from the
 * entries (the back wires of a loop are ignored); the order inside a layer follows the mean place of the
 * neighbours (two sweeps down, two up); separate parts of the flow are stacked. The top left of the old boxes is
 * kept. Returns `{ nodeId: { x, y } }` and changes nothing.
 */
export function autoLayout(nodes: LayoutNode[], edges: Pick<GraphEdge, 'sourceNodeId' | 'targetNodeId'>[], options: LayoutOptions = {}): Positions {
  const o = { w: 184, h: 100, gx: 64, gy: 28, ...options };
  const heightOf = (n: LayoutNode): number => (typeof o.h === 'function' ? o.h(n as GraphNode) : o.h);
  const ids = nodes.map((n) => n.nodeId);
  const by = new Map<string, LayoutNode>(nodes.map((n) => [n.nodeId, n]));
  const out = new Map<string, string[]>(ids.map((id) => [id, []]));
  const inn = new Map<string, string[]>(ids.map((id) => [id, []]));
  const order = (a: string, b: string): number => {
    const na = by.get(a) as LayoutNode, nb = by.get(b) as LayoutNode;
    return (na.y - nb.y) || (na.x - nb.x) || (a < b ? -1 : a > b ? 1 : 0);
  };

  const seen = new Set<string>();
  for (const e of edges) {
    const key = `${e.sourceNodeId}|${e.targetNodeId}`;
    if (by.has(e.sourceNodeId) && by.has(e.targetNodeId) && e.sourceNodeId !== e.targetNodeId && !seen.has(key)) {
      seen.add(key);
      out.get(e.sourceNodeId)!.push(e.targetNodeId);
      inn.get(e.targetNodeId)!.push(e.sourceNodeId);
    }
  }
  for (const id of ids) out.get(id)!.sort(order);

  /* DFS from the entries: an edge to a node that is still open is a back wire */
  const state = new Map<string, number>();
  const topo: string[] = [];
  const back = new Set<string>();
  const visit = (id: string): void => {
    state.set(id, 1);
    for (const t of out.get(id)!) {
      if (state.get(t) === 1) back.add(`${id}|${t}`);
      else if (!state.get(t)) visit(t);
    }
    state.set(id, 2);
    topo.push(id);
  };
  for (const id of ids.filter((x) => !inn.get(x)!.length).sort(order)) if (!state.get(id)) visit(id);
  for (const id of ids.slice().sort(order)) if (!state.get(id)) visit(id);
  topo.reverse();

  const layer = new Map<string, number>(topo.map((id) => [id, 0]));
  for (const id of topo)
    for (const t of out.get(id)!)
      if (!back.has(`${id}|${t}`)) layer.set(t, Math.max(layer.get(t)!, layer.get(id)! + 1));

  /* parts: connected without regard to direction */
  const comp = new Map<string, number>();
  const parts: string[][] = [];
  for (const id of ids.slice().sort(order)) {
    if (comp.has(id)) continue;
    const k = parts.length, part: string[] = [], stack = [id];
    comp.set(id, k);
    while (stack.length) {
      const c = stack.pop() as string;
      part.push(c);
      for (const t of out.get(c)!.concat(inn.get(c)!)) if (!comp.has(t)) { comp.set(t, k); stack.push(t); }
    }
    parts.push(part);
  }

  const x0 = nodes.length ? Math.min(...nodes.map((n) => n.x)) : 0;
  let y = nodes.length ? Math.min(...nodes.map((n) => n.y)) : 0;
  const res: Positions = {};
  for (const part of parts) {
    const cols: string[][] = [];
    for (const id of part.slice().sort(order)) (cols[layer.get(id)!] ||= []).push(id);
    for (let c = 0; c < cols.length; c++) cols[c] ||= [];
    const pos = new Map<string, number>();
    cols.forEach((col) => col.forEach((id, i) => pos.set(id, i)));
    const sweep = (c: number, nb: Map<string, string[]>): void => {
      const mean = (id: string): number => {
        const l = nb.get(id)!.filter((t) => !back.has(`${id}|${t}`) && !back.has(`${t}|${id}`) && layer.get(t) !== layer.get(id));
        return l.length ? l.reduce((s, t) => s + pos.get(t)!, 0) / l.length : pos.get(id)!;
      };
      const m = new Map<string, number>(cols[c].map((id) => [id, mean(id)]));
      cols[c].sort((a, b) => (m.get(a)! - m.get(b)!) || (pos.get(a)! - pos.get(b)!));
      cols[c].forEach((id, i) => pos.set(id, i));
    };
    for (let r = 0; r < 2; r++) {
      for (let c = 1; c < cols.length; c++) sweep(c, inn);
      for (let c = cols.length - 2; c >= 0; c--) sweep(c, out);
    }
    let bottom = y;
    cols.forEach((col, c) => {
      let cy = y;
      for (const id of col) {
        res[id] = { x: x0 + c * (o.w + o.gx), y: cy };
        cy += heightOf(by.get(id) as LayoutNode) + o.gy;
      }
      bottom = Math.max(bottom, cy);
    });
    y = bottom + o.gy;
  }
  return res;
}
