'use client';
import { cn } from '@/libs/utils/cn';
import type { Task } from '../types';
import { BAR_HEIGHT, ROW_HEIGHT } from '../types';
import { diffDays } from '../hooks/useTimelineScale';

type GroupBarProps = {
  task: Task;
  rangeStart: Date;
  pixelsPerDay: number;
  rowIndex: number;
  isCritical?: boolean;
  isFocused?: boolean;
  onHoverEnter?: (e: React.PointerEvent<HTMLElement>, taskId: string) => void;
  onHoverLeave?: (e: React.PointerEvent<HTMLElement>, taskId: string) => void;
};

const SPINE = 5;   // thickness of the horizontal rollup line
const TIP_H = 7;   // downward tip height
const TIP_W = 7;   // half-width of each end tip

/**
 * Summary / rollup bar for `isGroup: true` tasks. Renders as a thick spine
 * with downward triangle tips at each end — the conventional "this is a
 * summary, not assignable work" Gantt shape. Pure visual: dragging a
 * summary moves the whole subtree, which is out of M2 scope, so the bar
 * does not expose pointer handles. Still hoverable for the tooltip.
 */
export function GroupBar({
  task,
  rangeStart,
  pixelsPerDay,
  rowIndex,
  isCritical,
  isFocused,
  onHoverEnter,
  onHoverLeave,
}: GroupBarProps) {
  const startOffsetDays = diffDays(rangeStart, task.start);
  const durationDays    = Math.max(1, diffDays(task.start, task.end));
  const left  = startOffsetDays * pixelsPerDay;
  const width = durationDays    * pixelsPerDay;
  const top   = rowIndex * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;

  const color = isCritical ? 'fill-error' : 'fill-text-primary';

  return (
    <div
      role="gridcell"
      aria-label={`Group ${task.name}: ${task.start.toDateString()} to ${task.end.toDateString()}`}
      id={`gantt-bar-${task.id}`}
      data-task-id={task.id}
      className={cn(
        'gantt-group-bar absolute select-none',
        isFocused && 'ring-2 ring-border-focus rounded z-10',
      )}
      style={{ left, width, top, height: BAR_HEIGHT }}
      onPointerEnter={onHoverEnter ? (e) => onHoverEnter(e, task.id) : undefined}
      onPointerLeave={onHoverLeave ? (e) => onHoverLeave(e, task.id) : undefined}
    >
      <svg
        aria-hidden="true"
        width={width}
        height={BAR_HEIGHT}
        viewBox={`0 0 ${width} ${BAR_HEIGHT}`}
        className="overflow-visible"
      >
        {/* Spine */}
        <rect x={0} y={4} width={width} height={SPINE} className={color} />
        {/* Left tip — triangle pointing down */}
        <polygon points={`0,${4 + SPINE} ${TIP_W * 2},${4 + SPINE} ${TIP_W},${4 + SPINE + TIP_H}`} className={color} />
        {/* Right tip */}
        <polygon
          points={`${width - TIP_W * 2},${4 + SPINE} ${width},${4 + SPINE} ${width - TIP_W},${4 + SPINE + TIP_H}`}
          className={color}
        />
      </svg>
      {/* Label sits above the spine — keeps the rollup readable when wide */}
      <span
        className={cn(
          'absolute top-0 left-0 right-0 px-1 text-[10px] font-semibold leading-none truncate pointer-events-none',
          isCritical ? 'text-error' : 'text-text-primary',
        )}
      >
        {task.name}
      </span>
    </div>
  );
}
