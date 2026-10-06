import { describe, expect, it } from 'vitest';
import { catalogFromBlocks } from '../catalog';
import { resolvePorts } from '../catalog/ports';
import {
  catalogWithSubflows, danglingPorts, depthOf, dropOutput, fromSelection, nestProblem, nextOutput, placementProblem,
  portBlocks, subflowBlock, subflowMap, usedBy, usesOf,
} from './subflows';
import { validateGraph } from './validate';
import { subflowIdOf, type GraphEdge, type GraphNode, type RuleGroup, type RuleSubflow } from './types';

const node = (nodeId: string, type: string, x = 0, y = 0, config?: Record<string, unknown>): GraphNode => ({ nodeId, type, label: nodeId, x, y, config });
const edge = (id: string, from: string, port: string, to: string): GraphEdge => ({ edgeId: id, sourceNodeId: from, sourcePort: port, targetNodeId: to, targetPort: 'in' });
const sub = (subflowId: string, nodes: GraphNode[] = [], outputs = ['out']): RuleSubflow => ({ subflowId, name: subflowId, inputs: 1, outputs, params: {}, nodes, edges: [], groups: [] });

describe('subflowIdOf', () => {
  it('reads the id of an instance type', () => {
    expect(subflowIdOf('subflow.sf-esik')).toBe('sf-esik');
    expect(subflowIdOf('subflow.Bad')).toBeNull();
    expect(subflowIdOf('trigger.boot')).toBeNull();
  });
});

describe('subflow blocks', () => {
  const sf: RuleSubflow = { ...sub('sf-limit', [], ['high', 'low']), name: 'Threshold', params: { limit: { type: 'number', default: 80 } } };
  it('declares the block instances have', () => {
    const decl = subflowBlock(sf);
    expect(decl).toMatchObject({ type: 'subflow.sf-limit', title: 'Threshold', category: 'subflow', inputs: 1, outputs: ['high', 'low'], subflow: 'sf-limit' });
    expect(decl.params).toEqual(sf.params);
    expect(decl.visual?.headerBg).toBe('bg-secondary-subtle');
  });
  it('gives a subflow without an input no input port', () => {
    expect(subflowBlock({ ...sf, inputs: 0 }).inputs).toBe(0);
  });
  it('builds the port blocks with the outputs of the subflow', () => {
    const ports = portBlocks(['high', 'low']);
    expect(ports['port.in']).toMatchObject({ inputs: 0, outputs: ['out'] });
    expect(ports['port.out'].params?.port).toMatchObject({ type: 'enum', required: true, options: ['high', 'low'] });
    expect(ports['port.status'].inputs).toBe(1);
  });
  it('adds subflows to a catalog, and the ports plus without itself when editing inside', () => {
    const base = catalogFromBlocks([[{ type: 'trigger.boot' }]]);
    const outer = catalogWithSubflows(base, [sf, sub('other')]);
    expect(Object.keys(outer.blocks).sort()).toEqual(['subflow.other', 'subflow.sf-limit', 'trigger.boot']);
    expect(outer.groups.map((x) => x.id)).toContain('subflow');
    expect(resolvePorts(outer, 'subflow.sf-limit').outputs.map((p) => p.id)).toEqual(['high', 'low', 'error']);
    const inner = catalogWithSubflows(outer, [sf, sub('other')], { subflowId: 'sf-limit', outputs: ['high', 'low'] });
    expect(Object.keys(inner.blocks).sort()).toEqual(['port.in', 'port.out', 'port.status', 'subflow.other', 'trigger.boot']);
    expect(inner.groups.filter((x) => x.id === 'port')).toHaveLength(1);
    expect(inner.groups.filter((x) => x.id === 'subflow')).toHaveLength(1);
  });
  it('does not change the catalog it was given', () => {
    const base = catalogFromBlocks([[{ type: 'trigger.boot' }]]);
    catalogWithSubflows(base, [sf]);
    expect(Object.keys(base.blocks)).toEqual(['trigger.boot']);
  });
  it('maps subflows by id', () => {
    expect(Object.keys(subflowMap([sub('a'), sub('b')]))).toEqual(['a', 'b']);
  });
});

