'use client';
import { useState } from 'react';
import { NODE_VISUALS } from '../node-meta';
import { NODE_W, outputPortY } from '../geometry';
import type { RuleNode, RuleEdge } from '../../../types';

type Connecting = { nodeId: string; portIdx: number; x: number; y: number } | null;

export function useEdgeConnect({ nodes, setEdges, edgeSeq, readOnly, setMouse }: {
  nodes: RuleNode[];
  setEdges: React.Dispatch<React.SetStateAction<RuleEdge[]>>;
  edgeSeq: React.RefObject<number>;
  readOnly: boolean;
  setMouse: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}) {
  const [connecting, setConnecting] = useState<Connecting>(null);

  function onOutputPortDown(e: React.MouseEvent, nodeId: string, portIdx: number) {
    e.stopPropagation();
    if (readOnly) return;
    const node = nodes.find((n) => n.nodeId === nodeId)!;
    setConnecting({ nodeId, portIdx, x: node.x + NODE_W, y: outputPortY(node, portIdx) });
    setMouse({ x: node.x + NODE_W, y: outputPortY(node, portIdx) });
  }

  function onInputPortUp(e: React.MouseEvent, nodeId: string, portIdx: number) {
    e.stopPropagation();
    if (!connecting || connecting.nodeId === nodeId || readOnly) { setConnecting(null); return; }
    const src = nodes.find((n) => n.nodeId === connecting.nodeId);
    const tgt = nodes.find((n) => n.nodeId === nodeId);
    if (!src || !tgt) { setConnecting(null); return; }
    const srcPort = NODE_VISUALS[src.type].outputs[connecting.portIdx]?.id;
    const tgtPort = NODE_VISUALS[tgt.type].inputs[portIdx]?.id;
    if (!srcPort || !tgtPort) { setConnecting(null); return; }
    edgeSeq.current++;
    const newEdge: RuleEdge = { edgeId: `e${edgeSeq.current}`, sourceNodeId: connecting.nodeId, sourcePort: srcPort, targetNodeId: nodeId, targetPort: tgtPort };
    setEdges((p) => p.some((ed) => ed.sourceNodeId === newEdge.sourceNodeId && ed.sourcePort === newEdge.sourcePort && ed.targetNodeId === newEdge.targetNodeId) ? p : [...p, newEdge]);
    setConnecting(null);
  }

  function clearConnecting() { setConnecting(null); }

  return { connecting, onOutputPortDown, onInputPortUp, clearConnecting };
}
