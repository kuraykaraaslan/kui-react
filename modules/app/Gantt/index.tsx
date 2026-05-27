'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import type { GanttProps } from './types';
import { DEFAULT_MESSAGES } from './types';
import { createGanttStore, GanttStoreProvider } from './store';
import { GanttToolbar } from './parts/GanttToolbar';
import { GanttBody } from './parts/GanttBody';

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
  // baselines (TODO M4 stub).
  baselines: _baselines,
  scale,
  // workingDays / holidays (TODO M5 stub).
  workingDays: _workingDays,
  holidays: _holidays,
  criticalPath,
  onTaskUpdate,
  onDependencyCreate,
  onDependencyDelete,
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
        role="grid"
        aria-label={ariaLabel}
        className={cn(
          'gantt-root w-full flex flex-col rounded-lg border border-border bg-surface-base overflow-hidden',
          className,
        )}
      >
        <GanttToolbar
          messages={messages}
          controlledScale={scale}
          showCriticalPathToggle
        />
        <GanttBody
          messages={messages}
          controlledScale={scale}
          onTaskUpdate={onTaskUpdate}
          onDependencyCreate={onDependencyCreate}
          onDependencyDelete={onDependencyDelete}
        />
      </div>
    </GanttStoreProvider>
  );
}
