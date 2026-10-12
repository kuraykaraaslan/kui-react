import { describe, expect, it } from 'vitest';
import {
  applySubflowSettings, deleteSubflow, draftsToParams, newSubflow, paramsToDrafts, subflowUsers, type EditorState, type SubflowSettings,
} from './state';
import type { GraphEdge, GraphNode, RuleSubflow } from './types';

const node = (nodeId: string, type: string, config?: Record<string, unknown>): GraphNode => ({ nodeId, type, label: nodeId, x: 0, y: 0, ...(config ? { config } : {}) });
const edge = (edgeId: string, from: string, port: string, to: string): GraphEdge => ({ edgeId, sourceNodeId: from, sourcePort: port, targetNodeId: to, targetPort: 'in' });
const inner = newSubflow({ subflows: [] }, [], 'Inner');

describe('param drafts', () => {
  it('turns params into rows and back', () => {
    const params = {
      limit: { type: 'number' as const, label: 'Limit', default: 80 },
      mode: { type: 'enum' as const, options: ['a', 'b'], default: 'b' },
      on: { type: 'bool' as const, default: true },
      hold: { type: 'duration' as const, default: 5000 },
      note: { type: 'text' as const },
      name: { type: 'string' as const, default: 'x' },
    };
    const drafts = paramsToDrafts(params);
    expect(drafts.map((d) => [d.name, d.type, d.options, d.default, d.label])).toEqual([
      ['limit', 'number', '', '80', 'Limit'], ['mode', 'enum', 'a, b', 'b', ''], ['on', 'bool', '', 'true', ''],
      ['hold', 'duration', '', '5000', ''], ['note', 'text', '', '', ''], ['name', 'string', '', 'x', ''],
    ]);
    expect(draftsToParams(drafts)).toEqual(params);
  });
  it('reads a type the form does not offer as text', () => {
    expect(paramsToDrafts({ w: { type: 'weekdays' } })[0].type).toBe('string');
  });
  it('leaves out a default that does not fit its type, and trims labels', () => {
    const d = (type: 'number' | 'bool' | 'duration', text: string) => ({ name: 'p', label: ' L ', type, options: '', default: text });
    expect(draftsToParams([d('number', 'abc')]).p).toEqual({ type: 'number', label: 'L' });
    expect(draftsToParams([d('bool', 'maybe')]).p).toEqual({ type: 'bool', label: 'L' });
    expect(draftsToParams([d('duration', ' 250 ')]).p.default).toBe(250);
    expect(draftsToParams([d('number', '')]).p).not.toHaveProperty('default');
  });
});

