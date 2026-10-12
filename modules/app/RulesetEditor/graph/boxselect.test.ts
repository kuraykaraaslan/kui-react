import { describe, expect, it } from 'vitest';
import { frameMoved, frameToWorld, hitNodes, mergeSelection, normalizeFrame } from './boxselect';

const nodes = [
  { nodeId: 'a', x: 0, y: 0 },
  { nodeId: 'b', x: 300, y: 0 },
  { nodeId: 'c', x: 0, y: 200 },
];
const H = () => 100;

describe('frames', () => {
  it('puts the corners in order', () => {
    expect(normalizeFrame({ x0: 50, y0: 40, x1: 10, y1: 5 })).toEqual({ x0: 10, y0: 5, x1: 50, y1: 40 });
  });

  it('counts a drag only after a few pixels', () => {
    expect(frameMoved({ x0: 0, y0: 0, x1: 2, y1: 2 })).toBe(false);
    expect(frameMoved({ x0: 0, y0: 0, x1: 3, y1: 2 })).toBe(true);
  });

  it('undoes pan and zoom', () => {
    expect(frameToWorld({ x0: 120, y0: 60, x1: 20, y1: 10 }, { x: 20, y: 10, k: 0.5 })).toEqual({ x0: 0, y0: 0, x1: 200, y1: 100 });
  });
});

describe('hitNodes', () => {
  it('takes the blocks the frame touches, a corner is enough', () => {
    expect(hitNodes(nodes, { x0: 150, y0: 90, x1: 310, y1: 110 }, 160, H)).toEqual(['a', 'b']);
  });
  it('leaves out the blocks that are only near', () => {
    expect(hitNodes(nodes, { x0: 170, y0: 0, x1: 290, y1: 500 }, 160, H)).toEqual([]);
    expect(hitNodes(nodes, { x0: 160, y0: 0, x1: 300, y1: 100 }, 160, H)).toEqual([]);
  });
  it('can take all', () => {
    expect(hitNodes(nodes, { x0: -10, y0: -10, x1: 1000, y1: 1000 }, 160, H)).toEqual(['a', 'b', 'c']);
  });
  it('uses the height of each block', () => {
    expect(hitNodes(nodes, { x0: 0, y0: 150, x1: 50, y1: 190 }, 160, () => 100)).toEqual([]);
    expect(hitNodes(nodes, { x0: 0, y0: 150, x1: 50, y1: 190 }, 160, (n) => (n.nodeId === 'a' ? 180 : 100))).toEqual(['a']);
  });
});

describe('mergeSelection', () => {
  it('replaces the selection', () => {
    expect(mergeSelection(['a'], ['b', 'c'], false)).toEqual(['b', 'c']);
  });
  it('adds to the selection, the last hit is the primary one', () => {
    expect(mergeSelection(['a', 'b'], ['b', 'c'], true)).toEqual(['a', 'b', 'c']);
  });
  it('keeps the selection when the frame touched nothing and it adds', () => {
    expect(mergeSelection(['a'], [], true)).toEqual(['a']);
    expect(mergeSelection(['a'], [], false)).toEqual([]);
  });
});
