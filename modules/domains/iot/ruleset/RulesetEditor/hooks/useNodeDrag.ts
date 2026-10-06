'use client';
import { useRef, useState } from 'react';
import { moveNodes, placeNodes } from '../../graph/edit';
import type { Graph } from '../../graph/types';
import type { Point } from '../geometry';

/** pixels the pointer must move before a press counts as a drag */
const DRAG_THRESHOLD = 4;

/**
 * Dragging nodes: the pressed node and every node selected with it move together. The graph changes while
 * the pointer moves (no history step); `endDrag` says whether anything moved so the editor can commit once.
 * With `resolve` (grid snap and guide lines, see useSnapDrag) the positions come from there; without it
 * they are rounded to 4 px.
 */
export function useNodeDrag({ getGraph, setGraph, toWorld, readOnly, connecting, resolve, onEnd }: {
  getGraph: () => Graph;
  setGraph: (fn: (graph: Graph) => Graph) => void;
  /** screen (client) coordinates → canvas world coordinates (pan + zoom aware) */
  toWorld: (clientX: number, clientY: number) => Point;
  readOnly: boolean;
  connecting: unknown;
  /** where the dragged nodes go: their start positions, the distance in world units, and whether Alt is held (free move) */
  resolve?: (starts: Record<string, Point>, dx: number, dy: number, free: boolean) => Record<string, Point>;
  /** the drag is over (also when it was cancelled) */
  onEnd?: () => void;
}) {
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const startWorld = useRef<Point>({ x: 0, y: 0 });
  const startClient = useRef<Point>({ x: 0, y: 0 });
  const starts = useRef<Record<string, Point>>({});
  const dragMoved = useRef(false);

  /** press on a node, or on a group tab (`primaryId` null): drag `ids` */
  function start(e: React.PointerEvent, ids: string[], primaryId: string | null) {
    if (connecting || readOnly) return;
    e.stopPropagation();
    const nodes = getGraph().nodes;
    starts.current = Object.fromEntries(nodes.filter((n) => ids.includes(n.nodeId)).map((n) => [n.nodeId, { x: n.x, y: n.y }]));
    startWorld.current = toWorld(e.clientX, e.clientY);
    startClient.current = { x: e.clientX, y: e.clientY };
    dragMoved.current = false;
    setDragNodeId(primaryId);
    setDragging(true);
  }

  function applyPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    if (Math.abs(e.clientX - startClient.current.x) > DRAG_THRESHOLD || Math.abs(e.clientY - startClient.current.y) > DRAG_THRESHOLD) dragMoved.current = true;
    if (!dragMoved.current) return;
    const p = toWorld(e.clientX, e.clientY);
    const dx = p.x - startWorld.current.x;
    const dy = p.y - startWorld.current.y;
    if (resolve) {
      const positions = resolve(starts.current, dx, dy, e.altKey);
      setGraph((g) => placeNodes(g, positions));
    } else {
      setGraph((g) => moveNodes(g, starts.current, dx, dy));
    }
  }

  /** stop dragging; true when the nodes were moved */
  function endDrag(): boolean {
    const moved = dragging && dragMoved.current;
    setDragNodeId(null);
    setDragging(false);
    onEnd?.();
    return moved;
  }

  return { dragNodeId, dragging, dragMoved, start, applyPointerMove, endDrag };
}
