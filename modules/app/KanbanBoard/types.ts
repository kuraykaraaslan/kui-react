// Type definitions for KanbanBoard (M1 — Core DnD).
// Future milestones extend these without breaking the M1 surface.

export type ColumnId = string;
export type CardId = string;

export type KanbanPriority = 'low' | 'medium' | 'high' | 'urgent';

export type KanbanAssignee = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type KanbanLabel = {
  id: string;
  label: string;
  /** Optional Tailwind classes for the label chip — defaults handled by Card. */
  tone?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
};

export type KanbanCard<T = unknown> = {
  id: CardId;
  columnId: ColumnId;
  title: string;
  description?: string;
  priority?: KanbanPriority;
  labels?: KanbanLabel[];
  assignees?: KanbanAssignee[];
  /** Caller-defined opaque payload (issue link, raw row, etc.). */
  data?: T;
};

export type KanbanColumn<T = unknown> = {
  id: ColumnId;
  title: string;
  /** TODO M2: WIP limit + over-limit visual. */
  wipLimit?: number;
  /** TODO M2: column color/icon. */
  color?: string;
  /** TODO M2: collapsed state. */
  collapsed?: boolean;
  // Phantom type parameter to keep generics aligned with KanbanCard<T>.
  _t?: T;
};

// TODO M3: Swimlane (group rows by assignee / priority / label).
export type Swimlane = {
  id: string;
  title: string;
  groupBy?: 'assignee' | 'priority' | 'label';
};

// TODO M3: KanbanFilters (assignee, label, priority, due date chips + search).
export type KanbanFilters = {
  assignees?: string[];
  labels?: string[];
  priorities?: KanbanPriority[];
};

// TODO M5: i18n messages prop.
export type KanbanMessages = {
  emptyColumn: string;
  addCard: string;
  wipExceeded: (current: number, limit: number) => string;
  moveAnnouncement: (cardTitle: string, fromTitle: string, toTitle: string) => string;
};

// TODO M6: telemetry hook.
export type KanbanTelemetry =
  | { kind: 'card-move'; cardId: CardId; from: ColumnId; to: ColumnId; index: number }
  | { kind: 'card-move-rejected'; cardId: CardId; from: ColumnId; to: ColumnId; reason: string };

export type KanbanBoardProps<T = unknown> = {
  columns: KanbanColumn<T>[];
  cards: KanbanCard<T>[];
  /** Async move callback. Reject (throw) to revert the optimistic update. */
  onCardMove?: (
    card: KanbanCard<T>,
    from: ColumnId,
    to: ColumnId,
    index: number,
  ) => Promise<void> | void;
  /** Validation hook — return false to block the drop entirely. */
  canMove?: (card: KanbanCard<T>, from: ColumnId, to: ColumnId) => boolean;
  /** Custom card renderer — receives the card; return JSX. */
  renderCard?: (card: KanbanCard<T>) => React.ReactNode;
  /** Board-level ARIA label for the wrapping region. */
  ariaLabel?: string;
  className?: string;

  // TODO M2: onColumnReorder, onColumnCollapse.
  // TODO M3: swimlanes, filters, search.
  // TODO M4: onCardCreate, onCardUpdate, bulkSelectable.
  // TODO M5: messages.
  // TODO M6: virtualize, onTelemetry.
};

/** Drag payload kept in dataTransfer (JSON-encoded). */
export type KanbanDragData = {
  cardId: CardId;
  fromColumnId: ColumnId;
};

/** Internal: which slot inside a column the pointer is hovering. */
export type DropTarget = {
  columnId: ColumnId;
  /** Insert index (0-based) within the destination column's card list. */
  index: number;
};
