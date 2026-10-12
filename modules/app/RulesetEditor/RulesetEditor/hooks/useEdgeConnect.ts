'use client';
import { useState } from 'react';
import { connect } from '../../graph/edit';
import type { Graph } from '../../graph/types';
import type { Catalog } from '../../catalog/types';
import { layoutOf, outputAnchor } from '../geometry';

type Connecting = { nodeId: string; portId: string; x: number; y: number } | null;

export function useEdgeConnect({ getGraph, apply, catalog, readOnly, setMouse }: {
  getGraph: () => Graph;
  apply: (fn: (graph: Graph) => Graph, key?: string) => void;
  catalog: Catalog;
  readOnly: boolean;
  setMouse: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}) {
  const [connecting, setConnecting] = useState<Connecting>(null);

  function onOutputPortDown(e: React.PointerEvent, nodeId: string, portId: string) {
    e.stopPropagation();
    if (readOnly) return;
    const node = getGraph().nodes.find((n) => n.nodeId === nodeId);
    const anchor = node ? outputAnchor(node, layoutOf(node, catalog), portId) : null;
    if (!anchor) return;
    setConnecting({ nodeId, portId, x: anchor.x, y: anchor.y });
    setMouse({ x: anchor.x, y: anchor.y });
  }

  function connectTo(nodeId: string, portId?: string) {
    const from = connecting;
    setConnecting(null);
    if (!from || readOnly) return;
    const graph = getGraph();
    const target = graph.nodes.find((n) => n.nodeId === nodeId);
    if (!target) return;
    const toPort = portId ?? layoutOf(target, catalog).inputs[0]?.id;
    if (!toPort) return;
    // a refused connection (to itself, to a block without input, a duplicate) simply does nothing
    if (!connect(graph, catalog, from.nodeId, from.portId, nodeId, toPort)) return;
    apply((g) => connect(g, catalog, from.nodeId, from.portId, nodeId, toPort) ?? g, 'connect');
  }

  function onInputPortUp(e: React.PointerEvent, nodeId: string, portId: string) {
    e.stopPropagation();
    connectTo(nodeId, portId);
  }

  /** pointer released anywhere while wiring: a touch pointer stays captured by the
   *  element it started on, so look up the input port (or node) under it */
  function finishAt(clientX: number, clientY: number) {
    if (!connecting) return;
    const hit = document.elementFromPoint(clientX, clientY);
    const port = hit?.closest<HTMLElement | SVGElement>('[data-in-node]');
    const nodeEl = hit?.closest<HTMLElement>('[data-node-id]');
    if (port) connectTo(port.dataset.inNode!, port.dataset.inPort);
    else if (nodeEl) connectTo(nodeEl.dataset.nodeId!);
    else setConnecting(null);
  }

  function clearConnecting() { setConnecting(null); }

  return { connecting, onOutputPortDown, onInputPortUp, finishAt, clearConnecting };
}
