'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { DragMode, Task } from '../types';
import { useGanttStoreApi } from '../store';

export type UseTaskDragApi = {
  /** Begin a drag on a task bar. Pass the React pointer event from a handle/region. */
  onBarPointerDown: (
    e: React.PointerEvent<HTMLElement>,
    taskId: string,
    mode: DragMode,
    /** Bar pixel width — required for `progress` mode to translate dx → %. */
    barWidth: number,
  ) => void;
};

export function useTaskDrag(opts: {
  pixelsPerDay: number;
  onTaskUpdate?: (task: Task) => Promise<void> | void;
}): UseTaskDragApi {
  const storeApi = useGanttStoreApi();
  const optsRef = useRef(opts);
  optsRef.current = opts;

  /** Per-drag context — width is needed for the progress mode only. */
  const ctxRef = useRef<{ barWidth: number } | null>(null);

  // Global listeners are attached once and read live state from the store.
  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const drag = storeApi.getState().drag;
      if (!drag) return;
      const dx = e.clientX - drag.pointerStartX;
      const ppd = optsRef.current.pixelsPerDay;
      if (drag.mode === 'progress') {
        const barWidth = ctxRef.current?.barWidth ?? 100;
        const deltaPct = (dx / barWidth) * 100;
        const next = Math.max(0, Math.min(100, drag.originProgress + deltaPct));
        storeApi.getState().updateDrag(0, next);
      } else {
        const deltaDays = Math.round(dx / ppd);
        storeApi.getState().updateDrag(deltaDays, null);
      }
    }

    async function onPointerUp() {
      const drag = storeApi.getState().drag;
      if (!drag) return;
      const snapshot = storeApi.getState().workingTasks.find((t) => t.id === drag.taskId) ?? null;
      const updated = storeApi.getState().commitDrag();
      ctxRef.current = null;
      if (!updated) return;
      try {
        await optsRef.current.onTaskUpdate?.(updated);
      } catch {
        // Rollback to the pre-commit snapshot.
        if (snapshot) {
          const tasks = storeApi.getState().workingTasks.slice();
          const idx = tasks.findIndex((t) => t.id === snapshot.id);
          if (idx !== -1) tasks[idx] = snapshot;
          storeApi.setState({ workingTasks: tasks });
        }
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (!storeApi.getState().drag) return;
      storeApi.getState().cancelDrag();
      ctxRef.current = null;
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [storeApi]);

  const onBarPointerDown = useCallback(
    (
      e: React.PointerEvent<HTMLElement>,
      taskId: string,
      mode: DragMode,
      barWidth: number,
    ) => {
      // Only respond to primary-button pointer downs.
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      ctxRef.current = { barWidth };
      storeApi.getState().beginDrag(taskId, mode, e.clientX);
    },
    [storeApi],
  );

  return { onBarPointerDown };
}
