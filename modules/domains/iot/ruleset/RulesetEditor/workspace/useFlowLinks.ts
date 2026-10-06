'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import type { RuleNode } from '../../../types';
import {
  createFlowCache, isLinkBlock, LINK_IN, linkHits, linkNames, noHitsMessage, type FlowCache, type FlowRef, type LinkFlow, type LinkHit,
} from '../../graph/links';
import type { RulesetGraph } from '../hooks/useGraphEditor';
import type { ContextMenuItem, NodeMenuContext } from '../index';

export type LinkList = { title: string; hits: LinkHit[] };

type Options = {
  /** the flow that is open (its blocks are read live from the editor) */
  here: FlowRef & { name: string };
  getGraph: () => RulesetGraph | undefined;
  /** ids of the other flows and subflows whose blocks are searched too */
  otherIds: string[];
  /** the host loads other flows; without it only the open flow is searched */
  loadFlows?: (ids: string[]) => Promise<LinkFlow[] | null | undefined>;
  /** show the block in the open flow */
  reveal: (nodeId: string) => void;
  /** go to a block of another flow (the host leaves the open one first) */
  jump: (hit: LinkHit) => void;
  notify: (text: string, tone?: 'info' | 'warning' | 'error') => void;
};

/** the block with this id in the chain, else in a subflow (the editor does not say which graph is shown) */
function findNode(graph: RulesetGraph, nodeId: string): RuleNode | undefined {
  return graph.nodes.find((n) => n.nodeId === nodeId) ?? graph.subflows.flatMap((s) => s.nodes).find((n) => n.nodeId === nodeId);
}

/**
 * Jumps through link blocks: a link out or link call goes to its link in, a link in lists its callers; in this flow
 * or in another one. The open flow is read live from the editor, the others come from `loadFlows` (kept 30 s).
 * One hit shows the block, several open a list, none says so.
 */
export function useFlowLinks({ here, getGraph, otherIds, loadFlows, reveal, jump, notify }: Options) {
  const loadRef = useRef(loadFlows);
  useEffect(() => { loadRef.current = loadFlows; });
  // the loader reads the latest `loadFlows` when called (never during render)
  // eslint-disable-next-line react-hooks/refs
  const [cache] = useState<FlowCache>(() => createFlowCache((ids) => (loadRef.current ? loadRef.current(ids) : Promise.resolve([]))));
  const latest = useRef({ here, otherIds, reveal, jump, notify, getGraph });
  useEffect(() => { latest.current = { here, otherIds, reveal, jump, notify, getGraph }; });
  const [list, setList] = useState<LinkList | null>(null);

  const flows = useCallback(async (): Promise<LinkFlow[]> => {
    const { here: h, otherIds: ids, getGraph: get } = latest.current;
    const cur: LinkFlow = { id: h.id ?? '', kind: h.kind, name: h.name, nodes: get()?.nodes ?? [] };
    const others = loadRef.current ? await cache.get(ids.filter((id) => id !== h.id)) : [];
    return [cur, ...others];
  }, [cache]);

  const jumpTo = useCallback((hit: LinkHit) => {
    const { here: h, reveal: show, jump: go } = latest.current;
    if (hit.flow === (h.id ?? '') && hit.kind === h.kind) show(hit.node);
    else go(hit);
  }, []);

  const go = useCallback(async (node: RuleNode, name?: string) => {
    const { here: h, notify: say } = latest.current;
    const hits = linkHits(await flows(), node, { id: h.id ?? '', kind: h.kind }, name);
    if (!hits.length) { say(noHitsMessage(node, name), 'warning'); return; }
    if (hits.length === 1) { jumpTo(hits[0]); return; }
    setList({ title: node.type === LINK_IN ? 'Blocks that call this link in' : 'Where this link goes', hits });
  }, [flows, jumpTo]);

  /** the entry of the block menu (pass it as `nodeMenuItems`) */
  const menuItems = useCallback(({ nodeIds }: NodeMenuContext): ContextMenuItem[] => {
    const graph = latest.current.getGraph();
    const node = nodeIds.length === 1 && graph ? findNode(graph, nodeIds[0]) : undefined;
    if (!node || !isLinkBlock(node) || !(linkNames(node).length || node.type === LINK_IN)) return [];
    return [
      { kind: 'item', label: node.type === LINK_IN ? 'Show the blocks that call it' : 'Go to the link in', icon: faLink, onSelect: () => { void go(node); } },
    ];
  }, [go]);

  return { menuItems, list, closeList: () => setList(null), pick: (hit: LinkHit) => { setList(null); jumpTo(hit); }, go };
}
