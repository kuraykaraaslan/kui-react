import { visualOf } from '../catalog/fromBlocks';
import type { BlockDecl, Catalog } from '../catalog/types';
import { clone, newEdgeId, newNodeId } from './ids';
import {
  SUBFLOW_PREFIX, subflowIdOf, type Graph, type GraphEdge, type GraphNode, type RuleGroup, type RuleSubflow,
} from './types';

export type SubflowMap = Record<string, RuleSubflow>;

export const DEFAULT_SUBFLOW_DEPTH = 2;

export function subflowMap(list: RuleSubflow[]): SubflowMap {
  return Object.fromEntries(list.map((sf) => [sf.subflowId, sf]));
}

/** The block of a subflow: the declaration its instances (`subflow.<id>`) have. */
export function subflowBlock(sf: RuleSubflow): BlockDecl {
  const decl: BlockDecl = {
    type: SUBFLOW_PREFIX + sf.subflowId,
    title: sf.name || sf.subflowId,
    description: sf.description ?? '',
    category: 'subflow',
    group: 'subflow',
    inputs: sf.inputs === 0 ? 0 : 1,
    outputs: [...sf.outputs],
    params: sf.params,
    subflow: sf.subflowId,
  };
  return { ...decl, visual: visualOf(decl) };
}

/** The blocks of the ports of a subflow, available only while editing its inside. */
export function portBlocks(outputs: string[]): Record<string, BlockDecl> {
  const base = { category: 'port', group: 'port' } as const;
  const make = (decl: BlockDecl): BlockDecl => ({ ...decl, visual: visualOf(decl) });
  return {
    'port.in': make({ ...base, type: 'port.in', title: 'Subflow input', description: 'Messages that come into the subflow start here.', inputs: 0, outputs: ['out'] }),
    'port.out': make({
      ...base, type: 'port.out', title: 'Subflow output', description: 'Messages that reach this block leave the subflow at the output you choose.',
      inputs: 1, outputs: [], params: { port: { type: 'enum', label: 'Output', required: true, options: [...outputs] } },
    }),
    'port.status': make({ ...base, type: 'port.status', title: 'Subflow status', description: 'The text of the messages that reach this block becomes the status of the subflow block.', inputs: 1, outputs: [] }),
  };
}

/**
 * The catalog a graph is edited with: the base catalog plus a block per subflow. While editing the
 * inside of a subflow (`inside`), that subflow is left out (it cannot hold itself) and the port blocks are added.
 */
export function catalogWithSubflows(catalog: Catalog, subflows: RuleSubflow[], inside?: { subflowId: string; outputs: string[] }): Catalog {
  const blocks: Record<string, BlockDecl> = {};
  for (const [type, decl] of Object.entries(catalog.blocks)) if (!subflowIdOf(type)) blocks[type] = decl;
  for (const sf of subflows) if (sf.subflowId !== inside?.subflowId) blocks[SUBFLOW_PREFIX + sf.subflowId] = subflowBlock(sf);
  if (inside) Object.assign(blocks, portBlocks(inside.outputs));
  const extra = [
    ...(subflows.length ? [{ id: 'subflow', label: 'Subflows' }] : []),
    ...(inside ? [{ id: 'port', label: 'Subflow ports' }] : []),
  ].filter((g) => !catalog.groups.some((known) => known.id === g.id));
  return { ...catalog, blocks, groups: [...catalog.groups, ...extra] };
}

/** The subflows a list of nodes uses directly. */
export function usesOf(nodes: Pick<GraphNode, 'type'>[] | undefined): Set<string> {
  const out = new Set<string>();
  for (const node of nodes ?? []) {
    const id = subflowIdOf(node.type ?? '');
    if (id) out.add(id);
  }
  return out;
}

/** Nesting depth of a subflow: 1 when it holds no subflow, Infinity when it holds itself (even through others). */
export function depthOf(subs: SubflowMap, id: string, stack: string[] = []): number {
  if (stack.includes(id)) return Infinity;
  const sf = subs[id];
  if (!sf) return 1;
  let deepest = 0;
  for (const child of usesOf(sf.nodes)) deepest = Math.max(deepest, depthOf(subs, child, [...stack, id]));
  return 1 + deepest;
}

