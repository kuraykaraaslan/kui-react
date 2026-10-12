import { describe, expect, it } from 'vitest';
import { filterRuns, framesOf, isProblemRun, markOf, type RunRow } from './runs';

const run = (over: Partial<RunRow> = {}): RunRow => ({
  run: 'r1', ts: 1000, ms: 5, status: 'ok', level: 'all', originator: { type: 'tenant', id: 't' }, msgType: 'demo',
  trigger: { node: 't', input: { a: 1 } }, path: ['a', 'b'], outputs: [], errors: [], actions: [], ...over,
});
const step = (i: number, node: string, over: Record<string, unknown> = {}) => ({ i, t: 1000 + i, node, type: 'x', in: { i }, ms: 1, out: [], ...over });

describe('filterRuns', () => {
  const runs = [run({ run: 'old', ts: 1 }), run({ run: 'bad', ts: 3, status: 'error', path: ['a'] }), run({ run: 'new', ts: 5, path: ['b', 'c'] })];
  it('lists the newest first and narrows by status', () => {
    expect(filterRuns(runs, 'all').map((r) => r.run)).toEqual(['new', 'bad', 'old']);
    expect(filterRuns(runs, 'error').map((r) => r.run)).toEqual(['bad']);
  });
  it('the per-node view keeps the runs that visited the node or entered through it', () => {
    expect(filterRuns(runs, 'all', 'c').map((r) => r.run)).toEqual(['new']);
    expect(filterRuns(runs, 'all', 't').map((r) => r.run)).toHaveLength(3);
    expect(filterRuns(runs, 'all', 'zz')).toEqual([]);
  });
  it('does not reorder its input', () => {
    const before = runs.map((r) => r.run);
    filterRuns(runs, 'all');
    expect(runs.map((r) => r.run)).toEqual(before);
  });
});

describe('framesOf', () => {
  it('starts with the message that began the run, then the steps in order', () => {
    const f = framesOf(run({ steps: [step(2, 'b'), step(1, 'a')] }));
    expect(f.map((x) => (x.kind === 'trigger' ? 'T' : x.kind === 'step' ? x.step.node : '?'))).toEqual(['T', 'a', 'b']);
  });
  it('falls back to the bare path when no step was kept', () => {
    const f = framesOf(run({ steps: undefined }));
    expect(f.map((x) => x.kind)).toEqual(['trigger', 'path', 'path']);
  });
});

describe('markOf', () => {
  const frames = framesOf(run({ steps: [step(1, 'a'), step(2, 'b', { error: { code: 'boom', message: 'x' } })] }));
  it('marks what was visited up to the frame, the current node and a failed one', () => {
    expect(markOf(frames, 0)).toEqual({ visited: ['t'], current: 't', failed: null });
    expect(markOf(frames, 1)).toEqual({ visited: ['t', 'a'], current: 'a', failed: null });
    expect(markOf(frames, 2)).toEqual({ visited: ['t', 'a', 'b'], current: 'b', failed: 'b' });
  });
  it('an index past the end marks nothing current', () => {
    expect(markOf(frames, 9).current).toBeNull();
  });
});

describe('isProblemRun', () => {
  it('is every status but ok', () => {
    expect(['ok', 'error', 'left_open', 'dropped'].map((status) => isProblemRun({ status: status as never }))).toEqual([false, true, true, true]);
  });
});
