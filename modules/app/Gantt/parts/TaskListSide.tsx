'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import type { Task, TaskId, GanttMessages } from '../types';
import { ROW_HEIGHT, SIDE_PANEL_WIDTH } from '../types';

type FlatRow = {
  task: Task;
  depth: number;
  hasChildren: boolean;
};

type TaskListSideProps = {
  flatRows: FlatRow[];
  collapsed: Set<TaskId>;
  onToggleCollapse: (id: TaskId) => void;
  messages: GanttMessages;
  totalHeight: number;
};

/**
 * Left WBS (Work Breakdown Structure) panel. Renders a flat list driven by
 * the parent component's tree traversal so collapsed branches simply omit
 * their descendants. Each row is `aria-rowindex`-tagged for the grid.
 */
export function TaskListSide({
  flatRows,
  collapsed,
  onToggleCollapse,
  messages,
  totalHeight,
}: TaskListSideProps) {
  return (
    <div
      className="gantt-task-side shrink-0 border-r border-border bg-surface-base"
      style={{ width: SIDE_PANEL_WIDTH }}
    >
      {/* Column header — height MUST match TimelineHeader (h-12 / 48px). */}
      <div
        role="row"
        aria-rowindex={1}
        className="flex h-12 items-center px-3 border-b border-border bg-surface-raised text-xs font-semibold text-text-secondary uppercase tracking-wide"
      >
        <span className="flex-1 truncate">{messages.taskColumn}</span>
        <span className="w-24 truncate">{messages.ownerColumn}</span>
        <span className="w-10 text-right tabular-nums">{messages.progressColumn}</span>
      </div>
      {/* Rows */}
      <div style={{ minHeight: totalHeight }}>
        {flatRows.map((row, i) => {
          const { task, depth, hasChildren } = row;
          const isCollapsed = collapsed.has(task.id);
          const progress = Math.max(0, Math.min(100, task.progress ?? 0));
          return (
            <div
              key={task.id}
              role="row"
              aria-rowindex={i + 2}
              className={cn(
                'flex items-center px-3 border-b border-border/60 text-sm',
                'hover:bg-surface-overlay transition-colors',
              )}
              style={{ height: ROW_HEIGHT }}
            >
              {/* Indent + expand chevron */}
              <div className="flex items-center flex-1 min-w-0" style={{ paddingLeft: depth * 16 }}>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => onToggleCollapse(task.id)}
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? `Expand ${task.name}` : `Collapse ${task.name}`}
                    className={cn(
                      'inline-flex items-center justify-center w-5 h-5 mr-1 rounded',
                      'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    )}
                  >
                    <FontAwesomeIcon
                      icon={isCollapsed ? faChevronRight : faChevronDown}
                      className="w-3 h-3"
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <span className="inline-block w-5 mr-1" aria-hidden="true" />
                )}
                {/* Milestone glyph stub (TODO M4 — diamond marker). */}
                {task.isMilestone && (
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="w-3 h-3 mr-1.5 text-text-secondary"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    'truncate',
                    task.isGroup ? 'font-semibold text-text-primary' : 'text-text-primary',
                  )}
                  title={task.name}
                >
                  {task.name}
                </span>
              </div>
              <span className="w-24 truncate text-xs text-text-secondary" title={task.owner ?? ''}>
                {task.owner ?? '—'}
              </span>
              <span className="w-10 text-right text-xs tabular-nums text-text-secondary">
                {progress}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
