import { describe, expect, it } from 'vitest';
import { autoLayout } from './layout';

const n = (nodeId: string, x = 0, y = 0) => ({ nodeId, x, y });
const e = (a: string, b: string) => ({ sourceNodeId: a, targetNodeId: b });
const O = { w: 100, h: 50, gx: 20, gy: 10 };

describe('autoLayout', () => {
  it('returns nothing for an empty graph', () => {
    expect(autoLayout([], [], O)).toEqual({});
  });

  it('puts a chain in columns, left to right, in one row', () => {
    const pos = autoLayout([n('a'), n('b'), n('c')], [e('a', 'b'), e('b', 'c')], O);
    expect(pos).toEqual({ a: { x: 0, y: 0 }, b: { x: 120, y: 0 }, c: { x: 240, y: 0 } });
  });

  it('uses the longest path from the entries for the layer', () => {
    // a -> b -> c and a -> c: c is in column 2, not 1
    const pos = autoLayout([n('a'), n('b'), n('c')], [e('a', 'b'), e('b', 'c'), e('a', 'c')], O);
    expect(pos.c.x).toBe(240);
    expect(pos.b.x).toBe(120);
  });

  it('stacks the blocks of one column, in their old vertical order', () => {
    const pos = autoLayout([n('a', 0, 0), n('x', 300, 200), n('y', 300, 100)], [e('a', 'x'), e('a', 'y')], O);
    expect(pos.y).toEqual({ x: 120, y: 0 });
    expect(pos.x).toEqual({ x: 120, y: 60 });
  });

  it('keeps the top left of the old boxes', () => {
    const pos = autoLayout([n('a', 500, 300), n('b', 800, 400)], [e('a', 'b')], O);
    expect(pos.a).toEqual({ x: 500, y: 300 });
    expect(pos.b).toEqual({ x: 620, y: 300 });
  });

  it('ignores the back wire of a loop', () => {
    const pos = autoLayout([n('a'), n('b'), n('c')], [e('a', 'b'), e('b', 'c'), e('c', 'a')], O);
    expect([pos.a.x, pos.b.x, pos.c.x]).toEqual([0, 120, 240]);
  });

  it('survives a loop without an entry and a self wire', () => {
    const pos = autoLayout([n('a'), n('b')], [e('a', 'b'), e('b', 'a'), e('a', 'a')], O);
    expect(Object.keys(pos).sort()).toEqual(['a', 'b']);
    expect(pos.a.x).not.toBe(pos.b.x);
  });

  it('stacks separate parts of the flow', () => {
    const pos = autoLayout([n('a', 0, 0), n('b', 0, 10), n('c', 0, 20), n('d', 0, 30)], [e('a', 'b'), e('c', 'd')], O);
    expect(pos.a).toEqual({ x: 0, y: 0 });
    expect(pos.b).toEqual({ x: 120, y: 0 });
    // the second part starts under the first: its height (50) + gap (10) + gap (10)
    expect(pos.c).toEqual({ x: 0, y: 70 });
    expect(pos.d).toEqual({ x: 120, y: 70 });
  });

  it('puts a lone block in its own part', () => {
    const pos = autoLayout([n('a'), n('z', 0, 5)], [], O);
    expect(pos.a.y).toBe(0);
    expect(pos.z.y).toBe(70);
  });

  it('takes the height of each block from a function', () => {
    const heights: Record<string, number> = { a: 30, x: 80, y: 40 };
    const pos = autoLayout([n('a', 0, 0), n('x', 0, 1), n('y', 0, 2)], [e('a', 'x'), e('a', 'y')], { ...O, h: (node) => heights[node.nodeId] });
    expect(pos.x.y).toBe(0);
    expect(pos.y.y).toBe(80 + 10);
  });

  it('orders a column by the mean place of the neighbours so wires do not cross', () => {
    // a1 -> b2, a2 -> b1 with b1 above b2 by old position: the sweep puts b2 above b1
    const nodes = [n('a1', 0, 0), n('a2', 0, 100), n('b1', 300, 0), n('b2', 300, 100)];
    const pos = autoLayout(nodes, [e('a1', 'b2'), e('a2', 'b1')], O);
    // the entries keep their order (a1 above a2); b follows its feeder
    expect(pos.a1.y).toBeLessThan(pos.a2.y);
    expect(pos.b2.y).toBeLessThan(pos.b1.y);
  });

  it('ignores wires to unknown blocks and repeated wires', () => {
    const pos = autoLayout([n('a'), n('b')], [e('a', 'b'), e('a', 'b'), e('a', 'ghost'), e('ghost', 'b')], O);
    expect(pos).toEqual({ a: { x: 0, y: 0 }, b: { x: 120, y: 0 } });
  });

  it('is deterministic and does not change its input', () => {
    const nodes = [n('c', 5, 5), n('a', 1, 1), n('b', 3, 3), n('d', 9, 9)];
    const edges = [e('a', 'b'), e('a', 'c'), e('b', 'd'), e('c', 'd')];
    const before = JSON.stringify([nodes, edges]);
    const first = autoLayout(nodes, edges, O);
    expect(autoLayout(nodes, edges, O)).toEqual(first);
    expect(autoLayout([...nodes].reverse(), [...edges].reverse(), O)).toEqual(first);
    expect(JSON.stringify([nodes, edges])).toBe(before);
  });

  it('is a fixed point: laying out a laid-out graph changes nothing', () => {
    const nodes = [n('a', 40, 40), n('b', 0, 500), n('c', 900, 20), n('d', 10, 10)];
    const edges = [e('a', 'b'), e('a', 'c'), e('b', 'd')];
    const once = autoLayout(nodes, edges, O);
    const placed = nodes.map((x) => ({ ...x, ...once[x.nodeId] }));
    expect(autoLayout(placed, edges, O)).toEqual(once);
  });
});
