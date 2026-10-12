import { describe, expect, it } from 'vitest';
import { BUILTIN_CATALOG, catalogFromBlocks } from '../catalog';
import { issuesByNode, issueMessage, syncCycle, validateGraph } from './validate';
import type { GraphEdge, GraphNode } from './types';

const catalog = catalogFromBlocks([[
  { type: 'trigger.boot' },
  { type: 'cond.compare' },
  { type: 'action.log', params: { text: { type: 'string', required: true } } },
  { type: 'action.mqtt', params: { topic: { type: 'string', required: true, when: { param: 'mode', value: 'custom' } }, mode: { type: 'enum', options: ['auto', 'custom'], default: 'auto' } } },
  { type: 'note.comment', inputs: 0, outputs: [] },
  { type: 'port.in', inputs: 0, outputs: ['out'] },
  { type: 'port.out', outputs: [], params: { port: { type: 'enum', options: ['out'] } } },
]]);

const node = (nodeId: string, type: string, config?: Record<string, unknown>): GraphNode => ({ nodeId, type, label: nodeId, x: 0, y: 0, config });
const edge = (from: string, port: string, to: string): GraphEdge => ({ edgeId: from + '-' + to, sourceNodeId: from, sourcePort: port, targetNodeId: to, targetPort: 'in' });
const codes = (list: { code: string }[]) => list.map((i) => i.code);

