'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faAt,
  faHashtag,
  faAlignLeft,
  faCaretDown,
  faCircleDot,
  faSquareCheck,
  faCalendar,
  faPaperclip,
  faSignature,
  faStar,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { cn } from '@/libs/utils/cn';
import { FIELD_TYPES, type FieldType, type FieldTypeMeta } from '../types';

const ICON_MAP: Record<string, IconDefinition> = {
  faFont,
  faAt,
  faHashtag,
  faAlignLeft,
  faCaretDown,
  faCircleDot,
  faSquareCheck,
  faCalendar,
  faPaperclip,
  faSignature,
  faStar,
  faList,
};

export function paletteIcon(meta: FieldTypeMeta): IconDefinition {
  return ICON_MAP[meta.iconName] ?? faFont;
}

type FieldPaletteProps = {
  heading: string;
  enabledTypes?: FieldType[];
  onDragStart: (e: React.DragEvent, type: FieldType) => void;
  onAdd: (type: FieldType) => void;
};

export function FieldPalette({
  heading,
  enabledTypes,
  onDragStart,
  onAdd,
}: FieldPaletteProps) {
  const allow = (t: FieldType) => !enabledTypes || enabledTypes.includes(t);

  return (
    <aside
      aria-label={heading}
      className={cn(
        'fb-palette w-56 shrink-0 rounded-lg border border-border bg-surface-raised',
        'flex flex-col',
      )}
    >
      <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary border-b border-border">
        {heading}
      </h3>
      <ul role="list" className="flex flex-col gap-1 p-2 overflow-y-auto">
        {FIELD_TYPES.filter((m) => allow(m.type)).map((meta) => {
          const disabled = !!meta.disabled;
          return (
            <li key={meta.type} role="listitem">
              <button
                type="button"
                draggable={!disabled}
                aria-disabled={disabled || undefined}
                disabled={disabled}
                title={disabled ? 'Coming soon' : `Drag or click to add ${meta.label}`}
                onDragStart={(e) => !disabled && onDragStart(e, meta.type)}
                onClick={() => !disabled && onAdd(meta.type)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm',
                  'bg-surface-base border border-border',
                  'text-text-primary',
                  'hover:bg-surface-overlay hover:border-border-strong',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors',
                )}
              >
                <FontAwesomeIcon
                  icon={paletteIcon(meta)}
                  className="w-4 h-4 text-text-secondary"
                  aria-hidden="true"
                />
                <span className="truncate">{meta.label}</span>
                {disabled && (
                  <span className="ml-auto text-[10px] uppercase text-text-disabled">soon</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
