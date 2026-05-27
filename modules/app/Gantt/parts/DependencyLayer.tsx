'use client';
import { useMemo } from 'react';
import type { Task, TaskId } from '../types';
import { BAR_HEIGHT, ROW_HEIGHT } from '../types';
import { diffDays } from '../hooks/useTimelineScale';
import { useGanttStore } from '../store';
import { DependencyArrow } from './DependencyArrow';

type DependencyLayerProps = {
  tasks: Task[];
  flatRowIndex: Record<TaskId, number>;
  rangeStart: Date;
  pixelsPerDay: number;
  totalWidth: number;
  totalHeight: number;
  criticalSet?: Set<TaskId>;
};

/**
 * SVG overlay rendering all dependency arrows + the in-flight rubber-band
 * ghost path. The svg itself is `pointer-events-none`; individual arrows
 * opt in for click selection.
 */
export function DependencyLayer({
  tasks,
  flatRowIndex,
  rangeStart,
  pixelsPerDay,
  totalWidth,
  totalHeight,
  criticalSet,
}: DependencyLayerProps) {
  const dependencies  = useGanttStore((s) => s.dependencies);
  const selectedDepId = useGanttStore((s) => s.selectedDepId);
  const depDraw       = useGanttStore((s) => s.depDraw);
  const selectDep     = useGanttStore((s) => s.selectDep);

  const ghost = useMemo(() => {
    if (!depDraw) return null;
    const sourceTask = tasks.find((t) => t.id === depDraw.sourceId);
    const sourceRow  = flatRowIndex[depDraw.sourceId];
    if (!sourceTask || sourceRow == null) return null;
    const startX = diffDays(rangeStart, sourceTask.end) * pixelsPerDay;
    const startY = sourceRow * ROW_HEIGHT + (ROW_HEIGHT + BAR_HEIGHT) / 2 - BAR_HEIGHT / 2;
    const endX = depDraw.x;
    const endY = depDraw.y;
    // Cubic Bezier with a horizontal handle proportional to dx.
    const dx = Math.max(40, Math.abs(endX - startX) / 2);
    return `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
  }, [depDraw, tasks, flatRowIndex, rangeStart, pixelsPerDay]);

  return (
    <svg
      aria-hidden="true"
      className="absolute left-0 top-0 pointer-events-none"
      width={totalWidth}
      height={totalHeight}
    >
      <defs>
        <marker
          id="gantt-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-text-secondary" />
        </marker>
        <marker
          id="gantt-arrow-active"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary" />
        </marker>
        <marker
          id="gantt-arrow-critical"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-error" />
        </marker>
      </defs>
      {dependencies.map((dep) => {
        const isCritical = !!criticalSet && criticalSet.has(dep.from) && criticalSet.has(dep.to);
        return (
          <DependencyArrow
            key={dep.id}
            dep={dep}
            tasks={tasks}
            rangeStart={rangeStart}
            pixelsPerDay={pixelsPerDay}
            taskRowIndex={flatRowIndex}
            selected={dep.id === selectedDepId}
            isCritical={isCritical}
            onSelect={selectDep}
          />
        );
      })}
      {ghost && (
        <path
          d={ghost}
          fill="none"
          className="stroke-primary/60"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}
    </svg>
  );
}
