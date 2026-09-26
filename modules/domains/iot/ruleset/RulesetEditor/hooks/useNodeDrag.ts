'use client';
import { useRef, useState } from 'react';
import type { RuleNode } from '../../../types';
import type { Point } from '../geometry';

export function useNodeDrag({ nodes, setNodes, toWorld, readOnly, connecting }: {
  nodes: RuleNode[];
  setNodes: React.Dispatch<React.SetStateAction<RuleNode[]>>;
  /** screen (client) coordinates → canvas world coordinates (pan + zoom aware) */
  toWorld: (clientX: number, clientY: number) => Point;
  readOnly: boolean;
  connecting: unknown;
}) {
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const dragOffset    = useRef({ x: 0, y: 0 });
  const dragMoved     = useRef(false);
  const dragStartPos  = useRef({ x: 0, y: 0 });

  function onNodePointerDown(e: React.PointerEvent, nodeId: string) {
    if (connecting || readOnly) return;
    e.stopPropagation();
    setDragNodeId(nodeId);
    dragMoved.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    const node = nodes.find((n) => n.nodeId === nodeId)!;
    const p = toWorld(e.clientX, e.clientY);
    dragOffset.current = { x: p.x - node.x, y: p.y - node.y };
  }

  function applyPointerMove(e: React.PointerEvent) {
    if (!dragNodeId) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved.current = true;
    if (!dragMoved.current) return;
    const p = toWorld(e.clientX, e.clientY);
    setNodes((prev) => prev.map((n) =>
      n.nodeId === dragNodeId
        ? { ...n, x: Math.round(p.x - dragOffset.current.x), y: Math.round(p.y - dragOffset.current.y) }
        : n
    ));
  }

  function endDrag() { setDragNodeId(null); }

  return { dragNodeId, dragMoved, onNodePointerDown, applyPointerMove, endDrag };
}