describe('nesting', () => {
  const subs = subflowMap([sub('a', [node('x', 'subflow.b')]), sub('b', [node('y', 'subflow.c')]), sub('c')]);
  const loops = subflowMap([sub('loop1', [node('z', 'subflow.loop2')]), sub('loop2', [node('w', 'subflow.loop1')])]);
  it('lists the subflows nodes use', () => {
    expect([...usesOf([node('1', 'subflow.a'), node('2', 'trigger.boot'), node('3', 'subflow.a'), node('4', 'subflow.b')])]).toEqual(['a', 'b']);
    expect(usesOf(undefined).size).toBe(0);
  });
  it('counts the depth, and sees a loop', () => {
    expect(depthOf(subs, 'c')).toBe(1);
    expect(depthOf(subs, 'b')).toBe(2);
    expect(depthOf(subs, 'a')).toBe(3);
    expect(depthOf(subs, 'missing')).toBe(1);
    expect(depthOf(loops, 'loop1')).toBe(Infinity);
  });
  it('tells where an instance may not go', () => {
    expect(nestProblem(subs, 'c', 'c')).toBe('cycle');
    expect(nestProblem(subs, 'c', 'a')).toBe('cycle');
    expect(nestProblem(subs, 'c', 'b')).toBe('cycle');
    expect(nestProblem(subflowMap([sub('p'), sub('q')]), 'p', 'q')).toBeNull();
    expect(nestProblem(subs, 'newhost', 'a', 2)).toBe('depth');
    expect(nestProblem(subs, 'newhost', 'a', 4)).toBeNull();
    const shallow = subflowMap([sub('b', [node('y', 'subflow.c')]), sub('c')]);
    expect(nestProblem(shallow, 'newhost', 'c', 2)).toBeNull();
    expect(nestProblem(shallow, 'newhost', 'b', 2)).toBe('depth');
  });
  it('checks the depth of a subflow put into a flow', () => {
    expect(placementProblem(subs, 'a', 2)).toBe('depth');
    expect(placementProblem(subs, 'b', 2)).toBeNull();
  });
  it('lists what uses a subflow', () => {
    expect(usedBy([{ id: 'f1', nodes: [node('1', 'subflow.c')] }, { id: 'f2', nodes: [node('1', 'trigger.boot')] }, { id: 'f3' }], 'c')).toEqual(['f1']);
  });
});

describe('outputs', () => {
  it('names the next output', () => {
    expect(nextOutput({ outputs: [] })).toBe('out');
    expect(nextOutput({ outputs: ['out'] })).toBe('out2');
    expect(nextOutput({ outputs: ['out', 'out2', 'out3'] })).toBe('out4');
    expect(nextOutput({ outputs: ['out2'] })).toBe('out');
  });
  it('drops an output with the blocks and connections that sent to it', () => {
    const sf: RuleSubflow = {
      ...sub('s', [node('pin', 'port.in'), node('p1', 'port.out', 0, 0, { port: 'a' }), node('p2', 'port.out', 0, 0, { port: 'b' })], ['a', 'b']),
      edges: [edge('e1', 'pin', 'out', 'p1'), edge('e2', 'pin', 'out', 'p2')],
    };
    const { subflow, removed } = dropOutput(sf, 'a');
    expect(removed).toBe(1);
    expect(subflow.outputs).toEqual(['b']);
    expect(subflow.nodes.map((n) => n.nodeId)).toEqual(['pin', 'p2']);
    expect(subflow.edges.map((e) => e.edgeId)).toEqual(['e2']);
    expect(sf.outputs).toEqual(['a', 'b']);
  });
  it('finds connections that leave an output the definition lost', () => {
    const subs = subflowMap([sub('s', [], ['high'])]);
    const nodes = [node('i', 'subflow.s'), node('t', 'trigger.boot')];
    const edges = [edge('e1', 'i', 'high', 't'), edge('e2', 'i', 'low', 't'), edge('e3', 'i', 'error', 't'), edge('e4', 't', 'out', 'i')];
    expect(danglingPorts(edges, nodes, subs).map((e) => e.edgeId)).toEqual(['e2']);
  });
});