/** May an instance of `target` be put into the subflow `host`? `cycle`, `depth` or null. */
export function nestProblem(subs: SubflowMap, host: string, target: string, limit = DEFAULT_SUBFLOW_DEPTH): 'cycle' | 'depth' | null {
  if (host === target) return 'cycle';
  const hostSf = subs[host] ?? ({ subflowId: host, nodes: [] } as unknown as RuleSubflow);
  const probe = { type: SUBFLOW_PREFIX + target } as GraphNode;
  const next: SubflowMap = { ...subs, [host]: { ...hostSf, nodes: [...(hostSf.nodes ?? []), probe] } };
  // the host and every subflow that holds it, however deep
  let worst = 0;
  for (const id of Object.keys(next)) worst = Math.max(worst, depthOf(next, id));
  if (worst === Infinity) return 'cycle';
  return worst > limit ? 'depth' : null;
}

/** Why an instance of a subflow cannot go into a flow (not a subflow itself): only the depth can be too much. */
export function placementProblem(subs: SubflowMap, target: string, limit = DEFAULT_SUBFLOW_DEPTH): 'depth' | null {
  return depthOf(subs, target) > limit ? 'depth' : null;
}

/** Ids of the items (flows or subflows) that hold an instance of the subflow. */
export function usedBy(items: { id: string; nodes?: Pick<GraphNode, 'type'>[] }[], subflowId: string): string[] {
  return items.filter((item) => usesOf(item.nodes).has(subflowId)).map((item) => item.id);
}

export type SelectionWarning = { code: 'merged_inputs'; count: number };

export type FromSelection = {
  subflow: RuleSubflow;
  /** the outer graph, with one instance node in place of the selection */
  nodes: GraphNode[];
  edges: GraphEdge[];
  groups: RuleGroup[];
  /** node id of the instance */
  instance: string;
  warnings: SelectionWarning[];
};

const KEY_SEP = '\u0000';

/**
 * Convert the selected nodes into a subflow:
 * - connections from outside into the selection become the one input (`port.in`);
 * - every distinct (node, port) leaving the selection becomes an output (`port.out`);
 * - one instance node takes the place of the selection and the connections follow;
 * - groups wholly inside the selection go with it, other groups lose those members.
 * Returns null when no selected node exists.
 */
