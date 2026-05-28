'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import type { GanttProps } from './types';
import { DEFAULT_MESSAGES } from './types';
import { createGanttStore, GanttStoreProvider } from './store';
import { GanttToolbar } from './parts/GanttToolbar';
import { GanttBody } from './parts/GanttBody';
import { useExport } from './hooks/useExport';
import { useReducedMotion } from './hooks/useReducedMotion';

export type {
  GanttProps,
  Task,
  Dependency,
  Baseline,
  TimeUnit,
  GanttMessages,
  GanttTelemetry,
  TaskId,
  DragMode,
} from './types';

export function Gantt({
  tasks,
  dependencies,
  baselines,
  scale,
  workingDays,
  holidays,
  criticalPath,
  onTaskUpdate,
  onDependencyCreate,
  onDependencyDelete,
  exportFormats,
  messages: messageOverrides,
  locale,
  reducedMotion,
  onTelemetry,
  ariaLabel = 'Gantt chart',
  className,
}: GanttProps) {
  const motionReduced = useReducedMotion(reducedMotion);
  const messages = useMemo(
    () => ({ ...DEFAULT_MESSAGES, ...(messageOverrides ?? {}) }),
    [messageOverrides],
  );

  const onTelemetryRef = useRef(onTelemetry);
  useEffect(() => { onTelemetryRef.current = onTelemetry; });

  const [store] = useState(() =>
    createGanttStore({
      tasks,
      dependencies: dependencies ?? [],
      scale: scale ?? 'week',
      criticalPath: criticalPath ?? false,
      onTelemetry: (e) => onTelemetryRef.current?.(e),
    }),
  );

  const contentRef = useRef<HTMLDivElement | null>(null);
  const { run: handleExport } = useExport({
    tasks,
    dependencies: dependencies ?? [],
    contentRef,
  });

  // Seed back into the store whenever the controlled inputs change.
  useEffect(() => { store.getState().seedTasks(tasks); }, [tasks, store]);
  useEffect(() => { store.getState().seedDependencies(dependencies ?? []); }, [dependencies, store]);
  useEffect(() => {
    if (scale && scale !== store.getState().scale) store.setState({ scale });
  }, [scale, store]);
  useEffect(() => {
    if (typeof criticalPath === 'boolean' && criticalPath !== store.getState().criticalPath) {
      store.setState({ criticalPath });
    }
  }, [criticalPath, store]);

  return (
    <GanttStoreProvider store={store}>
      <div
        ref={contentRef}
        role="grid"
        aria-label={ariaLabel}
        className={cn(
          'gantt-root w-full flex flex-col rounded-lg border border-border bg-surface-base overflow-hidden',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          motionReduced && '[&_*]:!transition-none [&_*]:!animation-none',
          className,
        )}
        data-reduced-motion={motionReduced ? 'true' : undefined}
      >
        <GanttToolbar
          messages={messages}
          controlledScale={scale}
          showCriticalPathToggle
          exportFormats={exportFormats}
          onExport={handleExport}
        />
        <GanttBody
          messages={messages}
          controlledScale={scale}
          baselines={baselines}
          workingDays={workingDays}
          holidays={holidays}
          locale={locale}
          reducedMotion={motionReduced}
          onTaskUpdate={onTaskUpdate}
          onDependencyCreate={onDependencyCreate}
          onDependencyDelete={onDependencyDelete}
        />
      </div>
    </GanttStoreProvider>
  );
}
