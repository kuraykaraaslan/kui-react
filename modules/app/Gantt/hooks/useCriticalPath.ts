'use client';
// TODO M3: implement CPM (Critical Path Method) — forward + backward pass,
// slack = LS - ES, critical = slack === 0. Returns the set of critical task
// ids. M1 stub keeps the import graph stable.
import type { Dependency, Task, TaskId } from '../types';

export function useCriticalPath(
  _tasks: Task[],
  _dependencies?: Dependency[],
): Set<TaskId> {
  // TODO M3: cycle detection + topological sort + forward/backward pass.
  return new Set<TaskId>();
}
