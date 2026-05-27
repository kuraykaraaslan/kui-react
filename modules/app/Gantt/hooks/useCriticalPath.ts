'use client';
import { useMemo } from 'react';
import type { Dependency, Task, TaskId } from '../types';

const MS_PER_DAY = 86400000;

/**
 * Compute the set of task ids that lie on a critical path of the project.
 *
 * Algorithm (longest-path on the dependency DAG):
 *   1. Build successor / predecessor adjacency from `dependencies`. All
 *      dependency types contribute to the graph; their lag is added as
 *      extra edge weight. We treat every edge as a FS-style constraint
 *      for path-length purposes — SS / FF / SF still pin two tasks
 *      together along the critical chain so this is close enough for
 *      visualisation; M5+ can refine.
 *   2. Cycle-detect via Kahn's algorithm. On a cycle, no path is well
 *      defined, so we return an empty set.
 *   3. Forward pass in topological order: lengthFromStart[i] = max over
 *      predecessors p of (lengthFromStart[p] + lag) + duration[i].
 *   4. Backward pass in reverse topological order:
 *      lengthToEnd[i] = duration[i] + max over successors s of
 *      (lag + lengthToEnd[s]).
 *   5. Project length L = max over i of (lengthFromStart[i] +
 *      lengthToEnd[i] - duration[i]).
 *   6. A task is critical iff its through-path equals L
 *      (within sub-day rounding).
 */
export function useCriticalPath(opts: {
  tasks: Task[];
  dependencies: Dependency[];
  enabled: boolean;
}): Set<TaskId> {
  return useMemo(() => {
    const empty = new Set<TaskId>();
    if (!opts.enabled || opts.tasks.length === 0) return empty;

    const ids = new Set(opts.tasks.map((t) => t.id));
    const duration = new Map<TaskId, number>();
    for (const t of opts.tasks) {
      const d = Math.max(0, (t.end.getTime() - t.start.getTime()) / MS_PER_DAY);
      duration.set(t.id, d);
    }

    const succs = new Map<TaskId, { to: TaskId; lag: number }[]>();
    const preds = new Map<TaskId, { from: TaskId; lag: number }[]>();
    for (const id of ids) {
      succs.set(id, []);
      preds.set(id, []);
    }
    for (const dep of opts.dependencies) {
      if (!ids.has(dep.from) || !ids.has(dep.to)) continue;
      const lag = dep.lag ?? 0;
      succs.get(dep.from)!.push({ to: dep.to, lag });
      preds.get(dep.to)!.push({ from: dep.from, lag });
    }

    // Kahn topological order (also gives cycle detection).
    const indeg = new Map<TaskId, number>();
    for (const id of ids) indeg.set(id, preds.get(id)!.length);
    const queue: TaskId[] = [];
    for (const [id, n] of indeg) if (n === 0) queue.push(id);
    const topo: TaskId[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      topo.push(id);
      for (const e of succs.get(id) ?? []) {
        const nd = (indeg.get(e.to) ?? 0) - 1;
        indeg.set(e.to, nd);
        if (nd === 0) queue.push(e.to);
      }
    }
    if (topo.length !== ids.size) return empty; // cycle present

    const lengthFromStart = new Map<TaskId, number>();
    for (const id of topo) {
      let best = 0;
      for (const e of preds.get(id) ?? []) {
        const v = (lengthFromStart.get(e.from) ?? 0) + e.lag;
        if (v > best) best = v;
      }
      lengthFromStart.set(id, best + (duration.get(id) ?? 0));
    }

    const lengthToEnd = new Map<TaskId, number>();
    for (let i = topo.length - 1; i >= 0; i--) {
      const id = topo[i];
      let bestSucc = 0;
      for (const e of succs.get(id) ?? []) {
        const v = e.lag + (lengthToEnd.get(e.to) ?? 0);
        if (v > bestSucc) bestSucc = v;
      }
      lengthToEnd.set(id, (duration.get(id) ?? 0) + bestSucc);
    }

    let projectLength = 0;
    for (const id of ids) {
      const through = (lengthFromStart.get(id) ?? 0) + (lengthToEnd.get(id) ?? 0) - (duration.get(id) ?? 0);
      if (through > projectLength) projectLength = through;
    }
    if (projectLength <= 0) return empty;

    const critical = new Set<TaskId>();
    const EPS = 1e-6;
    for (const id of ids) {
      const through = (lengthFromStart.get(id) ?? 0) + (lengthToEnd.get(id) ?? 0) - (duration.get(id) ?? 0);
      if (Math.abs(through - projectLength) <= EPS) critical.add(id);
    }
    return critical;
  }, [opts.tasks, opts.dependencies, opts.enabled]);
}
