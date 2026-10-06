import { stable } from './history';
import { clone, newId } from './ids';
import type { ParamSpec } from '../catalog/types';
import { splitList } from '../forms/field-utils';
import { dropOutput, danglingPorts, subflowMap, usesOf } from './subflows';
import { SUBFLOW_PREFIX, type Graph, type GraphEdge, type GraphNode, type RuleGroup, type RuleSubflow } from './types';

/**
 * Everything undo and redo step over: the graph of the chain and the subflows. Selection, view and
 * the open panel are not part of it. While the inside of a subflow is edited (`scope`), the editor
 * works on that subflow's graph; the chain graph stays as it was.
 */
export type EditorState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  groups: RuleGroup[];
  subflows: RuleSubflow[];
};

/** `null`: the chain itself; otherwise the id of the subflow being edited */
export type Scope = string | null;

export function snapshotOf(state: EditorState): string {
  return stable(state);
}

export function stateOf(snapshot: string): EditorState {
  const raw = JSON.parse(snapshot) as Partial<EditorState>;
  return { nodes: raw.nodes ?? [], edges: raw.edges ?? [], groups: raw.groups ?? [], subflows: raw.subflows ?? [] };
}

/** The graph the editor is showing: the chain, or the inside of the subflow of the scope. */
export function currentGraph(state: EditorState, scope: Scope): Graph {
  if (scope === null) return { nodes: state.nodes, edges: state.edges, groups: state.groups };
  const sf = state.subflows.find((s) => s.subflowId === scope);
  return sf ? { nodes: sf.nodes, edges: sf.edges, groups: sf.groups } : { nodes: state.nodes, edges: state.edges, groups: state.groups };
}

/** Does the scope still exist? After undo a subflow made in this session may be gone. */
export function scopeExists(state: EditorState, scope: Scope): boolean {
  return scope === null || state.subflows.some((s) => s.subflowId === scope);
}

/** Replace the graph the editor is showing. */
export function withCurrentGraph(state: EditorState, scope: Scope, graph: Graph): EditorState {
  if (scope === null) return { ...state, nodes: graph.nodes, edges: graph.edges, groups: graph.groups };
  return {
    ...state,
    subflows: state.subflows.map((s) => (s.subflowId === scope ? { ...s, nodes: graph.nodes, edges: graph.edges, groups: graph.groups } : s)),
  };
}

/** Remove the connections that leave an output a subflow no longer has, in the chain and in every subflow. */
export function dropDanglingEdges(state: EditorState): EditorState {
  const subs = subflowMap(state.subflows);
  const strip = <T extends { nodes: GraphNode[]; edges: GraphEdge[] }>(item: T): T => {
    const bad = new Set(danglingPorts(item.edges, item.nodes, subs).map((e) => e.edgeId));
    return bad.size ? { ...item, edges: item.edges.filter((e) => !bad.has(e.edgeId)) } : item;
  };
  return { ...strip(state), subflows: state.subflows.map(strip) };
}

/** A new subflow: one input block wired to one output block named `out`. */
export function newSubflow(state: Pick<EditorState, 'subflows'>, chainIds: string[], name: string): RuleSubflow {
  const subflowId = newId([...chainIds, ...state.subflows.map((s) => s.subflowId)], name, 'subflow');
  return {
    subflowId,
    name: name.trim() || subflowId,
    description: '',
    inputs: 1,
    outputs: ['out'],
    params: {},
    nodes: [
      { nodeId: 'pin', type: 'port.in', label: 'Subflow input', config: {}, x: 60, y: 80 },
      { nodeId: 'pout1', type: 'port.out', label: 'Subflow output', config: { port: 'out' }, x: 400, y: 80 },
    ],
    edges: [{ edgeId: 'e1', sourceNodeId: 'pin', sourcePort: 'out', targetNodeId: 'pout1', targetPort: 'in' }],
    groups: [],
  };
}

export type SubflowParamDraft = { name: string; label: string; type: 'string' | 'number' | 'bool' | 'duration' | 'enum' | 'text'; options: string; default: string };

export const SUBFLOW_PARAM_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]{0,31}$/;

/** Problems in the settings of a subflow, by field; an empty object means they can be saved. */
export function subflowSettingsProblems(draft: { outputs: string[]; params: SubflowParamDraft[] }, portName: RegExp): { outputs?: string; params?: string } {
  const out: { outputs?: string; params?: string } = {};
  const seen = new Set<string>();
  for (const name of draft.outputs) {
    if (!portName.test(name) || name === 'error') { out.outputs = `"${name}" is not a valid output name. Use lower case letters, digits and _, starting with a letter; "error" is reserved.`; break; }
    if (seen.has(name)) { out.outputs = `The output "${name}" appears twice.`; break; }
    seen.add(name);
  }
  const names = new Set<string>();
  for (const p of draft.params) {
    if (!SUBFLOW_PARAM_NAME_RE.test(p.name)) { out.params = `"${p.name}" is not a valid param name. Use letters, digits and _, starting with a letter or _.`; break; }
    if (names.has(p.name)) { out.params = `The param "${p.name}" appears twice.`; break; }
    names.add(p.name);
  }
  return out;
}

