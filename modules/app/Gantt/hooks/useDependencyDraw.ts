'use client';
// TODO M2: drag from a bar-end handle to another bar to create a dependency.
// Returns the in-flight ghost path + pointer-up commit. M1 stub keeps the
// import graph stable.
import type { Dependency } from '../types';

export type UseDependencyDrawApi = {
  ghostPath: string | null;
  beginFromTask: (taskId: string) => void;
};

export function useDependencyDraw(_opts: {
  dependencies?: Dependency[];
  onDependencyCreate?: (dep: Dependency) => Promise<void> | void;
}): UseDependencyDrawApi {
  return {
    ghostPath: null,
    beginFromTask: () => {
      // TODO M2: pointermove -> rubber-band Bezier, pointerup -> resolve target.
    },
  };
}
