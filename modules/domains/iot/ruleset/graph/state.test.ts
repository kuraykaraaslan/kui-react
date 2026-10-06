import { describe, expect, it } from 'vitest';
import {
  currentGraph, dropDanglingEdges, newSubflow, scopeExists, snapshotOf, stateOf, subflowSettingsProblems, withCurrentGraph,
  type EditorState,
} from './state';
import { PORT_RE } from './types';
import type { GraphEdge, GraphNode } from './types';
import { createHistory } from './history';

const node = (nodeId: string, type: string): GraphNode => ({ nodeId, type, label: nodeId, x: 0, y: 0 });
const edge = (edgeId: string, from: string, port: string, to: string): GraphEdge => ({ edgeId, sourceNodeId: from, sourcePort: port, targetNodeId: to, targetPort: 'in' });

const inner = newSubflow({ subflows: [] }, [], 'Inner');
const state: EditorState = {
  nodes: [node('a', 'trigger.boot'), node('i', 'subflow.inner'), node('t', 'action.log')],
  edges: [edge('e1', 'a', 'out', 'i'), edge('e2', 'i', 'out', 't'), edge('e3', 'i', 'gone', 't'), edge('e4', 'i', 'error', 't')],
  groups: [],
  subflows: [inner],
};

describe('snapshots', () => {
  it('equal state is an equal snapshot, whatever the key order', () => {
    expect(snapshotOf(state)).toBe(snapshotOf(stateOf(snapshotOf(state))));
    expect(snapshotOf({ ...state, groups: [] })).toBe(snapshotOf(state));
  });
  it('restores a state, with empty lists for what is missing', () => {
    expect(stateOf('{}')).toEqual({ nodes: [], edges: [], groups: [], subflows: [] });
    expect(stateOf(snapshotOf(state))).toEqual(state);
  });
  it('works with the history', () => {
    const h = createHistory();
    h.reset(snapshotOf(state));
    const next = { ...state, nodes: state.nodes.slice(1) };
    expect(h.push(snapshotOf(next), undefined, 0)).toBe(true);
    expect(h.push(snapshotOf({ ...next }), undefined, 9000)).toBe(false);
    expect(stateOf(h.undo() as string)).toEqual(state);
    expect(stateOf(h.redo() as string)).toEqual(next);
  });
});

describe('scope', () => {
  it('shows the chain, or the inside of a subflow', () => {
    expect(currentGraph(state, null).nodes.map((n) => n.nodeId)).toEqual(['a', 'i', 't']);
    expect(currentGraph(state, 'inner').nodes.map((n) => n.nodeId)).toEqual(['pin', 'pout1']);
    expect(currentGraph(state, 'missing').nodes).toHaveLength(3);
  });
  it('knows whether a scope exists', () => {
    expect(scopeExists(state, null)).toBe(true);
    expect(scopeExists(state, 'inner')).toBe(true);
    expect(scopeExists({ ...state, subflows: [] }, 'inner')).toBe(false);
  });
  it('writes the graph back where it came from', () => {
    const graph = { nodes: [node('x', 'cond.compare')], edges: [], groups: [] };
    expect(withCurrentGraph(state, null, graph).nodes.map((n) => n.nodeId)).toEqual(['x']);
    const sub = withCurrentGraph(state, 'inner', graph);
    expect(sub.subflows[0].nodes.map((n) => n.nodeId)).toEqual(['x']);
    expect(sub.nodes).toBe(state.nodes);
    expect(withCurrentGraph(state, 'missing', graph).subflows).toEqual(state.subflows);
  });
});

describe('dropDanglingEdges', () => {
  it('removes connections from outputs a subflow lost, keeps error and valid ones, in chain and subflows', () => {
    const next = dropDanglingEdges(state);
    expect(next.edges.map((e) => e.edgeId)).toEqual(['e1', 'e2', 'e4']);
    const nested: EditorState = {
      ...state,
      subflows: [inner, { ...inner, subflowId: 'outer', nodes: [node('x', 'subflow.inner'), node('y', 'action.log')], edges: [edge('s1', 'x', 'out', 'y'), edge('s2', 'x', 'bad', 'y')] }],
    };
    expect(dropDanglingEdges(nested).subflows[1].edges.map((e) => e.edgeId)).toEqual(['s1']);
  });
  it('returns the same lists when nothing dangles', () => {
    const clean = { ...state, edges: state.edges.filter((e) => e.edgeId !== 'e3') };
    expect(dropDanglingEdges(clean).edges).toBe(clean.edges);
  });
});

describe('newSubflow', () => {
  it('starts with an input wired to an output', () => {
    expect(inner).toMatchObject({ subflowId: 'inner', name: 'Inner', inputs: 1, outputs: ['out'], params: {}, groups: [] });
    expect(inner.nodes.map((n) => [n.nodeId, n.type, n.x, n.y])).toEqual([['pin', 'port.in', 60, 80], ['pout1', 'port.out', 400, 80]]);
    expect(inner.nodes[1].config).toEqual({ port: 'out' });
    expect(inner.edges).toHaveLength(1);
  });
  it('gets an id that no chain or subflow has', () => {
    expect(newSubflow({ subflows: [inner] }, ['inner-2'], 'Inner').subflowId).toBe('inner-3');
    expect(newSubflow({ subflows: [] }, [], '   ')).toMatchObject({ subflowId: 'subflow', name: 'subflow' });
  });
});

describe('subflowSettingsProblems', () => {
  const ok = { outputs: ['out', 'low'], params: [{ name: 'limit', label: '', type: 'number' as const, options: '', default: '80' }] };
  it('accepts good settings', () => {
    expect(subflowSettingsProblems(ok, PORT_RE)).toEqual({});
  });
  it('refuses bad, reserved and repeated output names', () => {
    expect(subflowSettingsProblems({ ...ok, outputs: ['Bad'] }, PORT_RE).outputs).toMatch(/not a valid output name/);
    expect(subflowSettingsProblems({ ...ok, outputs: ['error'] }, PORT_RE).outputs).toMatch(/reserved/);
    expect(subflowSettingsProblems({ ...ok, outputs: ['a', 'a'] }, PORT_RE).outputs).toMatch(/twice/);
  });
  it('refuses bad and repeated param names', () => {
    const p = (name: string) => ({ name, label: '', type: 'string' as const, options: '', default: '' });
    expect(subflowSettingsProblems({ ...ok, params: [p('1x')] }, PORT_RE).params).toMatch(/not a valid param name/);
    expect(subflowSettingsProblems({ ...ok, params: [p('a'), p('a')] }, PORT_RE).params).toMatch(/twice/);
    expect(subflowSettingsProblems({ ...ok, params: [p('_a1')] }, PORT_RE)).toEqual({});
  });
});
