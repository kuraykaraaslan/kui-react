'use client';
import { useCallback, useRef, useState } from 'react';
import {
  type Field,
  type FieldType,
  type FormSchema,
  type FieldOption,
  getFieldTypeMeta,
  nextFieldId,
} from '../types';

/**
 * Controlled when (schema && onChange) supplied; otherwise uncontrolled with
 * defaultSchema as seed. Always returns a stable schema + setter pair.
 */
export function useSchemaState(
  schema: FormSchema | undefined,
  defaultSchema: FormSchema | undefined,
  onChange: ((schema: FormSchema) => void) | undefined,
) {
  const isControlled = schema !== undefined && typeof onChange === 'function';
  const [internal, setInternal] = useState<FormSchema>(
    () =>
      defaultSchema ??
      schema ?? {
        id: 'form-' + Date.now().toString(36),
        title: 'Untitled form',
        description: '',
        fields: [],
      },
  );

  const current = isControlled ? (schema as FormSchema) : internal;
  const currentRef = useRef(current);
  currentRef.current = current;

  const commit = useCallback(
    (next: FormSchema) => {
      if (isControlled) {
        onChange?.(next);
      } else {
        setInternal(next);
        onChange?.(next);
      }
    },
    [isControlled, onChange],
  );

  /* ── Mutations ─────────────────────────────────────────────────────── */

  const addField = useCallback(
    (type: FieldType, atIndex?: number) => {
      const meta = getFieldTypeMeta(type);
      if (!meta) return;
      const seed = meta.defaults();
      const field: Field = { ...seed, id: nextFieldId(type) };
      const next = { ...currentRef.current };
      const fields = next.fields.slice();
      const idx = typeof atIndex === 'number'
        ? Math.max(0, Math.min(atIndex, fields.length))
        : fields.length;
      fields.splice(idx, 0, field);
      next.fields = fields;
      commit(next);
      return field.id;
    },
    [commit],
  );

  const updateField = useCallback(
    (id: string, patch: Partial<Field>) => {
      const next = { ...currentRef.current };
      next.fields = next.fields.map((f) => (f.id === id ? { ...f, ...patch } : f));
      commit(next);
    },
    [commit],
  );

  const updateFieldOptions = useCallback(
    (id: string, options: FieldOption[]) => {
      updateField(id, { options });
    },
    [updateField],
  );

  const removeField = useCallback(
    (id: string) => {
      const next = { ...currentRef.current };
      next.fields = next.fields.filter((f) => f.id !== id);
      commit(next);
    },
    [commit],
  );

  const duplicateField = useCallback(
    (id: string) => {
      const next = { ...currentRef.current };
      const idx = next.fields.findIndex((f) => f.id === id);
      if (idx === -1) return;
      const source = next.fields[idx];
      const clone: Field = {
        ...source,
        id: nextFieldId(source.type),
        name: source.name + '_copy',
        label: source.label + ' (copy)',
        options: source.options?.map((o) => ({ ...o })),
      };
      next.fields = [
        ...next.fields.slice(0, idx + 1),
        clone,
        ...next.fields.slice(idx + 1),
      ];
      commit(next);
      return clone.id;
    },
    [commit],
  );

  const reorderField = useCallback(
    (fromIndex: number, toIndex: number) => {
      const next = { ...currentRef.current };
      const fields = next.fields.slice();
      if (fromIndex < 0 || fromIndex >= fields.length) return;
      const [moved] = fields.splice(fromIndex, 1);
      const clamped = Math.max(0, Math.min(toIndex, fields.length));
      fields.splice(clamped, 0, moved);
      next.fields = fields;
      commit(next);
    },
    [commit],
  );

  const replaceSchema = useCallback(
    (next: FormSchema) => commit(next),
    [commit],
  );

  return {
    schema: current,
    addField,
    updateField,
    updateFieldOptions,
    removeField,
    duplicateField,
    reorderField,
    replaceSchema,
  };
}
