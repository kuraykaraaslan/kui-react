'use client';
import { useRef, useState } from 'react';
import type { RuleNode } from '../../../types';

export function useNodeDrag({ nodes, setNodes, containerRef, readOnly, connecting }: {
  nodes: RuleNode[];
  setNodes: React.Dispatch<React.SetStateAction<RuleNode[]>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  readOnly: boolean;
  connecting: unknown;
}) {
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const dragOffset    = useRef({ x: 0, y: 0 });
  const dragMoved     = useRef(false);
  const dragStartPos  = useRef({ x: 0, y: 0 });

  function onNodeMouseDown(e: React.MouseEvent, nodeId: string) {
    if (connecting || readOnly) return;
    e.stopPropagation();
    setDragNodeId(nodeId);
    dragMoved.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    const node = nodes.find((n) => n.nodeId === nodeId)!;
    const r = containerRef.current!.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - r.left - node.x, y: e.clientY - r.top - node.y };
  }

  function applyMouseMove(e: React.MouseEvent) {
    if (!dragNodeId) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved.current = true;
    const r = containerRef.current!.getBoundingClientRect();
    setNodes((p) => p.map((n) =>
      n.nodeId === dragNodeId
        ? { ...n, x: e.clientX - r.left - dragOffset.current.x, y: e.clientY - r.top - dragOffset.current.y }
        : n
    ));
  }

  function endDrag() { setDragNodeId(null); }

  return { dragNodeId, dragMoved, onNodeMouseDown, applyMouseMove, endDrag };
}
