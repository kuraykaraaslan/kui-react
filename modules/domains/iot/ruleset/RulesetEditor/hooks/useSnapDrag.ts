'use client';
import { useRef, useState } from 'react';
import { GUIDE_PX, snapDrag, type Box, type GuideLine } from '../../graph/snap';
import type { GraphNode } from '../../graph/types';
import type { Point } from '../geometry';

/**
 * Grid snap and alignment guides for a drag. `resolve` turns "these blocks started here and the pointer moved
 * (dx, dy) in world units" into the positions to show, and keeps the guide lines in `guides`. The blocks snap
 * to a 12 px grid; within 6 screen pixels of the left / middle / right or top / middle / bottom of another block
 * they jump onto that line and the line is drawn. Alt moves freely. The drag hook calls `clear` when it ends.
 */
export function useSnapDrag({ getNodes, heightOf, nodeWidth, getZoom }: {
  getNodes: () => Pick<GraphNode, 'nodeId' | 'x' | 'y'>[];
  heightOf: (nodeId: string) => number;
  nodeWidth: number;
  getZoom: () => number;
}) {
  const [guides, setGuides] = useState<GuideLine[]>([]);
  const shown = useRef(false);

  function show(lines: GuideLine[]) {
    if (!lines.length && !shown.current) return;
    shown.current = lines.length > 0;
    setGuides(lines);
  }

  function resolve(starts: Record<string, Point>, dx: number, dy: number, free: boolean): Record<string, Point> {
    const moving: Box[] = Object.entries(starts).map(([id, p]) => ({ id, x: p.x + dx, y: p.y + dy, w: nodeWidth, h: heightOf(id) }));
    const others: Box[] = getNodes()
      .filter((n) => !(n.nodeId in starts))
      .map((n) => ({ id: n.nodeId, x: n.x, y: n.y, w: nodeWidth, h: heightOf(n.nodeId) }));
    const out = snapDrag(moving, others, { tol: GUIDE_PX / (getZoom() || 1), free });
    show(out.guides);
    return Object.fromEntries(out.positions.map((p) => [p.id, { x: p.x, y: p.y }]));
  }

  function clear() {
    show([]);
  }

  return { guides, resolve, clear };
}