export function fromSelection(
  graph: Graph,
  ids: string[],
  options: { subflowId: string; name: string; nodeId?: string; nodeWidth?: number },
): FromSelection | null {
  const selected = new Set(ids);
  const inner = graph.nodes.filter((n) => selected.has(n.nodeId));
  if (!inner.length) return null;
  const width = options.nodeWidth ?? 184;
  const edgesIn: GraphEdge[] = [];
  const edgesOut: GraphEdge[] = [];
  const edgesInside: GraphEdge[] = [];
  const rest: GraphEdge[] = [];
  for (const edge of graph.edges) {
    const from = selected.has(edge.sourceNodeId);
    const to = selected.has(edge.targetNodeId);
    if (from && to) edgesInside.push(edge);
    else if (to) edgesIn.push(edge);
    else if (from) edgesOut.push(edge);
    else rest.push(edge);
  }

  // one output per distinct (node, port) that leaves the selection
  const sources: string[] = [];
  for (const e of edgesOut) {
    const key = e.sourceNodeId + KEY_SEP + e.sourcePort;
    if (!sources.includes(key)) sources.push(key);
  }
  const names = sources.map((_, i) => (sources.length === 1 ? 'out' : 'out' + (i + 1)));
  const outName = new Map(sources.map((key, i) => [key, names[i]]));

  const minX = Math.min(...inner.map((n) => n.x));
  const minY = Math.min(...inner.map((n) => n.y));
  const maxX = Math.max(...inner.map((n) => n.x));
  const dx = 200 - minX;
  const dy = 60 - minY;
  const taken = new Set(inner.map((n) => n.nodeId));
  const freeId = (base: string) => {
    let id = base;
    for (let i = 2; taken.has(id); i++) id = base + i;
    taken.add(id);
    return id;
  };
  const warnings: SelectionWarning[] = [];
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const link = (from: string, fromPort: string, to: string) =>
    edges.push({ edgeId: newEdgeId(edges), sourceNodeId: from, sourcePort: fromPort, targetNodeId: to, targetPort: 'in' });

  const hasInput = edgesIn.length > 0;
  if (hasInput) {
    const targets = [...new Set(edgesIn.map((e) => e.targetNodeId))];
    const feeders = new Set(edgesIn.map((e) => e.sourceNodeId + KEY_SEP + e.sourcePort));
    if (feeders.size > 1) warnings.push({ code: 'merged_inputs', count: feeders.size });
    const pinId = freeId('pin');
    const first = inner.find((n) => n.nodeId === targets[0]);
    nodes.push({ nodeId: pinId, type: 'port.in', label: 'Subflow input', config: {}, x: 40, y: (first?.y ?? 0) + dy });
    for (const target of targets) link(pinId, 'out', target);
  }
  for (const n of inner) nodes.push({ ...clone(n), x: n.x + dx, y: n.y + dy });
  edges.push(...edgesInside.map((e) => clone(e)));
  sources.forEach((key, i) => {
    const [from, port] = key.split(KEY_SEP);
    const source = inner.find((n) => n.nodeId === from);
    const poutId = freeId('pout' + (i + 1));
    nodes.push({ nodeId: poutId, type: 'port.out', label: 'Subflow output', config: { port: names[i] }, x: maxX + dx + width + 80, y: (source?.y ?? 0) + dy });
    link(from, port, poutId);
  });

  const subflow: RuleSubflow = {
    subflowId: options.subflowId, name: options.name, description: '', inputs: hasInput ? 1 : 0,
    outputs: names, params: {}, nodes, edges, groups: [],
  };

  const instanceId = options.nodeId ?? newNodeId(graph.nodes);
  const instance: GraphNode = {
    nodeId: instanceId, type: SUBFLOW_PREFIX + options.subflowId, label: options.name, config: {},
    x: Math.round(inner.reduce((sum, n) => sum + n.x, 0) / inner.length),
    y: Math.round(inner.reduce((sum, n) => sum + n.y, 0) / inner.length),
  };
  const outerNodes = [...graph.nodes.filter((n) => !selected.has(n.nodeId)), instance];
  const outerEdges: GraphEdge[] = rest.map((e) => clone(e));
  const seen = new Set<string>();
  const outerLink = (from: string, fromPort: string, to: string) =>
    outerEdges.push({ edgeId: newEdgeId(outerEdges), sourceNodeId: from, sourcePort: fromPort, targetNodeId: to, targetPort: 'in' });
  for (const e of edgesIn) {
    const key = e.sourceNodeId + KEY_SEP + e.sourcePort;
    if (seen.has(key)) continue;
    seen.add(key);
    outerLink(e.sourceNodeId, e.sourcePort, instanceId);
  }
  for (const e of edgesOut) {
    const name = outName.get(e.sourceNodeId + KEY_SEP + e.sourcePort) as string;
    const key = 'out' + KEY_SEP + name + KEY_SEP + e.targetNodeId;
    if (seen.has(key)) continue;
    seen.add(key);
    outerLink(instanceId, name, e.targetNodeId);
  }

  const outerGroups: RuleGroup[] = [];
  for (const group of graph.groups) {
    if (group.nodeIds.length > 0 && group.nodeIds.every((id) => selected.has(id))) {
      subflow.groups.push(clone(group));
      continue;
    }
    const keep = group.nodeIds.filter((id) => !selected.has(id));
    if (keep.length) outerGroups.push({ ...clone(group), nodeIds: keep });
  }
  return { subflow, nodes: outerNodes, edges: outerEdges, groups: outerGroups, instance: instanceId, warnings };
}

/** A subflow output removed: the `port.out` nodes that sent to it go with their connections. */
export function dropOutput(sf: RuleSubflow, name: string): { subflow: RuleSubflow; removed: number } {
  const gone = new Set(sf.nodes.filter((n) => n.type === 'port.out' && n.config?.port === name).map((n) => n.nodeId));
  return {
    subflow: {
      ...sf,
      outputs: sf.outputs.filter((p) => p !== name),
      nodes: sf.nodes.filter((n) => !gone.has(n.nodeId)),
      edges: sf.edges.filter((e) => !gone.has(e.sourceNodeId) && !gone.has(e.targetNodeId)),
    },
    removed: gone.size,
  };
}

/** A port name for a new output of the subflow: out, out2, out3 … */
export function nextOutput(sf: Pick<RuleSubflow, 'outputs'>): string {
  const have = new Set(sf.outputs);
  if (!have.has('out')) return 'out';
  for (let i = 2; ; i++) if (!have.has('out' + i)) return 'out' + i;
}

/** Connections of subflow instances that leave an output the definition no longer has. */
export function danglingPorts(edges: GraphEdge[], nodes: Pick<GraphNode, 'nodeId' | 'type'>[], subs: SubflowMap): GraphEdge[] {
  return edges.filter((edge) => {
    const id = subflowIdOf(nodes.find((n) => n.nodeId === edge.sourceNodeId)?.type ?? '');
    const sf = id ? subs[id] : undefined;
    return !!sf && edge.sourcePort !== 'error' && !sf.outputs.includes(edge.sourcePort);
  });
}
