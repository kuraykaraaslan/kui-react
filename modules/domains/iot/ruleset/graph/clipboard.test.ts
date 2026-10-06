import { describe, expect, it } from 'vitest';
import { CLIPBOARD_FORMAT, copySelection, duplicateNodes, parseClip, pasteClip, serializeClip } from './clipboard';
import type { Graph, GraphEdge, GraphNode } from './types';

const node = (nodeId: string, x: number, y: number, extra: Partial<GraphNode> = {}): GraphNode => ({ nodeId, type: 'cond.compare', label: nodeId, x, y, ...extra });
const edge = (edgeId: string, from: string, port: string, to: string): GraphEdge => ({ edgeId, sourceNodeId: from, sourcePort: port, targetNodeId: to, targetPort: 'in' });
const base: Graph = {
  nodes: [node('a', 0, 0), node('b', 200, 0, { config: { k: { deep: 1 } } }), node('c', 400, 0)],
  edges: [edge('e1', 'a', 'yes', 'b'), edge('e2', 'b', 'yes', 'c')],
  groups: [{ groupId: 'g1', name: 'g', color: 0, nodeIds: ['a', 'b'] }],
};

describe('copySelection', () => {
  it('copies the nodes and only the connections between them', () => {
    const clip = copySelection(base, ['a', 'b'])!;
    expect(clip.format).toBe(CLIPBOARD_FORMAT);
    expect(clip.nodes.map((n) => n.nodeId)).toEqual(['a', 'b']);
    expect(clip.edges.map((e) => e.edgeId)).toEqual(['e1']);
  });
  it('is a deep copy', () => {
    const clip = copySelection(base, ['b'])!;
    (clip.nodes[0].config as { k: { deep: number } }).k.deep = 2;
    expect((base.nodes[1].config as { k: { deep: number } }).k.deep).toBe(1);
  });
  it('gives null for an empty or unknown selection', () => {
    expect(copySelection(base, [])).toBeNull();
    expect(copySelection(base, ['zz'])).toBeNull();
  });
});

describe('text form', () => {
  it('round trips', () => {
    const clip = copySelection(base, ['a', 'b'])!;
    expect(parseClip(serializeClip(clip))).toEqual(clip);
  });
  it('refuses text that is not a clip', () => {
    expect(parseClip(null)).toBeNull();
    expect(parseClip('')).toBeNull();
    expect(parseClip('not json')).toBeNull();
    expect(parseClip('[1,2]')).toBeNull();
    expect(parseClip('null')).toBeNull();
    expect(parseClip(JSON.stringify({ format: 'other', nodes: [], edges: [] }))).toBeNull();
    expect(parseClip(JSON.stringify({ format: CLIPBOARD_FORMAT, nodes: [], edges: [] }))).toBeNull();
    expect(parseClip(JSON.stringify({ format: CLIPBOARD_FORMAT, nodes: [{ x: 1 }], edges: [] }))).toBeNull();
    expect(parseClip(JSON.stringify({ format: CLIPBOARD_FORMAT, nodes: 'x', edges: [] }))).toBeNull();
  });
  it('keeps the good nodes of a clip with some bad ones', () => {
    const text = JSON.stringify({ format: CLIPBOARD_FORMAT, nodes: [{ nodeId: 'a', type: 't', label: 'a', x: 0, y: 0 }, 5, null], edges: [null, { edgeId: 'e' }] });
    const clip = parseClip(text)!;
    expect(clip.nodes).toHaveLength(1);
    expect(clip.edges).toEqual([{ edgeId: 'e' }]);
  });
});

describe('pasteClip', () => {
  const clip = copySelection(base, ['a', 'b'])!;
  it('gives new ids, remaps connections and centres on a point', () => {
    const { graph, ids } = pasteClip(base, clip, { x: 1000, y: 500 }, 160);
    expect(ids).toEqual(['n4', 'n5']);
    expect(graph.nodes.map((n) => n.nodeId)).toEqual(['a', 'b', 'c', 'n4', 'n5']);
    // the box of the clip is 360 wide: its centre (180, 0) lands on (1000, 500)
    expect(graph.nodes.slice(3).map((n) => [n.x, n.y])).toEqual([[820, 500], [1020, 500]]);
    const added = graph.edges.slice(2);
    expect(added.map((e) => [e.sourceNodeId, e.sourcePort, e.targetNodeId])).toEqual([['n4', 'yes', 'n5']]);
    expect(new Set(graph.edges.map((e) => e.edgeId)).size).toBe(graph.edges.length);
  });
  it('does not copy groups and leaves the source graph alone', () => {
    const { graph } = pasteClip(base, clip, { x: 0, y: 0 }, 160);
    expect(graph.groups).toEqual(base.groups);
    expect(base.nodes).toHaveLength(3);
  });
  it('can paste the same clip again', () => {
    const once = pasteClip(base, clip, { x: 0, y: 0 }, 160).graph;
    const twice = pasteClip(once, clip, { x: 0, y: 0 }, 160);
    expect(twice.ids).toEqual(['n6', 'n7']);
  });
});

describe('duplicateNodes', () => {
  it('copies in place, a little to the lower right', () => {
    const { graph, ids } = duplicateNodes(base, ['a', 'b']);
    expect(ids).toHaveLength(2);
    expect(graph.nodes.slice(3).map((n) => [n.x, n.y])).toEqual([[32, 32], [232, 32]]);
    expect(graph.edges).toHaveLength(3);
  });
  it('takes an offset', () => {
    expect(duplicateNodes(base, ['c'], { x: 8, y: 0 }).graph.nodes[3]).toMatchObject({ x: 408, y: 0 });
  });
  it('does nothing for an empty selection', () => {
    expect(duplicateNodes(base, [])).toEqual({ graph: base, ids: [] });
  });
});
