// Type definitions for the Gantt module. See PLAN.MD for milestone history.

export type TaskId = string;

/** Available scale levels for the timeline header. */
export type TimeUnit = 'day' | 'week' | 'month' | 'quarter' | 'year';

/** Single task / group / milestone row. */
export type Task = {
  id: TaskId;
  name: string;
  start: Date;
  end: Date;
  /** Completion percentage [0..100]. */
  progress?: number;
  /** Optional owner / assignee shown in the left WBS panel. */
  owner?: string;
  /** Parent task id — used to build the WBS tree. */
  parentId?: TaskId;
  /** Render as a milestone diamond instead of a bar. */
  isMilestone?: boolean;
  /** Render as a summary / group rollup row (M4.5 future: bracketed bar shape). */
  isGroup?: boolean;
  /** Collapsed state for group rows (controlled or initial). */
  collapsed?: boolean;
  /** Mark as critical (overrides the computed CPM result for this task). */
  critical?: boolean;
  /** Caller-defined opaque payload. */
  data?: unknown;
};

/** Dependency between two tasks. */
export type Dependency = {
  id: string;
  from: TaskId;
  to: TaskId;
  /** Finish-to-Start / Start-to-Start / Finish-to-Finish / Start-to-Finish. */
  type?: 'FS' | 'SS' | 'FF' | 'SF';
  /** Lag in days (positive) or lead (negative). */
  lag?: number;
};

/** Planned vs actual ghost strip rendered beneath the bar. */
export type Baseline = {
  taskId: TaskId;
  start: Date;
  end: Date;
};

/** Localised strings. */
export type GanttMessages = {
  today: string;
  scaleDay: string;
  scaleWeek: string;
  scaleMonth: string;
  scaleQuarter: string;
  scaleYear: string;
  taskColumn: string;
  ownerColumn: string;
  progressColumn: string;
};

/** Telemetry events emitted via `onTelemetry`. */
export type GanttTelemetry =
  | { kind: 'scale-change'; scale: TimeUnit }
  | { kind: 'task-toggle'; taskId: TaskId; collapsed: boolean }
  | { kind: 'task-drag-commit'; taskId: TaskId; mode: DragMode }
  | { kind: 'dependency-create'; dependencyId: string }
  | { kind: 'dependency-delete'; dependencyId: string };

/** Drag modes for a task bar. */
export type DragMode = 'move' | 'resize-start' | 'resize-end' | 'progress';

/** Active drag-in-progress snapshot. */
export type DragState = {
  taskId: TaskId;
  mode: DragMode;
  pointerStartX: number;
  originStart: Date;
  originEnd: Date;
  originProgress: number;
  /** Days moved since pointerdown — used by render to translate the bar. */
  deltaDays: number;
  /** Progress delta for `progress` mode (0..100 absolute). */
  progressOverride: number | null;
};

/** Active dependency-draw rubber-band snapshot. */
export type DepDrawState = {
  sourceId: TaskId;
  /** Pointer position in timeline-content coordinates (px from left/top of body). */
  x: number;
  y: number;
  /** Task currently under the pointer, if any. */
  hoverTargetId: TaskId | null;
};

export type GanttProps = {
  tasks: Task[];
  /** Drawn as arrows on the overlay; consumers can edit via `onDependencyCreate / onDependencyDelete`. */
  dependencies?: Dependency[];
  /** Planned-vs-actual ghost strips beneath the affected bars. */
  baselines?: Baseline[];
  /** Current scale level. Defaults to 'week'. */
  scale?: TimeUnit;
  /** Working-day indices, 0=Sun … 6=Sat. Drives weekend shading + drag snap. */
  workingDays?: number[];
  /** Holiday dates excluded from the working calendar (shading + drag snap). */
  holidays?: Date[];
  /** Initial state for the critical-path toggle in the toolbar. */
  criticalPath?: boolean;
  /** Async task update callback (drag/resize). */
  onTaskUpdate?: (task: Task) => Promise<void> | void;
  /** Async dependency creation callback. */
  onDependencyCreate?: (dep: Dependency) => Promise<void> | void;
  /** Async dependency deletion callback. */
  onDependencyDelete?: (id: string) => Promise<void> | void;
  /** Enabled export formats — populates the toolbar Export menu. */
  exportFormats?: ('png' | 'pdf' | 'csv')[];
  /** i18n string overrides. */
  messages?: Partial<GanttMessages>;
  /** BCP-47 locale for date headers + tooltip (default = browser locale). */
  locale?: string;
  /** Force-on reduced motion regardless of `prefers-reduced-motion`. */
  reducedMotion?: boolean;
  /** Telemetry hook — receives drag/toggle/scale-change events. */
  onTelemetry?: (event: GanttTelemetry) => void;
  /** Optional ARIA label for the root grid. */
  ariaLabel?: string;
  className?: string;
};

/** Default messages used when `messages` prop is omitted. */
export const DEFAULT_MESSAGES: GanttMessages = {
  today: 'Today',
  scaleDay: 'Day',
  scaleWeek: 'Week',
  scaleMonth: 'Month',
  scaleQuarter: 'Quarter',
  scaleYear: 'Year',
  taskColumn: 'Task',
  ownerColumn: 'Owner',
  progressColumn: '%',
};

/** Pixels per day for each scale level. Drives horizontal layout. */
export const PIXELS_PER_DAY: Record<TimeUnit, number> = {
  day:     32,
  week:    14,
  month:   6,
  quarter: 2.5,
  year:    1.2,
};

/** Bar height in px — must match EJS partial. */
export const BAR_HEIGHT = 24;
/** Row height in px (bar + vertical gutters). */
export const ROW_HEIGHT = 36;
/** Width of the left WBS panel in px. */
export const SIDE_PANEL_WIDTH = 320;