describe('validateGraph', () => {
  it('accepts a connected graph', () => {
    const result = validateGraph({
      nodes: [node('a', 'trigger.boot'), node('b', 'cond.compare'), node('c', 'action.log', { text: 'hi' })],
      edges: [edge('a', 'out', 'b'), edge('b', 'yes', 'c')],
    }, catalog);
    expect(result).toEqual({ errors: [], warnings: [] });
  });

  it('reports an unknown type and an unsupported block as errors', () => {
    const result = validateGraph({ nodes: [node('a', 'nope.x'), node('b', 'PLACEHOLDER'), node('c', 'unsupported')], edges: [] }, catalog);
    expect(codes(result.errors)).toEqual(['unknown', 'unsupported', 'unsupported']);
    expect(result.errors[0].arg).toBe('nope.x');
    expect(result.errors[0].message).toBe('Unknown block type nope.x.');
  });

  it('turns a missing required param into a warning, or an error when the chain is active', () => {
    const graph = { nodes: [node('a', 'trigger.boot'), node('b', 'action.log', { text: '' })], edges: [edge('a', 'out', 'b')] };
    const idle = validateGraph(graph, catalog);
    expect(codes(idle.warnings)).toEqual(['required']);
    expect(idle.warnings[0]).toMatchObject({ nodeId: 'b', param: 'text', severity: 'warning' });
    expect(idle.errors).toEqual([]);
    const active = validateGraph(graph, catalog, { active: true });
    expect(codes(active.errors)).toEqual(['required']);
    expect(active.errors[0].severity).toBe('error');
  });

  it('skips a required param that is hidden by when', () => {
    const graph = (mode: string) => ({ nodes: [node('a', 'trigger.boot'), node('b', 'action.mqtt', { mode })], edges: [edge('a', 'out', 'b')] });
    expect(validateGraph(graph('auto'), catalog).warnings).toEqual([]);
    expect(codes(validateGraph(graph('custom'), catalog).warnings)).toEqual(['required']);
  });

  it('counts a script stored in node.script as the value of its param', () => {
    const graph = (script: string) => ({
      nodes: [node('a', 'TRIGGER'), { ...node('b', 'TRANSFORM'), script }],
      edges: [edge('a', 'out', 'b')],
    });
    const builtin = { ...BUILTIN_CATALOG, blocks: { ...BUILTIN_CATALOG.blocks, TRANSFORM: { ...BUILTIN_CATALOG.blocks.TRANSFORM, params: { script: { ...BUILTIN_CATALOG.blocks.TRANSFORM.params!.script, required: true } } } } };
    expect(validateGraph(graph('return msg;'), builtin).warnings).toEqual([]);
    expect(codes(validateGraph(graph(''), builtin).warnings)).toEqual(['required']);
  });

  it('checks connections: missing block, missing port, block without input', () => {
    const nodes = [node('a', 'trigger.boot'), node('b', 'cond.compare'), node('c', 'trigger.boot')];
    expect(codes(validateGraph({ nodes, edges: [edge('a', 'out', 'ghost')] }, catalog).errors)).toEqual(['edge']);
    expect(codes(validateGraph({ nodes, edges: [edge('b', 'maybe', 'a')] }, catalog).errors)).toEqual(['edge_port']);
    expect(codes(validateGraph({ nodes, edges: [edge('a', 'out', 'c')] }, catalog).errors)).toEqual(['no_input']);
  });

  it('allows the error port on any block', () => {
    const result = validateGraph({ nodes: [node('a', 'cond.compare'), node('b', 'action.log', { text: 'x' })], edges: [edge('a', 'error', 'b')] }, catalog);
    expect(result.errors).toEqual([]);
  });

  it('warns about a block nothing is connected to, and about a block nothing feeds', () => {
    const result = validateGraph({
      nodes: [node('a', 'trigger.boot'), node('b', 'action.log', { text: 'x' }), node('c', 'cond.compare'), node('d', 'note.comment')],
      edges: [edge('c', 'yes', 'b')],
    }, catalog);
    expect(result.warnings.map((w) => w.code + ':' + w.nodeId)).toEqual(['unconnected:a', 'no_feed:c']);
  });

  it('reports a subflow that nests badly through the nest callback', () => {
    const nodes = [node('a', 'trigger.boot'), node('b', 'subflow.loop')];
    const catalogWithSub = { ...catalog, blocks: { ...catalog.blocks, 'subflow.loop': { type: 'subflow.loop', title: 'Loop' } } };
    const result = validateGraph({ nodes, edges: [edge('a', 'out', 'b')] }, catalogWithSub, { nest: (id) => (id === 'loop' ? 'cycle' : null) });
    expect(codes(result.errors)).toEqual(['cycle']);
    expect(result.errors[0].arg).toBe('loop');
  });

  describe('inside a subflow', () => {
    const inner = (extra: GraphNode[] = [], outPort = 'out') => ({
      nodes: [node('pin', 'port.in'), node('pout', 'port.out', { port: outPort }), ...extra],
      edges: [edge('pin', 'out', 'pout')],
    });
    it('accepts the new subflow layout', () => {
      expect(validateGraph(inner(), catalog, { subflow: { inputs: 1, outputs: ['out'] } })).toEqual({ errors: [], warnings: [] });
    });
    it('rejects an output block that names a missing output', () => {
      const result = validateGraph(inner([], 'gone'), catalog, { subflow: { inputs: 1, outputs: ['out'] } });
      expect(codes(result.errors)).toEqual(['port']);
    });
    it('allows one input block, and none when the subflow has no input', () => {
      expect(codes(validateGraph(inner([node('pin2', 'port.in')]), catalog, { subflow: { inputs: 1, outputs: ['out'] } }).errors)).toContain('one_input');
      expect(codes(validateGraph(inner(), catalog, { subflow: { inputs: 0, outputs: ['out'] } }).errors)).toEqual(['port_in']);
    });
    it('warns when the subflow has an input but no input block', () => {
      const result = validateGraph({ nodes: [node('pout', 'port.out', { port: 'out' })], edges: [] }, catalog, { subflow: { inputs: 1, outputs: ['out'] } });
      expect(codes(result.warnings)).toContain('missing_in');
    });
    it('rejects bad output names', () => {
      const result = validateGraph(inner(), catalog, { subflow: { inputs: 1, outputs: ['out', 'error', 'Bad Name'] } });
      expect(result.errors.filter((e) => e.code === 'out_name').map((e) => e.arg)).toEqual(['error', 'Bad Name']);
    });
  });
});

describe('issue helpers', () => {
  it('groups issues by node with errors first', () => {
    const result = validateGraph({ nodes: [node('b', 'action.log', { text: '' }), node('x', 'nope.y')], edges: [] }, catalog, { active: true });
    const map = issuesByNode(result);
    expect(map.get('x')?.map((i) => i.code)).toEqual(['unknown']);
    expect(map.get('b')?.map((i) => i.code)).toEqual(['required', 'unconnected']);
  });
  it('words every code', () => {
    for (const code of ['unsupported', 'unknown', 'required', 'port', 'cycle', 'depth', 'cycle_sync', 'edge', 'edge_port', 'no_input', 'one_input', 'missing_in', 'port_in', 'out_name', 'unconnected', 'no_feed'] as const) {
      expect(issueMessage(code, 'x', 'p').length).toBeGreaterThan(5);
    }
  });
});

