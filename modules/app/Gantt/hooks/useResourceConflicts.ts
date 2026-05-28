'use client';
import { useMemo } from 'react';
import type { Task, TaskId } from '../types';

/**
 * Detect resource over-allocation: tasks that share an `owner` and overlap
 * in time. Group rollup rows (`isGroup: true`) and milestone tasks are
 * excluded since they don't represent assignable work. Returns the set of
 * task ids that have at least one conflicting peer.
 */
export function useResourceConflicts(tasks: Task[]): Set<TaskId> {
  return useMemo(() => {
    const out = new Set<TaskId>();
    const byOwner = new Map<string, Task[]>();
    for (const t of tasks) {
      if (!t.owner || t.isGroup || t.isMilestone) continue;
      const arr = byOwner.get(t.owner) ?? [];
      arr.push(t);
      byOwner.set(t.owner, arr);
    }
    for (const list of byOwner.values()) {
      if (list.length < 2) continue;
      const sorted = list.slice().sort((a, b) => a.start.getTime() - b.start.getTime());
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          if (sorted[j].start.getTime() >= sorted[i].end.getTime()) break;
          out.add(sorted[i].id);
          out.add(sorted[j].id);
        }
      }
    }
    return out;
  }, [tasks]);
}
