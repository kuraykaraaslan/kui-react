'use client';
import { useState } from 'react';
import { NODE_VISUALS } from '../node-meta';
import { NODE_W, NODE_HEADER_H } from '../geometry';
import { DEFAULT_SCRIPTS } from '../default-scripts';
import type { RuleNode, RuleNodeType } from '../../../types';

export function usePaletteDrop({ setNodes, nodeSeq, containerRef }: {
  setNodes: React.Dispatch<React.SetStateAction<RuleNode[]>>;
  nodeSeq: React.RefObject<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [paletteDrag, setPaletteDrag] = useState<RuleNodeType | null>(null);

  function onPaletteDragStart(type: RuleNodeType) { setPaletteDrag(type); }
  function onPaletteDragEnd() { setPaletteDrag(null); }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (!paletteDrag) return;
    const r = containerRef.current?.getBoundingClientRect();
    const pt = r ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: 0, y: 0 };
    nodeSeq.current++;
    setNodes((p) => [...p, {
      nodeId: `n${nodeSeq.current}`, type: paletteDrag,
      label: NODE_VISUALS[paletteDrag].displayLabel,
      x: Math.round(pt.x - NODE_W / 2), y: Math.round(pt.y - NODE_HEADER_H / 2),
      script: DEFAULT_SCRIPTS[paletteDrag],
    }]);
    setPaletteDrag(null);
  }

  return { paletteDrag, onPaletteDragStart, onPaletteDragEnd, onDrop };
}
