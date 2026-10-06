import { missingRequired, paramLabel } from '../catalog/params';
import { nodePortsOf } from '../catalog/ports';
import type { Catalog } from '../catalog/types';
import { PORT_RE, subflowIdOf, type Graph, type GraphEdge, type GraphNode } from './types';

export type IssueCode =
  | 'unsupported' | 'unknown' | 'required' | 'port' | 'cycle' | 'depth' | 'edge' | 'edge_port'
  | 'no_input' | 'one_input' | 'missing_in' | 'port_in' | 'out_name' | 'unconnected' | 'no_feed';

export type GraphIssue = {
  code: IssueCode;
  severity: 'error' | 'warning';
  nodeId?: string;
  /** the param a `required` or `port` issue is about */
  param?: string;
  /** a value the message mentions (the unknown type, the missing port, the subflow id) */
  arg?: string;
  message: string;
};

export type ValidateContext = {
  /** the chain is switched on: a missing required param is an error, otherwise only a warning */
  active?: boolean;
  /** set when the graph is the inside of a subflow */
  subflow?: { inputs: 0 | 1; outputs: string[] };
  /** why using this subflow here is not allowed (`cycle`, `depth`), or null */
  nest?: (subflowId: string) => 'cycle' | 'depth' | null;
};

export type ValidationResult = { errors: GraphIssue[]; warnings: GraphIssue[] };

const UNSUPPORTED = new Set(['PLACEHOLDER', 'unsupported']);

/** Plain-language text of an issue; the editor shows it next to the node. */
export function issueMessage(code: IssueCode, arg?: string, param?: string): string {
  switch (code) {
    case 'unsupported': return 'This block is not available here. It keeps its connections but cannot run.';
    case 'unknown': return `Unknown block type ${arg ?? ''}.`.replace(' .', '.');
    case 'required': return `${param ?? 'A parameter'} is required.`;
    case 'port': return 'The output this block sends to does not exist in the subflow.';
    case 'cycle': return 'A subflow cannot hold itself, not even through another subflow.';
    case 'depth': return 'Subflows are nested too deep.';
    case 'edge': return 'A connection points to a block that does not exist.';
    case 'edge_port': return `The connection leaves ${arg ?? 'a port'}, which this block does not have.`;
    case 'no_input': return 'A connection arrives at a block that has no input.';
    case 'one_input': return 'A subflow can have only one input block.';
    case 'missing_in': return 'The subflow has an input but no input block.';
    case 'port_in': return 'The subflow has no input, so it cannot contain an input block.';
    case 'out_name': return `Invalid output name ${arg ?? ''}. Use lower case letters, digits and _, and not "error".`.replace(' .', '.');
    case 'unconnected': return 'This block is not connected to anything.';
    case 'no_feed': return 'Nothing is connected to this block.';
  }
}

/**
 * Checks a graph against a catalog: unknown or unsupported types, required params that are shown
 * and empty, connections that use ports a block does not have, blocks nothing reaches. Inside a
 * subflow it also checks the input and output blocks. A port-less comment block is skipped.
 */
export function validateGraph<N extends GraphNode, E extends GraphEdge>(
  graph: Pick<Graph<N, E>, 'nodes' | 'edges'>,
  catalog: Catalog,
  ctx: ValidateContext = {},
): ValidationResult {
  const errors: GraphIssue[] = [];
  const warnings: GraphIssue[] = [];
  const add = (list: GraphIssue[], code: IssueCode, extra: { nodeId?: string; param?: string; arg?: string; label?: string } = {}) => {
    const { label, ...rest } = extra;
    list.push({ code, severity: list === errors ? 'error' : 'warning', ...rest, message: issueMessage(code, rest.arg, label ?? rest.param) });
  };
  const soft = ctx.active ? errors : warnings;
  const byId = new Map(graph.nodes.map((n) => [n.nodeId, n]));
  const sub = ctx.subflow;
  let inputBlocks = 0;

  for (const node of graph.nodes) {
    if (UNSUPPORTED.has(node.type)) { add(errors, 'unsupported', { nodeId: node.nodeId }); continue; }
    if (node.type === 'port.in') inputBlocks++;
    const decl = catalog.blocks[node.type];
    if (!decl) { add(errors, 'unknown', { nodeId: node.nodeId, arg: node.type }); continue; }
    const values: Record<string, unknown> = { ...node.config };
    // a param stored in node.script counts as filled when the script has text
    for (const [key, spec] of Object.entries(decl.params ?? {})) if (spec.store === 'script') values[key] = node.script;
    for (const param of missingRequired(decl, values)) add(soft, 'required', { nodeId: node.nodeId, param, label: paramLabel(param, decl.params?.[param] ?? {}) });
    if (node.type === 'port.out' && sub && !sub.outputs.includes(String(node.config?.port))) add(errors, 'port', { nodeId: node.nodeId, param: 'port' });
    const subId = subflowIdOf(node.type);
    const problem = subId && ctx.nest ? ctx.nest(subId) : null;
    if (problem) add(errors, problem, { nodeId: node.nodeId, arg: subId ?? undefined });
  }

  const incoming = new Set<string>();
  const touched = new Set<string>();
  for (const edge of graph.edges) {
    const from = byId.get(edge.sourceNodeId);
    const to = byId.get(edge.targetNodeId);
    if (!from || !to) { add(errors, 'edge', { nodeId: from ? edge.sourceNodeId : edge.targetNodeId }); continue; }
    const outs = nodePortsOf(catalog, from).outputs;
    if (edge.sourcePort !== 'error' && !outs.some((p) => p.id === edge.sourcePort)) {
      add(errors, 'edge_port', { nodeId: from.nodeId, arg: edge.sourcePort });
      continue;
    }
    if (nodePortsOf(catalog, to).inputs.length < 1) { add(errors, 'no_input', { nodeId: to.nodeId }); continue; }
    incoming.add(to.nodeId);
    touched.add(from.nodeId);
    touched.add(to.nodeId);
  }

  if (sub) {
    if (inputBlocks > 1) add(errors, 'one_input');
    if (sub.inputs === 1 && !inputBlocks) add(warnings, 'missing_in');
    if (sub.inputs === 0 && inputBlocks) add(errors, 'port_in', { nodeId: graph.nodes.find((n) => n.type === 'port.in')?.nodeId });
    for (const name of sub.outputs) if (!PORT_RE.test(name) || name === 'error') add(errors, 'out_name', { arg: name });
  }

  for (const node of graph.nodes) {
    const decl = catalog.blocks[node.type];
    if (!decl || node.type === 'note.comment') continue;
    if (!touched.has(node.nodeId) && node.type !== 'port.in') add(warnings, 'unconnected', { nodeId: node.nodeId });
    else if (decl.inputs !== 0 && !incoming.has(node.nodeId) && nodePortsOf(catalog, node).inputs.length > 0) add(warnings, 'no_feed', { nodeId: node.nodeId });
  }
  return { errors, warnings };
}

/** Issues by node id, for the badges on the canvas. Errors come before warnings. */
export function issuesByNode(result: ValidationResult): Map<string, GraphIssue[]> {
  const map = new Map<string, GraphIssue[]>();
  for (const issue of [...result.errors, ...result.warnings]) {
    if (!issue.nodeId) continue;
    map.set(issue.nodeId, [...(map.get(issue.nodeId) ?? []), issue]);
  }
  return map;
}
