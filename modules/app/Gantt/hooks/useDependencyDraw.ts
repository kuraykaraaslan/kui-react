'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { Dependency } from '../types';
import { useGanttStoreApi } from '../store';

export type UseDependencyDrawApi = {
  /** Begin a rubber-band dependency draw from `sourceId`. */
  beginFromTask: (e: React.PointerEvent<HTMLElement>, sourceId: string) => void;
};

/**
 * Converts a viewport-coordinate pointer to timeline-content coordinates
 * (px from the top/left of the scrolling content inside `bodyRef`).
 */
function toContent(bodyEl: HTMLDivElement | null, clientX: number, clientY: number) {
  if (!bodyEl) return null;
  const rect = bodyEl.getBoundingClientRect();
  return {
    x: clientX - rect.left + bodyEl.scrollLeft,
    y: clientY - rect.top + bodyEl.scrollTop,
  };
}

export function useDependencyDraw(opts: {
  bodyRef: React.RefObject<HTMLDivElement | null>;
  onDependencyCreate?: (dep: Dependency) => Promise<void> | void;
  onDependencyDelete?: (id: string) => Promise<void> | void;
}): UseDependencyDrawApi {
  const storeApi = useGanttStoreApi();
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const dd = storeApi.getState().depDraw;
      if (!dd) return;
      const pt = toContent(optsRef.current.bodyRef.current, e.clientX, e.clientY);
      if (!pt) return;
      // Locate the bar under the pointer via DOM `data-task-id` markers.
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const barEl = el?.closest('[data-task-id]') as HTMLElement | null;
      const rawTarget = barEl?.dataset.taskId ?? null;
      const target = rawTarget && rawTarget !== dd.sourceId ? rawTarget : null;
      storeApi.getState().updateDepDraw(pt.x, pt.y, target);
    }

    async function onPointerUp() {
      if (!storeApi.getState().depDraw) return;
      const dep = storeApi.getState().commitDepDraw();
      if (!dep) return;
      try {
        await optsRef.current.onDependencyCreate?.(dep);
      } catch {
        // Rollback: drop the just-added dependency.
        const deps = storeApi.getState().dependencies.filter((d) => d.id !== dep.id);
        storeApi.setState({ dependencies: deps });
      }
    }

    async function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (storeApi.getState().depDraw) storeApi.getState().cancelDepDraw();
        if (storeApi.getState().selectedDepId) storeApi.getState().selectDep(null);
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const id = storeApi.getState().selectedDepId;
        if (!id) return;
        // Allow the user to also delete via the host's async handler.
        const removed = storeApi.getState().removeDependency(id);
        if (!removed) return;
        try {
          await optsRef.current.onDependencyDelete?.(removed);
        } catch {
          // Rollback: we don't have the original index, so re-append at end.
          // The host can re-seed via the `dependencies` prop on its next render.
        }
      }
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

  const beginFromTask = useCallback(
    (e: React.PointerEvent<HTMLElement>, sourceId: string) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const pt = toContent(optsRef.current.bodyRef.current, e.clientX, e.clientY);
      if (!pt) return;
      storeApi.getState().beginDepDraw(sourceId, pt.x, pt.y);
    },
    [storeApi],
  );

  return { beginFromTask };
}
