import { describe, expect, it } from 'vitest';
import { snapDrag, snapValue, SNAP_GRID, type Box } from './snap';

const box = (id: string, x: number, y: number, w = 100, h = 60): Box => ({ id, x, y, w, h });

describe('snapValue', () => {
  it('rounds to the 12 px grid', () => {
    expect(SNAP_GRID).toBe(12);
    expect(snapValue(5)).toBe(0);
    expect(snapValue(7)).toBe(12);
    expect(snapValue(-7)).toBe(-12);
    expect(snapValue(30)).toBe(36);
  });
  it('rounds to whole pixels when free', () => {
    expect(snapValue(7.4, true)).toBe(7);
    expect(snapValue(7.6, true)).toBe(8);
  });
});

describe('snapDrag', () => {
  it('snaps to the grid when nothing lines up', () => {
    const out = snapDrag([box('a', 505, 307)], [box('o', 0, 0)], { tol: 6 });
    expect(out.positions).toEqual([{ id: 'a', x: 504, y: 312 }]);
    expect(out.guides).toEqual([]);
  });

  it('moves freely (whole pixels, no guides) with Alt', () => {
    const out = snapDrag([box('a', 203.4, 100.6)], [box('o', 200, 100)], { tol: 6, free: true });
    expect(out.positions).toEqual([{ id: 'a', x: 203, y: 101 }]);
    expect(out.guides).toEqual([]);
  });

  it('jumps onto the left edge of another block and draws a vertical guide', () => {
    const out = snapDrag([box('a', 203, 400)], [box('o', 200, 100)], { tol: 6 });
    expect(out.positions[0].x).toBe(200);
    const g = out.guides.find((x) => x.axis === 'x');
    expect(g).toBeDefined();
    expect(g?.at).toBe(200);
    // from the top of the other block to the bottom of the dragged one (which sits on the grid at y 396)
    expect(g?.from).toBe(100);
    expect(g?.to).toBe(456);
  });

  it('aligns middle with middle and right with right', () => {
    // dragged width 100, other width 100: middles at x+50
    const mid = snapDrag([box('a', 105, 0)], [box('o', 100, 300)], { tol: 6 });
    expect(mid.positions[0].x).toBe(100);
    const right = snapDrag([box('a', 0, 0, 60)], [box('o', 100, 300, 100)], { tol: 6 });
    // right of a = 60, nothing within 6 of 100/150/200; on the grid
    expect(right.guides).toEqual([]);
    const right2 = snapDrag([box('a', 142, 0, 60)], [box('o', 100, 300, 100)], { tol: 6 });
    // right of a = 202 meets right of o = 200
    expect(right2.positions[0].x).toBe(140);
    expect(right2.guides[0]).toMatchObject({ axis: 'x', at: 200 });
  });

  it('aligns top, middle and bottom with a horizontal guide', () => {
    const out = snapDrag([box('a', 500, 103)], [box('o', 0, 100)], { tol: 6 });
    expect(out.positions[0].y).toBe(100);
    const g = out.guides.find((x) => x.axis === 'y');
    expect(g).toMatchObject({ at: 100, from: 0, to: 604 });
    const bottom = snapDrag([box('a', 500, 158)], [box('o', 0, 100)], { tol: 6 });
    // the top of a (158) is 2 from the bottom of o (160)
    expect(bottom.positions[0].y).toBe(160);
  });

  it('does not jump when the line is farther than the tolerance', () => {
    const out = snapDrag([box('a', 210, 500)], [box('o', 200, 100)], { tol: 6 });
    expect(out.guides).toEqual([]);
    expect(out.positions[0].x).toBe(biggestGrid(210));
  });

  it('keeps the tolerance in screen pixels: a smaller world tolerance when zoomed in', () => {
    const near = snapDrag([box('a', 204, 500)], [box('o', 200, 100)], { tol: 6 / 2 });
    expect(near.guides).toEqual([]);
    const caught = snapDrag([box('a', 202, 500)], [box('o', 200, 100)], { tol: 6 / 2 });
    expect(caught.guides).toHaveLength(1);
  });

  it('picks the nearest line when several are in reach', () => {
    const out = snapDrag([box('a', 204, 500)], [box('o1', 200, 0), box('o2', 203, 200)], { tol: 6 });
    expect(out.positions[0].x).toBe(203);
  });

  it('moves a group as one box and keeps the offsets', () => {
    const out = snapDrag([box('a', 203, 400), box('b', 403, 460)], [box('o', 200, 100)], { tol: 6 });
    expect(out.positions.map((p) => p.x)).toEqual([200, 400]);
    expect(out.positions[1].y - out.positions[0].y).toBe(60);
  });

  it('snaps to the grid when there is no other block', () => {
    const out = snapDrag([box('a', 203, 400)], [], { tol: 6 });
    expect(out.guides).toEqual([]);
    expect(out.positions[0]).toEqual({ id: 'a', x: 204, y: 396 });
  });

  it('returns nothing for no moving block', () => {
    expect(snapDrag([], [box('o', 0, 0)], { tol: 6 })).toEqual({ positions: [], guides: [] });
  });
});

function biggestGrid(v: number) {
  return Math.round(v / 12) * 12;
}
