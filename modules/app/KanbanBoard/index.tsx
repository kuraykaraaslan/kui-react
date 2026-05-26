'use client';
import { useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import { useDnD } from './hooks/useDnD';
import { Column } from './parts/Column';
import type { ColumnId, KanbanBoardProps, KanbanCard } from './types';

export type {
  CardId,
  ColumnId,
  KanbanAssignee,
  KanbanBoardProps,
  KanbanCard,
  KanbanColumn,
  KanbanFilters,
  KanbanLabel,
  KanbanMessages,
  KanbanPriority,
  KanbanTelemetry,
  Swimlane,
} from './types';

export function KanbanBoard<T = unknown>({
  columns,
  cards,
  onCardMove,
  canMove,
  renderCard,
  ariaLabel = 'Kanban board',
  className,
}: KanbanBoardProps<T>) {
  const {
    cards: effectiveCards,
    draggingId,
    dropTarget,
    onCardDragStart,
    onCardDragEnd,
    onColumnDragOver,
    onColumnDragLeave,
    onColumnDrop,
  } = useDnD<T>({ cards, onCardMove, canMove });

  // Group cards by columnId once per render.
  const cardsByColumn = useMemo(() => {
    const map = new Map<ColumnId, KanbanCard<T>[]>();
    columns.forEach((c) => map.set(c.id, []));
    effectiveCards.forEach((card) => {
      const list = map.get(card.columnId);
      if (list) list.push(card);
    });
    return map;
  }, [columns, effectiveCards]);

  const isDragActive = draggingId !== null;

  return (
    <div
      role="application"
      aria-label={ariaLabel}
      className={cn(
        'kanban-board w-full overflow-x-auto',
        'flex gap-3 items-start p-2',
        className,
      )}
    >
      {columns.map((column) => (
        <Column<T>
          key={column.id}
          column={column}
          cards={cardsByColumn.get(column.id) ?? []}
          draggingId={draggingId}
          dropTarget={dropTarget}
          isDragActive={isDragActive}
          renderCard={renderCard}
          onCardDragStart={onCardDragStart}
          onCardDragEnd={onCardDragEnd}
          onColumnDragOver={onColumnDragOver}
          onColumnDragLeave={onColumnDragLeave}
          onColumnDrop={onColumnDrop}
        />
      ))}
      {/*
        TODO M2: trailing "+ Add column" button (onColumnAdd).
        TODO M3: swimlane rows wrap columns; filter/search bar above.
        TODO M5: <LiveRegion /> announcing moves.
        TODO M6: react-window virtualized lists per column.
      */}
    </div>
  );
}
