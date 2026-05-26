'use client';
import { useRef } from 'react';
import { cn } from '@/libs/utils/cn';
import type { CardId, ColumnId, DropTarget, KanbanCard, KanbanColumn } from '../types';
import { Card } from './Card';
import { ColumnDropIndicator } from './ColumnDropIndicator';
import { ColumnHeader } from './ColumnHeader';

type ColumnProps<T> = {
  column: KanbanColumn<T>;
  cards: KanbanCard<T>[];
  draggingId: CardId | null;
  dropTarget: DropTarget | null;
  isDragActive: boolean;
  onCardDragStart: (e: React.DragEvent<HTMLElement>, card: KanbanCard<T>) => void;
  onCardDragEnd: () => void;
  onColumnDragOver: (
    e: React.DragEvent<HTMLElement>,
    columnId: ColumnId,
    computeIndex: (clientY: number) => number,
  ) => void;
  onColumnDragLeave: (e: React.DragEvent<HTMLElement>, columnId: ColumnId) => void;
  onColumnDrop: (e: React.DragEvent<HTMLElement>, columnId: ColumnId) => void;
  renderCard?: (card: KanbanCard<T>) => React.ReactNode;
};

export function Column<T>({
  column,
  cards,
  draggingId,
  dropTarget,
  isDragActive,
  onCardDragStart,
  onCardDragEnd,
  onColumnDragOver,
  onColumnDragLeave,
  onColumnDrop,
  renderCard,
}: ColumnProps<T>) {
  const listRef = useRef<HTMLUListElement | null>(null);

  // Map pointer Y -> insertion index by inspecting card midpoints.
  const computeIndex = (clientY: number): number => {
    const list = listRef.current;
    if (!list) return cards.length;
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-card-id]'));
    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect();
      if (clientY < r.top + r.height / 2) return i;
    }
    return items.length;
  };

  const indicatorActive = (i: number) =>
    !!dropTarget && dropTarget.columnId === column.id && dropTarget.index === i;

  return (
    <section
      role="region"
      aria-label={`Column ${column.title}`}
      aria-dropeffect={isDragActive ? 'move' : undefined}
      data-column-id={column.id}
      className={cn(
        'flex flex-col min-w-[16rem] w-72 max-w-xs shrink-0',
        'rounded-lg border border-border bg-surface-overlay',
        'transition-colors',
        dropTarget?.columnId === column.id && 'bg-primary-subtle border-primary/40',
      )}
      onDragOver={(e) => onColumnDragOver(e, column.id, computeIndex)}
      onDragLeave={(e) => onColumnDragLeave(e, column.id)}
      onDrop={(e) => onColumnDrop(e, column.id)}
    >
      <ColumnHeader column={column} count={cards.length} />
      <ul
        ref={listRef}
        role="list"
        aria-label={`${column.title} cards`}
        className="flex-1 flex flex-col gap-1 p-2 min-h-[4rem] overflow-y-auto"
      >
        <ColumnDropIndicator active={indicatorActive(0)} />
        {cards.map((card, i) => (
          <div key={card.id} className="contents">
            <Card
              card={card}
              isDragging={draggingId === card.id}
              renderCard={renderCard}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
            />
            <ColumnDropIndicator active={indicatorActive(i + 1)} />
          </div>
        ))}
        {cards.length === 0 && (
          <li
            aria-hidden="true"
            className={cn(
              'text-xs text-text-disabled italic text-center py-6',
              'border border-dashed border-border rounded-md',
            )}
          >
            Drop cards here
          </li>
        )}
      </ul>
      {/* TODO M4: <AddCardInline columnId={column.id} onCreate={…} /> */}
    </section>
  );
}