const DRAFT_TYPES = ['string', 'number', 'bool', 'duration', 'enum', 'text'] as const;

/** The params of a subflow as rows of a settings form. */
export function paramsToDrafts(params: Record<string, ParamSpec>): SubflowParamDraft[] {
  return Object.entries(params).map(([name, spec]) => ({
    name,
    label: spec.label ?? '',
    type: (DRAFT_TYPES as readonly string[]).includes(spec.type) ? (spec.type as SubflowParamDraft['type']) : 'string',
    options: (spec.options ?? []).join(', '),
    default: spec.default === undefined || spec.default === null ? '' : String(spec.default),
  }));
}

/** Rows of a settings form back to a param schema. A default that does not fit its type is left out. */
export function draftsToParams(drafts: SubflowParamDraft[]): Record<string, ParamSpec> {
  const out: Record<string, ParamSpec> = {};
  for (const d of drafts) {
    const spec: ParamSpec = { type: d.type };
    if (d.label.trim()) spec.label = d.label.trim();
    if (d.type === 'enum') spec.options = splitList(d.options);
    const text = d.default.trim();
    if (d.type === 'number' || d.type === 'duration') {
      if (text !== '' && Number.isFinite(Number(text))) spec.default = Number(text);
    } else if (d.type === 'bool') {
      if (text === 'true' || text === 'false') spec.default = text === 'true';
    } else if (d.default !== '') {
      spec.default = d.default;
    }
    out[d.name] = spec;
  }
  return out;
}

/** What the settings of a subflow can change. An output with `orig` is the output of that name, renamed or not. */
export type SubflowSettings = {
  name: string;
  description: string;
  inputs: 0 | 1;
  outputs: { orig?: string; name: string }[];
  params: Record<string, ParamSpec>;
};

/**
 * Apply the settings of a subflow. A renamed output keeps its output blocks and the connections that leave
 * instances; a removed output takes its output blocks (and their connections) with it; without an input the
 * input block goes. Connections that leave an output a subflow no longer has are dropped everywhere.
 */
export function applySubflowSettings(state: EditorState, subflowId: string, settings: SubflowSettings): EditorState {
  const sf = state.subflows.find((s) => s.subflowId === subflowId);
  if (!sf) return state;
  const kept = new Set(settings.outputs.map((o) => o.orig).filter((n): n is string => !!n));
  let next: RuleSubflow = { ...sf, name: settings.name.trim() || sf.name, description: settings.description, inputs: settings.inputs, params: settings.params };
  for (const gone of sf.outputs.filter((n) => !kept.has(n))) next = dropOutput(next, gone).subflow;

  const renames = new Map(settings.outputs.filter((o) => o.orig && o.orig !== o.name).map((o) => [o.orig as string, o.name]));
  next = {
    ...next,
    outputs: settings.outputs.map((o) => o.name),
    nodes: next.nodes.map((n) => (n.type === 'port.out' && typeof n.config?.port === 'string' && renames.has(n.config.port) ? { ...n, config: { ...n.config, port: renames.get(n.config.port) } } : n)),
  };
  if (settings.inputs === 0) {
    const inputs = new Set(next.nodes.filter((n) => n.type === 'port.in').map((n) => n.nodeId));
    next = { ...next, nodes: next.nodes.filter((n) => !inputs.has(n.nodeId)), edges: next.edges.filter((e) => !inputs.has(e.sourceNodeId) && !inputs.has(e.targetNodeId)) };
  }

  const type = SUBFLOW_PREFIX + subflowId;
  const rename = <T extends { nodes: GraphNode[]; edges: GraphEdge[] }>(item: T): T => {
    if (!renames.size) return item;
    const instances = new Set(item.nodes.filter((n) => n.type === type).map((n) => n.nodeId));
    return { ...item, edges: item.edges.map((e) => (instances.has(e.sourceNodeId) && renames.has(e.sourcePort) ? { ...e, sourcePort: renames.get(e.sourcePort) as string } : e)) };
  };
  const swapped = { ...state, subflows: state.subflows.map((s) => (s.subflowId === subflowId ? next : s)) };
  return dropDanglingEdges({ ...rename(swapped), subflows: swapped.subflows.map(rename) });
}

/** Flows and subflows that hold an instance of a subflow: a subflow in use must not be deleted. */
export function subflowUsers(state: EditorState, subflowId: string): string[] {
  const users = state.subflows.filter((s) => s.subflowId !== subflowId && usesOf(s.nodes).has(subflowId)).map((s) => s.subflowId);
  return usesOf(state.nodes).has(subflowId) ? ['', ...users] : users;
}

/** Delete a subflow nobody uses; the state itself when it is in use or unknown. */
export function deleteSubflow(state: EditorState, subflowId: string): EditorState {
  if (subflowUsers(state, subflowId).length || !state.subflows.some((s) => s.subflowId === subflowId)) return state;
  return { ...state, subflows: state.subflows.filter((s) => s.subflowId !== subflowId) };
}

export { clone };
