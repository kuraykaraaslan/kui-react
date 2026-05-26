'use client';
import { cn } from '@/libs/utils/cn';
import { MIME_PALETTE, MIME_CANVAS } from '../hooks/useDragDrop';
import type { FormSchema, FieldType } from '../types';
import { FieldRow } from './FieldRow';

type CanvasProps = {
  schema: FormSchema;
  selectedId: string | null;
  heading: string;
  emptyLabel: string;
  duplicateLabel: string;
  deleteLabel: string;
  dropIndex: number | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCardDragStart: (e: React.DragEvent, fromIndex: number) => void;
  onCardDragEnd: () => void;
  onSlotDragOver: (e: React.DragEvent, index: number) => void;
  onSlotDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
};

export function Canvas({
  schema,
  selectedId,
  heading,
  emptyLabel,
  duplicateLabel,
  deleteLabel,
  dropIndex,
  onSelect,
  onDelete,
  onDuplicate,
  onCardDragStart,
  onCardDragEnd,
  onSlotDragOver,
  onSlotDragLeave,
  onDrop,
}: CanvasProps) {
  const fields = schema.fields;
  const isEmpty = fields.length === 0;

  return (
    <section
      aria-label={heading}
      className={cn(
        'fb-canvas flex-1 min-w-0 rounded-lg border border-border bg-surface-raised',
        'flex flex-col',
      )}
    >
      <header className="px-3 py-2 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {heading}
        </h3>
      </header>

      <ul
        role="list"
        aria-label="Form fields"
        className={cn(
          'fb-canvas-list flex-1 flex flex-col gap-1.5 p-3 min-h-[12rem] overflow-y-auto',
        )}
        onDragOver={(e) => {
          // Trailing drop zone — append.
          if (
            e.dataTransfer.types.includes(MIME_PALETTE) ||
            e.dataTransfer.types.includes(MIME_CANVAS)
          ) {
            e.preventDefault();
          }
        }}
        onDrop={(e) => {
          // If the event bubbled here without a slot handling it, append.
          onDrop(e, fields.length);
        }}
      >
        {/* slot 0 */}
        <Slot
          index={0}
          active={dropIndex === 0}
          onSlotDragOver={onSlotDragOver}
          onSlotDragLeave={onSlotDragLeave}
          onDrop={onDrop}
        />
        {fields.map((field, i) => (
          <div key={field.id} className="contents">
            <FieldRow
              field={field}
              index={i}
              selected={selectedId === field.id}
              onSelect={onSelect}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
              duplicateLabel={duplicateLabel}
              deleteLabel={deleteLabel}
            />
            <Slot
              index={i + 1}
              active={dropIndex === i + 1}
              onSlotDragOver={onSlotDragOver}
              onSlotDragLeave={onSlotDragLeave}
              onDrop={onDrop}
            />
          </div>
        ))}
        {isEmpty && (
          <li
            aria-hidden="true"
            className={cn(
              'fb-canvas-empty text-sm text-text-disabled italic text-center py-10',
              'border border-dashed border-border rounded-md',
            )}
          >
            {emptyLabel}
          </li>
        )}
      </ul>
    </section>
  );
}

type SlotProps = {
  index: number;
  active: boolean;
  onSlotDragOver: (e: React.DragEvent, index: number) => void;
  onSlotDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
};

function Slot({ index, active, onSlotDragOver, onSlotDragLeave, onDrop }: SlotProps) {
  return (
    <div
      aria-hidden="true"
      data-slot-index={index}
      onDragOver={(e) => onSlotDragOver(e, index)}
      onDragLeave={onSlotDragLeave}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop(e, index);
      }}
      className={cn(
        'fb-drop-indicator mx-1 h-0.5 rounded-full transition-colors',
        active ? 'bg-primary' : 'bg-transparent',
      )}
    />
  );
}
