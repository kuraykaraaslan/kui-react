'use client';
import { useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import type { Dependency, GanttMessages, Task, TaskId, TimeUnit } from '../types';
import { ROW_HEIGHT } from '../types';
import { useTimelineScale } from '../hooks/useTimelineScale';
import { useScroll } from '../hooks/useScroll';
import { useTaskDrag } from '../hooks/useTaskDrag';
import { useDependencyDraw } from '../hooks/useDependencyDraw';
import { useGanttStore } from '../store';
import { TaskListSide } from './TaskListSide';
import { TimelineHeader } from './TimelineHeader';
import { TaskBar } from './TaskBar';
import { TodayLine } from './TodayLine';
import { DependencyLayer } from './DependencyLayer';

/** Depth-first flatten of the parent/child tree, skipping collapsed subtrees. */
function flattenTree(
  tasks: Task[],
  collapsed: Set<TaskId>,
): { task: Task; depth: number; hasChildren: boolean }[] {
  const byParent = new Map<TaskId | undefined, Task[]>();
  const ids = new Set(tasks.map((t) => t.id));
  for (const t of tasks) {
    const key = t.parentId && ids.has(t.parentId) ? t.parentId : undefined;
    const arr = byParent.get(key) ?? [];
    arr.push(t);
    byParent.set(key, arr);
  }
  const out: { task: Task; depth: number; hasChildren: boolean }[] = [];
  function walk(parentKey: TaskId | undefined, depth: number) {
    for (const child of byParent.get(parentKey) ?? []) {
      const hasChildren = (byParent.get(child.id) ?? []).length > 0;
      out.push({ task: child, depth, hasChildren });
      if (hasChildren && !collapsed.has(child.id)) walk(child.id, depth + 1);
    }
  }
  walk(undefined, 0);
  return out;
}

type GanttBodyProps = {
  messages: GanttMessages;
  controlledScale?: TimeUnit;
  onTaskUpdate?: (task: Task) => Promise<void> | void;
  onDependencyCreate?: (dep: Dependency) => Promise<void> | void;
  onDependencyDelete?: (id: string) => Promise<void> | void;
};

export function GanttBody({
  messages,
  controlledScale,
  onTaskUpdate,
  onDependencyCreate,
  onDependencyDelete,
}: GanttBodyProps) {
  const storeScale   = useGanttStore((s) => s.scale);
  const collapsed    = useGanttStore((s) => s.collapsed);
  const workingTasks = useGanttStore((s) => s.workingTasks);
  const drag         = useGanttStore((s) => s.drag);
  const depDraw      = useGanttStore((s) => s.depDraw);
  const toggleCollapse = useGanttStore((s) => s.toggleCollapse);

  const effectiveScale = controlledScale ?? storeScale;
  const timeline = useTimelineScale(workingTasks, effectiveScale);
  const { sideRef, timelineRef, headerRef, onTimelineScroll, onSideScroll } = useScroll();

  // Apply in-flight drag preview to the dragged task only.
  const tasksToRender: Task[] = useMemo(() => {
    if (!drag) return workingTasks;
    return workingTasks.map((t) => {
      if (t.id !== drag.taskId) return t;
      const msPerDay = 86400000;
      switch (drag.mode) {
        case 'move':
          return {
            ...t,
            start: new Date(drag.originStart.getTime() + drag.deltaDays * msPerDay),
            end:   new Date(drag.originEnd.getTime()   + drag.deltaDays * msPerDay),
          };
        case 'resize-start': {
          const next = new Date(drag.originStart.getTime() + drag.deltaDays * msPerDay);
          return { ...t, start: next.getTime() >= drag.originEnd.getTime() ? new Date(drag.originEnd.getTime() - msPerDay) : next, end: drag.originEnd };
        }
        case 'resize-end': {
          const next = new Date(drag.originEnd.getTime() + drag.deltaDays * msPerDay);
          return { ...t, start: drag.originStart, end: next.getTime() <= drag.originStart.getTime() ? new Date(drag.originStart.getTime() + msPerDay) : next };
        }
        case 'progress':
          return { ...t, progress: drag.progressOverride ?? t.progress };
      }
    });
  }, [drag, workingTasks]);

  const flatRows = useMemo(() => flattenTree(tasksToRender, collapsed), [tasksToRender, collapsed]);
  const flatRowIndex = useMemo(() => {
    const m: Record<TaskId, number> = {};
    flatRows.forEach((row, i) => { m[row.task.id] = i; });
    return m;
  }, [flatRows]);

  const { onBarPointerDown } = useTaskDrag({ pixelsPerDay: timeline.pixelsPerDay, onTaskUpdate });
  const { beginFromTask }    = useDependencyDraw({ bodyRef: timelineRef, onDependencyCreate, onDependencyDelete });

  const totalHeight = flatRows.length * ROW_HEIGHT;

  return (
    <div className="flex w-full max-h-[32rem]">
      {/* Left: WBS panel */}
      <div
        ref={sideRef}
        onScroll={onSideScroll}
        className="overflow-y-auto overflow-x-hidden scrollbar-hide"
      >
        <TaskListSide
          flatRows={flatRows}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          messages={messages}
          totalHeight={totalHeight}
        />
      </div>

      {/* Right: timeline area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div ref={headerRef} className="overflow-hidden border-b border-border">
          <TimelineHeader scale={timeline} />
        </div>
        <div
          ref={timelineRef}
          onScroll={onTimelineScroll}
          className="relative flex-1 overflow-auto"
        >
          <div className="relative" style={{ width: timeline.totalWidth, height: totalHeight }}>
            {/* Row backgrounds */}
            {flatRows.map((row, i) => (
              <div
                key={row.task.id}
                aria-hidden="true"
                className={cn(
                  'absolute left-0 right-0 border-b border-border/60',
                  i % 2 === 1 ? 'bg-surface-overlay/40' : 'bg-transparent',
                )}
                style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT, width: timeline.totalWidth }}
              />
            ))}

            <TodayLine
              rangeStart={timeline.rangeStart}
              rangeEnd={timeline.rangeEnd}
              pixelsPerDay={timeline.pixelsPerDay}
              totalHeight={totalHeight}
            />

            {/* Task bars */}
            {flatRows.map((row, i) => (
              <TaskBar
                key={row.task.id}
                task={row.task}
                rangeStart={timeline.rangeStart}
                pixelsPerDay={timeline.pixelsPerDay}
                rowIndex={i}
                isDepHoverTarget={depDraw?.hoverTargetId === row.task.id}
                onMoveDown={(e, id, w) => onBarPointerDown(e, id, 'move', w)}
                onResizeStartDown={(e, id) => onBarPointerDown(e, id, 'resize-start', 0)}
                onResizeEndDown={(e, id) => onBarPointerDown(e, id, 'resize-end', 0)}
                onProgressDown={(e, id, w) => onBarPointerDown(e, id, 'progress', w)}
                onDepSourceDown={(e, id) => beginFromTask(e, id)}
              />
            ))}

            {/* Dependency overlay */}
            <DependencyLayer
              tasks={tasksToRender}
              flatRowIndex={flatRowIndex}
              rangeStart={timeline.rangeStart}
              pixelsPerDay={timeline.pixelsPerDay}
              totalWidth={timeline.totalWidth}
              totalHeight={totalHeight}
            />
            {/*
              TODO M4: <BaselineGhost /> per task with a baseline entry.
              TODO M3: <HoverTooltip /> portal.
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