describe('cycle_sync', () => {
  const sync = catalogFromBlocks([[
    { type: 'logic.pass' },
    { type: 'logic.pass2' },
    { type: 'logic.delay', async: true },
  ]]);
  const ring = (types: string[]) => ({
    nodes: types.map((t, i) => node('n' + i, t)),
    edges: types.map((_, i) => edge('n' + i, 'out', 'n' + ((i + 1) % types.length))),
  });

  it('reports a loop of blocks that never wait, once, on its first block', () => {
    const result = validateGraph(ring(['logic.pass', 'logic.pass2', 'logic.pass']), sync);
    const issue = result.errors.find((i) => i.code === 'cycle_sync')!;
    expect(result.errors.filter((i) => i.code === 'cycle_sync')).toHaveLength(1);
    expect(issue.nodeId).toBe('n0');
    expect(issue.arg).toBe('n0 → n1 → n2');
    expect(issue.message).toContain('n0 → n1 → n2');
  });
  it('a block that waits breaks the loop', () => {
    expect(codes(validateGraph(ring(['logic.pass', 'logic.delay', 'logic.pass']), sync).errors)).not.toContain('cycle_sync');
  });
  it('a block that points to itself is a loop', () => {
    const g = { nodes: [node('a', 'logic.pass')], edges: [edge('a', 'out', 'a')] };
    expect(codes(validateGraph(g, sync).errors)).toContain('cycle_sync');
  });
  it('a loop that is cut by a wrong port is not counted (the edge error stands)', () => {
    const g = { nodes: [node('a', 'logic.pass'), node('b', 'logic.pass')], edges: [edge('a', 'out', 'b'), edge('b', 'nope', 'a')] };
    const result = validateGraph(g, sync);
    expect(codes(result.errors)).toEqual(['edge_port']);
  });
  it('a chain and a diamond are not loops', () => {
    const g = { nodes: ['a', 'b', 'c', 'd'].map((id) => node(id, 'logic.pass')), edges: [edge('a', 'out', 'b'), edge('a', 'out', 'c'), edge('b', 'out', 'd'), edge('c', 'out', 'd')] };
    expect(codes(validateGraph(g, sync).errors)).toEqual([]);
  });
  it('finds a loop that does not include the first block, and survives a very long chain', () => {
    expect(syncCycle(new Map([['a', ['b']], ['b', ['c']], ['c', ['b']]]))).toEqual(['b', 'c']);
    const long = new Map<string, string[]>();
    for (let i = 0; i < 20000; i++) long.set('n' + i, ['n' + (i + 1)]);
    expect(syncCycle(long)).toBeNull();
  });
});

describe('cycle_sync with the built-in catalog', () => {
  const e = (from: string, port: string, to: string) => edge(from, port, to);
  it('a loop through a delay is fine, a loop of filters is not', () => {
    const ok = { nodes: [node('a', 'FILTER'), node('d', 'DELAY')], edges: [e('a', 'true', 'd'), e('d', 'out', 'a')] };
    expect(codes(validateGraph(ok, BUILTIN_CATALOG).errors)).not.toContain('cycle_sync');
    const bad = { nodes: [node('a', 'FILTER'), node('b', 'TRANSFORM')], edges: [e('a', 'true', 'b'), e('b', 'out', 'a')] };
    expect(codes(validateGraph(bad, BUILTIN_CATALOG).errors)).toContain('cycle_sync');
  });
});

describe('validateGraph words', () => {
  it('uses the message function of the context', () => {
    const r = validateGraph({ nodes: [node('x', 'nope.y')], edges: [] }, catalog, { message: (code, arg) => `${code}!${arg}` });
    expect(r.errors[0].message).toBe('unknown!nope.y');
    expect(validateGraph({ nodes: [node('x', 'nope.y')], edges: [] }, catalog).errors[0].message).toBe('Unknown block type nope.y.');
  });
});