describe('applySubflowSettings', () => {
  const multi: RuleSubflow = {
    ...inner, subflowId: 'multi', name: 'Multi', outputs: ['a', 'b'],
    nodes: [node('pin', 'port.in'), node('pa', 'port.out', { port: 'a' }), node('pb', 'port.out', { port: 'b' })],
    edges: [edge('s1', 'pin', 'out', 'pa'), edge('s2', 'pin', 'out', 'pb')],
  };
  const world: EditorState = {
    nodes: [node('i', 'subflow.multi'), node('t', 'action.log')],
    edges: [edge('e1', 'i', 'a', 't'), edge('e2', 'i', 'b', 't'), edge('e3', 'i', 'error', 't')],
    groups: [],
    subflows: [multi, { ...inner, subflowId: 'host', nodes: [node('x', 'subflow.multi'), node('y', 'action.log')], edges: [edge('h1', 'x', 'a', 'y'), edge('h2', 'x', 'b', 'y')] }],
  };
  const base: SubflowSettings = { name: 'Multi', description: '', inputs: 1, outputs: [{ orig: 'a', name: 'a' }, { orig: 'b', name: 'b' }], params: {} };

  it('changes name, description and params', () => {
    const out = applySubflowSettings(world, 'multi', { ...base, name: '  Renamed ', description: 'd', params: { k: { type: 'number' } } });
    expect(out.subflows[0]).toMatchObject({ name: 'Renamed', description: 'd', params: { k: { type: 'number' } } });
    expect(applySubflowSettings(world, 'multi', { ...base, name: '   ' }).subflows[0].name).toBe('Multi');
  });
  it('renames an output: output blocks and connections of instances follow, in the chain and in subflows', () => {
    const out = applySubflowSettings(world, 'multi', { ...base, outputs: [{ orig: 'a', name: 'alpha' }, { orig: 'b', name: 'b' }] });
    expect(out.subflows[0].outputs).toEqual(['alpha', 'b']);
    expect(out.subflows[0].nodes.filter((n) => n.type === 'port.out').map((n) => n.config?.port)).toEqual(['alpha', 'b']);
    expect(out.edges.map((e) => e.sourcePort)).toEqual(['alpha', 'b', 'error']);
    expect(out.subflows[1].edges.map((e) => e.sourcePort)).toEqual(['alpha', 'b']);
  });
  it('swaps two names without mixing them up', () => {
    const out = applySubflowSettings(world, 'multi', { ...base, outputs: [{ orig: 'a', name: 'b' }, { orig: 'b', name: 'a' }] });
    expect(out.subflows[0].nodes.filter((n) => n.type === 'port.out').map((n) => [n.nodeId, n.config?.port])).toEqual([['pa', 'b'], ['pb', 'a']]);
    expect(out.edges.map((e) => [e.edgeId, e.sourcePort])).toEqual([['e1', 'b'], ['e2', 'a'], ['e3', 'error']]);
  });
  it('removes an output with its blocks and the connections that left it', () => {
    const out = applySubflowSettings(world, 'multi', { ...base, outputs: [{ orig: 'b', name: 'b' }] });
    expect(out.subflows[0].outputs).toEqual(['b']);
    expect(out.subflows[0].nodes.map((n) => n.nodeId)).toEqual(['pin', 'pb']);
    expect(out.subflows[0].edges.map((e) => e.edgeId)).toEqual(['s2']);
    expect(out.edges.map((e) => e.edgeId)).toEqual(['e2', 'e3']);
    expect(out.subflows[1].edges.map((e) => e.edgeId)).toEqual(['h2']);
  });
  it('adds an output', () => {
    const out = applySubflowSettings(world, 'multi', { ...base, outputs: [...base.outputs, { name: 'c' }] });
    expect(out.subflows[0].outputs).toEqual(['a', 'b', 'c']);
    expect(out.edges).toHaveLength(3);
  });
  it('takes the input block away when the subflow no longer has an input', () => {
    const out = applySubflowSettings(world, 'multi', { ...base, inputs: 0 });
    expect(out.subflows[0].inputs).toBe(0);
    expect(out.subflows[0].nodes.map((n) => n.type)).toEqual(['port.out', 'port.out']);
    expect(out.subflows[0].edges).toEqual([]);
  });
  it('does nothing for an unknown subflow and does not change the state it was given', () => {
    expect(applySubflowSettings(world, 'nope', base)).toBe(world);
    const before = JSON.stringify(world);
    applySubflowSettings(world, 'multi', { ...base, outputs: [{ orig: 'b', name: 'z' }] });
    expect(JSON.stringify(world)).toBe(before);
  });
});

describe('deleting subflows', () => {
  const used: EditorState = {
    nodes: [node('i', 'subflow.inner')], edges: [], groups: [],
    subflows: [inner, { ...inner, subflowId: 'other', nodes: [node('x', 'subflow.inner')] }],
  };
  it('lists who uses a subflow: the chain as an empty id, then subflows', () => {
    expect(subflowUsers(used, 'inner')).toEqual(['', 'other']);
    expect(subflowUsers({ ...used, nodes: [] }, 'inner')).toEqual(['other']);
    expect(subflowUsers(used, 'other')).toEqual([]);
  });
  it('deletes a subflow nobody uses, and keeps one that is in use', () => {
    expect(deleteSubflow(used, 'other').subflows.map((s) => s.subflowId)).toEqual(['inner']);
    expect(deleteSubflow(used, 'inner')).toBe(used);
    expect(deleteSubflow(used, 'nope')).toBe(used);
  });
});
