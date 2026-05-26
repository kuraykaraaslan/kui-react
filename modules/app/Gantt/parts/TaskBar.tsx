'use client';
import { cn } from '@/libs/utils/cn';
import type { Task } from '../types';
import { BAR_HEIGHT, ROW_HEIGHT } from '../types';
import { diffDays } from '../hooks/useTimelineScale';

type TaskBarProps = {
  task: Task;
  rangeStart: Date;
  pixelsPerDay: number;
  rowIndex: number;
};

/**
 * Single task bar — absolutely positioned inside the timeline body.
 * The progress fill is rendered as a darker `bg-primary` overlay on top of
 * the `bg-primary-subtle` track, clipped via `width: <progress>%`.
 */
export function TaskBar({ task, rangeStart, pixelsPerDay, rowIndex }: TaskBarProps) {
  const startOffsetDays = diffDays(rangeStart, task.start);
  const durationDays    = Math.max(1, diffDays(task.start, task.end));
  const left  = startOffsetDays * pixelsPerDay;
  const width = durationDays    * pixelsPerDay;
  const top   = (rowIndex * ROW_HEIGHT) + (ROW_HEIGHT - BAR_HEIGHT) / 2;
  const progress = Math.max(0, Math.min(100, task.progress ?? 0));

  return (
    <div
      role="gridcell"
      aria-label={`${task.name}: ${task.start.toDateString()} to ${task.end.toDateString()}, ${progress}% complete`}
      className={cn(
        'gantt-task-bar absolute rounded-md overflow-hidden',
        'bg-primary-subtle border border-primary/40',
        'shadow-sm select-none',
        // TODO M3: when task.critical -> red border + warning fill.
      )}
      style={{ left, width, top, height: BAR_HEIGHT }}
      data-task-id={task.id}
    >
      {/* Progress fill */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-primary"
        style={{ width: `${progress}%` }}
      />
      {/* Label */}
      <div className="relative h-full flex items-center px-2 text-[11px] font-medium text-text-primary truncate">
        <span className="truncate">{task.name}</span>
        <span className="ml-auto pl-2 tabular-nums text-text-secondary">
          {progress}%
        </span>
      </div>
      {/*
        TODO M2: resize handles on left + right edges; drag handle to move;
        progress thumb on the boundary between filled and unfilled.
      */}
    </div>
  );
}
