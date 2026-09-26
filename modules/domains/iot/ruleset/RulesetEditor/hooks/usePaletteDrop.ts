'use client';
import { useState } from 'react';
import { NODE_VISUALS } from '../node-meta';
import { NODE_W, NODE_HEADER_H, type Point } from '../geometry';
import { DEFAULT_SCRIPTS } from '../default-scripts';
import type { RuleNode, RuleNodeType } from '../../../types';

export function usePaletteDrop({ setNodes, nodeSeq: nodeSeqRef, toWorld }: {
  setNodes: React.Dispatch<React.SetStateAction<RuleNode[]>>;
  nodeSeq: React.RefObject<number>;
  /** screen (client) coordinates → canvas world coordinates (pan + zoom aware) */
  toWorld: (clientX: number, clientY: number) => Point;
}) {
  const [paletteDrag, setPaletteDrag] = useState<RuleNodeType | null>(null);

  function onPaletteDragStart(type: RuleNodeType) { setPaletteDrag(type); }
  function onPaletteDragEnd() { setPaletteDrag(null); }

  /** add a node centred on a world point; returns its id */
  function addAt(type: RuleNodeType, pt: Point) {
    nodeSeqRef.current++;
    const nodeId = `n${nodeSeqRef.current}`;
    setNodes((p) => [...p, {
      nodeId, type,
      label: NODE_VISUALS[type].displayLabel,
      x: Math.round(pt.x - NODE_W / 2), y: Math.round(pt.y - NODE_HEADER_H / 2),
      script: DEFAULT_SCRIPTS[type],
    }]);
    return nodeId;
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (!paletteDrag) return;
    addAt(paletteDrag, toWorld(e.clientX, e.clientY));
    setPaletteDrag(null);
  }

  return { paletteDrag, onPaletteDragStart, onPaletteDragEnd, onDrop, addAt };
}
