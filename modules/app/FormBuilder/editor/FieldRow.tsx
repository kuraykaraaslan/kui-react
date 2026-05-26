'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faTrash, faClone } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { type Field, getFieldTypeMeta } from '../types';
import { paletteIcon } from './FieldPalette';

type FieldRowProps = {
  field: Field;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDragStart: (e: React.DragEvent, fromIndex: number) => void;
  onDragEnd: () => void;
  duplicateLabel: string;
  deleteLabel: string;
};

export function FieldRow({
  field,
  index,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  onDragStart,
  onDragEnd,
  duplicateLabel,
  deleteLabel,
}: FieldRowProps) {
  const meta = getFieldTypeMeta(field.type);
  const icon = meta ? paletteIcon(meta) : undefined;

  return (
    <li
      role="listitem"
      data-field-id={field.id}
      data-field-index={index}
      aria-current={selected || undefined}
      className={cn(
        'fb-row group relative rounded-md border bg-surface-base transition-colors',
        selected
          ? 'border-border-focus ring-2 ring-border-focus/40'
          : 'border-border hover:border-border-strong',
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(field.id)}
        className={cn(
          'w-full flex items-start gap-2 px-2 py-2 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-md',
        )}
      >
        <span
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            onDragStart(e, index);
          }}
          onDragEnd={onDragEnd}
          aria-label="Drag handle"
          role="button"
          tabIndex={-1}
          className={cn(
            'fb-row-handle shrink-0 grid place-items-center w-6 h-6 rounded',
            'text-text-secondary cursor-grab active:cursor-grabbing',
            'hover:bg-surface-overlay',
          )}
        >
          <FontAwesomeIcon icon={faGripVertical} className="w-3 h-3" aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-text-secondary">
            {icon && (
              <FontAwesomeIcon icon={icon} className="w-3 h-3" aria-hidden="true" />
            )}
            <span>{meta?.label ?? field.type}</span>
            {field.required && (
              <span className="text-error" aria-label="required">*</span>
            )}
          </span>
          <span className="block text-sm font-medium text-text-primary truncate">
            {field.label || <em className="text-text-disabled not-italic">Untitled</em>}
          </span>
          {field.helperText && (
            <span className="block text-xs text-text-secondary truncate mt-0.5">
              {field.helperText}
            </span>
          )}
        </span>
      </button>

      <div className="absolute right-1 top-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDuplicate(field.id); }}
          aria-label={duplicateLabel}
          title={duplicateLabel}
          className={cn(
            'grid place-items-center w-6 h-6 rounded',
            'text-text-secondary hover:text-text-primary',
            'hover:bg-surface-overlay',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={faClone} className="w-3 h-3" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}
          aria-label={deleteLabel}
          title={deleteLabel}
          className={cn(
            'grid place-items-center w-6 h-6 rounded',
            'text-text-secondary hover:text-error',
            'hover:bg-error-subtle',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