describe('fromSelection', () => {
  const group = (groupId: string, nodeIds: string[]): RuleGroup => ({ groupId, name: groupId, color: 0, nodeIds });
  const base = {
    nodes: [node('a', 'trigger.boot', 0, 0), node('b', 'cond.compare', 300, 100), node('c', 'action.log', 600, 50), node('d', 'action.log', 600, 200), node('e', 'trigger.boot', 0, 300)],
    edges: [edge('e1', 'a', 'out', 'b'), edge('e2', 'b', 'yes', 'c'), edge('e3', 'b', 'no', 'd'), edge('e4', 'e', 'out', 'd')],
    groups: [group('g1', ['b', 'c']), group('g2', ['a', 'b']), group('g3', ['d'])],
  };
  const options = { subflowId: 'sf-new', name: 'New one', nodeWidth: 100 };

  it('returns null for an empty selection', () => {
    expect(fromSelection(base, ['zzz'], options)).toBeNull();
  });

  it('makes one input, one output per leaving port, and one instance in place of the selection', () => {
    const result = fromSelection(base, ['b'], options)!;
    const { subflow } = result;
    expect(subflow).toMatchObject({ subflowId: 'sf-new', name: 'New one', inputs: 1, outputs: ['out1', 'out2'] });
    expect(subflow.nodes.map((n) => n.type)).toEqual(['port.in', 'cond.compare', 'port.out', 'port.out']);
    expect(subflow.nodes.filter((n) => n.type === 'port.out').map((n) => n.config?.port)).toEqual(['out1', 'out2']);
    expect(subflow.edges.map((e) => [e.sourceNodeId, e.sourcePort, e.targetNodeId])).toEqual([
      ['pin', 'out', 'b'], ['b', 'yes', 'pout1'], ['b', 'no', 'pout2'],
    ]);
    expect(result.instance).toBe('n6');
    expect(result.nodes.map((n) => n.nodeId)).toEqual(['a', 'c', 'd', 'e', 'n6']);
    expect(result.nodes.at(-1)).toMatchObject({ type: 'subflow.sf-new', label: 'New one', x: 300, y: 100 });
    expect(result.edges.map((e) => [e.sourceNodeId, e.sourcePort, e.targetNodeId])).toEqual([
      ['e', 'out', 'd'], ['a', 'out', 'n6'], ['n6', 'out1', 'c'], ['n6', 'out2', 'd'],
    ]);
    expect(new Set(result.edges.map((e) => e.edgeId)).size).toBe(result.edges.length);
  });

  it('moves the selection to the top left of the subflow canvas', () => {
    const { subflow } = fromSelection(base, ['b', 'c'], options)!;
    const moved = subflow.nodes.filter((n) => n.nodeId === 'b' || n.nodeId === 'c');
    expect(moved.map((n) => [n.x, n.y])).toEqual([[200, 110], [500, 60]]);
    const pout = subflow.nodes.find((n) => n.type === 'port.out')!;
    expect(pout.x).toBe(600 - 100 + 100 + 80);
  });

  it('gives a single leaving port the name out, and no input when nothing enters', () => {
    const result = fromSelection(
      { nodes: [node('a', 'trigger.boot'), node('b', 'action.log')], edges: [edge('e1', 'a', 'out', 'b')], groups: [] },
      ['a'], options,
    )!;
    expect(result.subflow.inputs).toBe(0);
    expect(result.subflow.outputs).toEqual(['out']);
    expect(result.subflow.nodes.map((n) => n.type)).toEqual(['trigger.boot', 'port.out']);
  });

  it('warns when several different feeders are merged into one input, and joins them to one outer connection each', () => {
    const graph = {
      nodes: [node('a', 'trigger.boot'), node('f', 'trigger.boot'), node('b', 'action.log')],
      edges: [edge('e1', 'a', 'out', 'b'), edge('e2', 'f', 'out', 'b')],
      groups: [],
    };
    const result = fromSelection(graph, ['b'], options)!;
    expect(result.warnings).toEqual([{ code: 'merged_inputs', count: 2 }]);
    expect(result.edges.map((e) => [e.sourceNodeId, e.targetNodeId])).toEqual([['a', result.instance], ['f', result.instance]]);
  });

  it('takes groups wholly inside the selection along, and trims the others', () => {
    const result = fromSelection(base, ['b', 'c'], options)!;
    expect(result.subflow.groups.map((x) => x.groupId)).toEqual(['g1']);
    expect(result.groups.map((x) => [x.groupId, x.nodeIds])).toEqual([['g2', ['a']], ['g3', ['d']]]);
  });

  it('does not change the graph it was given', () => {
    const before = JSON.stringify(base);
    fromSelection(base, ['b'], options);
    expect(JSON.stringify(base)).toBe(before);
  });

  it('makes a subflow and an outer graph that validate', () => {
    const catalog = catalogFromBlocks([[{ type: 'trigger.boot' }, { type: 'cond.compare' }, { type: 'action.log' }, ...Object.values(portBlocks(['out1', 'out2'])).map((b) => ({ ...b, type: b.type }))]]);
    const result = fromSelection(base, ['b'], options)!;
    const withSub = catalogWithSubflows(catalog, [result.subflow]);
    expect(validateGraph(result, withSub).errors).toEqual([]);
    const inner = catalogWithSubflows(catalog, [], { subflowId: 'sf-new', outputs: result.subflow.outputs });
    expect(validateGraph(result.subflow, inner, { subflow: { inputs: 1, outputs: result.subflow.outputs } })).toEqual({ errors: [], warnings: [] });
  });
});
