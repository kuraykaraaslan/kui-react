'use client';
import { useMemo, useState, useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { GanttProps, Task, TaskId, TimeUnit } from './types';
import { DEFAULT_MESSAGES, ROW_HEIGHT } from './types';
import { useTimelineScale } from './hooks/useTimelineScale';
import { useScroll } from './hooks/useScroll';
import { useZoom } from './hooks/useZoom';
import { TaskListSide } from './parts/TaskListSide';
import { TimelineHeader } from './parts/TimelineHeader';
import { TaskBar } from './parts/TaskBar';
import { TodayLine } from './parts/TodayLine';

export type {
  GanttProps,
  Task,
  Dependency,
  Baseline,
  TimeUnit,
  GanttMessages,
  GanttTelemetry,
  TaskId,
} from './types';

const SCALES: TimeUnit[] = ['day', 'week', 'month', 'quarter', 'year'];

/**
 * Build a depth-first flat row list from the parent/child tree. Roots are
 * any task without a parentId (or with a parentId that does not resolve).
 */
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
    const children = byParent.get(parentKey) ?? [];
    for (const child of children) {
      const hasChildren = (byParent.get(child.id) ?? []).length > 0;
      out.push({ task: child, depth, hasChildren });
      if (hasChildren && !collapsed.has(child.id)) {
        walk(child.id, depth + 1);
      }
    }
  }
  walk(undefined, 0);
  return out;
}

export function Gantt({
  tasks,
  // dependencies (TODO M2 stub — accepted but not rendered).
  dependencies: _dependencies,
  // baselines (TODO M4 stub).
  baselines: _baselines,
  scale: scaleProp,
  // workingDays / holidays (TODO M5 stub).
  workingDays: _workingDays,
  holidays: _holidays,
  // criticalPath toggle (TODO M3 stub).
  criticalPath: _criticalPath,
  // onTaskUpdate / onDependency* (TODO M2 stubs).
  onTaskUpdate: _onTaskUpdate,
  onDependencyCreate: _onDependencyCreate,
  onDependencyDelete: _onDependencyDelete,
  // exportFormats (TODO M5 stub).
  exportFormats: _exportFormats,
  messages: messageOverrides,
  // reducedMotion (TODO M6 stub).
  reducedMotion: _reducedMotion,
  onTelemetry,
  ariaLabel = 'Gantt chart',
  className,
}: GanttProps) {
  const messages = useMemo(
    () => ({ ...DEFAULT_MESSAGES, ...(messageOverrides ?? {}) }),
    [messageOverrides],
  );

  const { scale, setScale } = useZoom(scaleProp ?? 'week');
  // If the parent controls `scale` we forward changes, otherwise local state
  // alone drives it. The check stays cheap for an M1 surface.
  const effectiveScale: TimeUnit = scaleProp ?? scale;

  const timeline = useTimelineScale(tasks, effectiveScale);

  // Seed collapsed state from any task with `collapsed: true` (one-shot).
  const [collapsed, setCollapsed] = useState<Set<TaskId>>(() => {
    const s = new Set<TaskId>();
    for (const t of tasks) if (t.collapsed) s.add(t.id);
    return s;
  });

  const onToggleCollapse = useCallback((id: TaskId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onTelemetry?.({ kind: 'task-toggle', taskId: id, collapsed: !prev.has(id) });
      return next;
    });
  }, [onTelemetry]);

  const flatRows = useMemo(() => flattenTree(tasks, collapsed), [tasks, collapsed]);

  const onScaleChange = useCallback((s: TimeUnit) => {
    setScale(s);
    onTelemetry?.({ kind: 'scale-change', scale: s });
  }, [setScale, onTelemetry]);

  const { sideRef, timelineRef, headerRef, onTimelineScroll, onSideScroll } = useScroll();

  const totalHeight = flatRows.length * ROW_HEIGHT;

  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      aria-rowcount={flatRows.length + 1}
      aria-colcount={timeline.columns.length}
      className={cn(
        'gantt-root w-full flex flex-col rounded-lg border border-border bg-surface-base overflow-hidden',
        className,
      )}
    >
      {/* Toolbar: scale switcher + today label */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-border bg-surface-raised">
        <div className="flex items-center gap-2 text-text-primary">
          <FontAwesomeIcon icon={faCalendar} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
          <h2 className="text-sm font-semibold">
            {messages.today}: <span className="tabular-nums font-normal text-text-secondary">{new Date().toLocaleDateString()}</span>
          </h2>
        </div>
        <div
          role="tablist"
          aria-label="Timeline scale"
          className="inline-flex items-center rounded-md border border-border bg-surface-base p-0.5"
        >
          {SCALES.map((s) => {
            const active = s === effectiveScale;
            const label = ({
              day: messages.scaleDay,
              week: messages.scaleWeek,
              month: messages.scaleMonth,
              quarter: messages.scaleQuarter,
              year: messages.scaleYear,
            } as const)[s];
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onScaleChange(s)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                  active
                    ? 'bg-primary text-primary-fg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        {/*
          TODO M5: export menu (PNG / PDF / CSV).
          TODO M3: critical-path toggle button.
          TODO M6: zoom + / − keyboard hints.
        */}
      </div>

      {/* Body: side WBS + timeline area. Fixed max-height keeps it scrollable. */}
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
            onToggleCollapse={onToggleCollapse}
            messages={messages}
            totalHeight={totalHeight}
          />
        </div>

        {/* Right: timeline area — sticky header + scrollable body */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Sticky header (horizontal scroll mirrors body via headerRef) */}
          <div
            ref={headerRef}
            className="overflow-hidden border-b border-border"
            // The body owns scroll; we just mirror its scrollLeft here.
          >
            <TimelineHeader scale={timeline} />
          </div>
          {/* Scrollable body */}
          <div
            ref={timelineRef}
            onScroll={onTimelineScroll}
            className="relative flex-1 overflow-auto"
          >
            <div
              className="relative"
              style={{ width: timeline.totalWidth, height: totalHeight }}
            >
              {/* Row backgrounds — alternate tint for readability. */}
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
              {/* Today line */}
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
                />
              ))}
              {/*
                TODO M2: <DependencyArrow /> overlay <svg> sized to totalWidth x totalHeight.
                TODO M4: <BaselineGhost /> per task with a baseline entry.
                TODO M3: <HoverTooltip /> portal.
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
