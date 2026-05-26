'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import {
  DEFAULT_BUILDER_MESSAGES,
  type FieldType,
  type FormBuilderProps,
  type FormSchema,
} from './types';
import { useSchemaState } from './hooks/useSchemaState';
import { useDragDrop, MIME_PALETTE, MIME_CANVAS } from './hooks/useDragDrop';
import { FieldPalette } from './editor/FieldPalette';
import { Canvas } from './editor/Canvas';
import { FieldSettings } from './editor/FieldSettings';

// ── Public re-exports ────────────────────────────────────────────────
export { FormRenderer } from './renderer/FormRenderer';
export type {
  Field,
  FieldOption,
  FieldType,
  FormSchema,
  FormValues,
  FormErrors,
  FormBuilderMessages,
  FormBuilderProps,
  FormRendererMessages,
  FormRendererProps,
  FieldTypeMeta,
} from './types';
export { FIELD_TYPES, DEFAULT_BUILDER_MESSAGES, DEFAULT_RENDERER_MESSAGES } from './types';

export function FormBuilder({
  schema,
  defaultSchema,
  onChange,
  fieldTypes,
  messages,
  className,
}: FormBuilderProps) {
  const msgs = useMemo(() => ({ ...DEFAULT_BUILDER_MESSAGES, ...(messages ?? {}) }), [messages]);

  const {
    schema: current,
    addField,
    updateField,
    updateFieldOptions,
    removeField,
    duplicateField,
    reorderField,
    replaceSchema,
  } = useSchemaState(schema, defaultSchema, onChange);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    dragSource,
    dropIndex,
    onPaletteDragStart,
    onCardDragStart,
    onDragEnd,
    onSlotDragOver,
    onSlotDragLeave,
  } = useDragDrop();

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      const paletteType = e.dataTransfer.getData(MIME_PALETTE) as FieldType | '';
      const canvasIndex = e.dataTransfer.getData(MIME_CANVAS);

      if (paletteType) {
        const newId = addField(paletteType, index);
        if (newId) setSelectedId(newId);
      } else if (canvasIndex !== '') {
        const from = Number(canvasIndex);
        // The drop slot indexes assume the source has been removed; when
        // dragging downwards account for the shift.
        const to = from < index ? index - 1 : index;
        if (from !== to) reorderField(from, to);
      }
      onDragEnd();
    },
    [addField, reorderField, onDragEnd],
  );

  const selectedField = useMemo(
    () => current.fields.find((f) => f.id === selectedId) ?? null,
    [current.fields, selectedId],
  );

  /* ── Export / import ─────────────────────────────────────────────── */

  const fileRef = useRef<HTMLInputElement | null>(null);

  const onExport = useCallback(() => {
    const json = JSON.stringify(current, null, 2);
    if (typeof window === 'undefined') return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (current.title || 'form-schema').replace(/\s+/g, '-').toLowerCase() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [current]);

  const onImportClick = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const onImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as FormSchema;
        if (parsed && Array.isArray(parsed.fields)) {
          replaceSchema(parsed);
          setSelectedId(null);
        }
      } catch {
        // Silently ignore malformed JSON in M1; surface a toast in M2.
      } finally {
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [replaceSchema],
  );

  return (
    <div
      role="application"
      aria-label="Form builder"
      data-fb-drag-active={dragSource ? 'true' : undefined}
      className={cn(
        'fb-root flex flex-col gap-3 p-3 rounded-lg bg-surface-overlay border border-border',
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary">
          {current.title || 'Untitled form'}
        </span>
        <span className="text-xs text-text-secondary">
          ({current.fields.length} field{current.fields.length === 1 ? '' : 's'})
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onImportClick}
          className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm',
            'bg-surface-base border border-border text-text-primary',
            'hover:bg-surface-overlay hover:border-border-strong',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={faFileImport} className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{msgs.importJson}</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onImportFile}
        />
        <button
          type="button"
          onClick={onExport}
          className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm',
            'bg-surface-base border border-border text-text-primary',
            'hover:bg-surface-overlay hover:border-border-strong',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={faFileExport} className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{msgs.exportJson}</span>
        </button>
      </div>

      {/* Three-pane workspace */}
      <div className="flex gap-3 items-stretch min-h-[24rem]">
        <FieldPalette
          heading={msgs.paletteHeading}
          enabledTypes={fieldTypes}
          onDragStart={onPaletteDragStart}
          onAdd={(type) => {
            const id = addField(type);
            if (id) setSelectedId(id);
          }}
        />

        <Canvas
          schema={current}
          selectedId={selectedId}
          heading={msgs.canvasHeading}
          emptyLabel={msgs.canvasEmpty}
          duplicateLabel={msgs.duplicate}
          deleteLabel={msgs.delete}
          dropIndex={dropIndex}
          onSelect={setSelectedId}
          onDelete={(id) => {
            removeField(id);
            if (selectedId === id) setSelectedId(null);
          }}
          onDuplicate={(id) => {
            const newId = duplicateField(id);
            if (newId) setSelectedId(newId);
          }}
          onCardDragStart={onCardDragStart}
          onCardDragEnd={onDragEnd}
          onSlotDragOver={onSlotDragOver}
          onSlotDragLeave={onSlotDragLeave}
          onDrop={handleDrop}
        />

        <FieldSettings
          field={selectedField}
          messages={msgs}
          onChange={updateField}
          onOptionsChange={updateFieldOptions}
        />
      </div>

      {/*
        TODO M2: inline validation rule editor inside FieldSettings.
        TODO M3: <LogicEditor /> beside settings or as a tab.
        TODO M4: <PagesPanel /> above canvas for multi-page tabs.
        TODO M5: <PreviewToggle /> swapping editor view ↔ FormRenderer.
        TODO M6: keyboard reorder + LiveRegion announcements.
      */}
    </div>
  );
}
