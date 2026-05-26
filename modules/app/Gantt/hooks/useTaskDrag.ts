'use client';
// TODO M2: drag-to-schedule — move whole bar, resize start edge, resize end
// edge, drag progress handle. Should snap to day/week and call onTaskUpdate.
// Returning a no-op API for the M1 surface so the public hook signature is
// already in place when M2 lands.
import type { Task } from '../types';

export type UseTaskDragApi = {
  isDragging: boolean;
  onBarPointerDown: (taskId: string, mode: 'move' | 'resize-start' | 'resize-end' | 'progress') => void;
};

export function useTaskDrag(_opts: {
  tasks: Task[];
  pixelsPerDay: number;
  onTaskUpdate?: (task: Task) => Promise<void> | void;
}): UseTaskDragApi {
  return {
    isDragging: false,
    onBarPointerDown: () => {
      // TODO M2: track pointer, translate dx -> days, snap, commit on pointerup.
    },
  };
}
