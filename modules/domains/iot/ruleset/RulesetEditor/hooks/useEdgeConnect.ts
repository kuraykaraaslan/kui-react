'use client';
import { useState } from 'react';
import { nodePorts } from '../node-meta';
import { NODE_W, outputPortY } from '../geometry';
import type { RuleNode, RuleEdge } from '../../../types';

type Connecting = { nodeId: string; portIdx: number; x: number; y: number } | null;

export function useEdgeConnect({ nodes, setEdges, edgeSeq: edgeSeqRef, readOnly, setMouse }: {
  nodes: RuleNode[];
  setEdges: React.Dispatch<React.SetStateAction<RuleEdge[]>>;
  edgeSeq: React.RefObject<number>;
  readOnly: boolean;
  setMouse: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}) {
  const [connecting, setConnecting] = useState<Connecting>(null);

  function onOutputPortDown(e: React.PointerEvent, nodeId: string, portIdx: number) {
    e.stopPropagation();
    if (readOnly) return;
    const node = nodes.find((n) => n.nodeId === nodeId)!;
    setConnecting({ nodeId, portIdx, x: node.x + NODE_W, y: outputPortY(node, portIdx) });
    setMouse({ x: node.x + NODE_W, y: outputPortY(node, portIdx) });
  }

  function connectTo(nodeId: string, portIdx: number) {
    if (!connecting || connecting.nodeId === nodeId || readOnly) { setConnecting(null); return; }
    const src = nodes.find((n) => n.nodeId === connecting.nodeId);
    const tgt = nodes.find((n) => n.nodeId === nodeId);
    if (!src || !tgt) { setConnecting(null); return; }
    const srcPort = nodePorts(src).outputs[connecting.portIdx]?.id;
    const tgtPort = nodePorts(tgt).inputs[portIdx]?.id;
    if (!srcPort || !tgtPort) { setConnecting(null); return; }
    edgeSeqRef.current++;
    const newEdge: RuleEdge = { edgeId: `e${edgeSeqRef.current}`, sourceNodeId: connecting.nodeId, sourcePort: srcPort, targetNodeId: nodeId, targetPort: tgtPort };
    setEdges((p) => p.some((ed) => ed.sourceNodeId === newEdge.sourceNodeId && ed.sourcePort === newEdge.sourcePort && ed.targetNodeId === newEdge.targetNodeId) ? p : [...p, newEdge]);
    setConnecting(null);
  }

  function onInputPortUp(e: React.PointerEvent, nodeId: string, portIdx: number) {
    e.stopPropagation();
    connectTo(nodeId, portIdx);
  }

  /** pointer released anywhere while wiring: a touch pointer stays captured by the
   *  element it started on, so look up the input port (or node) under it */
  function finishAt(clientX: number, clientY: number) {
    if (!connecting) return;
    const hit = document.elementFromPoint(clientX, clientY);
    const port = hit?.closest<HTMLElement | SVGElement>('[data-in-node]');
    const nodeEl = hit?.closest<HTMLElement>('[data-node-id]');
    if (port) connectTo(port.dataset.inNode!, Number(port.dataset.inIdx ?? 0));
    else if (nodeEl) connectTo(nodeEl.dataset.nodeId!, 0);
    else setConnecting(null);
  }

  function clearConnecting() { setConnecting(null); }

  return { connecting, onOutputPortDown, onInputPortUp, finishAt, clearConnecting };
}
