'use client';
import { useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import {
  DEFAULT_RENDERER_MESSAGES,
  type Field,
  type FormRendererProps,
} from '../types';
import { isFieldVisible } from '../hooks/useLogicEval';
import { useFormState } from './useFormState';
import { TextField } from './FieldComponents/TextField';
import { EmailField } from './FieldComponents/EmailField';
import { NumberField } from './FieldComponents/NumberField';
import { TextareaField } from './FieldComponents/TextareaField';
import { SelectField } from './FieldComponents/SelectField';
import { RadioField } from './FieldComponents/RadioField';
import { CheckboxField } from './FieldComponents/CheckboxField';
import { DateField } from './FieldComponents/DateField';
import { FileField } from './FieldComponents/FileField';
// Stubs (M3 / M5) — present for future activation.
import { MultiselectField } from './FieldComponents/MultiselectField';
import { SignatureField } from './FieldComponents/SignatureField';
import { RatingField } from './FieldComponents/RatingField';

export function FormRenderer({
  schema,
  values,
  onChange,
  onSubmit,
  messages,
  className,
}: FormRendererProps) {
  const msgs = { ...DEFAULT_RENDERER_MESSAGES, ...(messages ?? {}) };
  const { values: state, errors, setValue, runValidation } = useFormState({
    schema,
    values,
    onChange,
    messages: msgs,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { ok } = runValidation();
      if (!ok) return;
      await onSubmit?.(state);
    },
    [onSubmit, runValidation, state],
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label={schema.title || 'Form'}
      className={cn(
        'fb-renderer flex flex-col gap-4 p-4 rounded-lg border border-border bg-surface-base',
        className,
      )}
    >
      {schema.title && (
        <header className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text-primary">{schema.title}</h2>
          {schema.description && (
            <p className="text-sm text-text-secondary">{schema.description}</p>
          )}
        </header>
      )}

      {schema.fields.map((field) =>
        isFieldVisible(field, state) ? (
          <FieldDispatch
            key={field.id}
            field={field}
            value={state[field.name]}
            error={errors[field.name]}
            onChange={(v) => setValue(field.name, v)}
          />
        ) : null,
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className={cn(
            'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium',
            'bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-active',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            'transition-colors',
          )}
        >
          {msgs.submit}
        </button>
      </div>
    </form>
  );
}

type DispatchProps = {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (v: unknown) => void;
};

function FieldDispatch({ field, value, error, onChange }: DispatchProps) {
  switch (field.type) {
    case 'text':       return <TextField     field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'email':      return <EmailField    field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'number':     return <NumberField   field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'textarea':   return <TextareaField field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'select':     return <SelectField   field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'radio':      return <RadioField    field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'checkbox':   return <CheckboxField field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'date':       return <DateField     field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'file':       return <FileField     field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    // Stubs render nothing in M1.
    case 'multiselect':return <MultiselectField field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'signature':  return <SignatureField  field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    case 'rating':     return <RatingField     field={field} value={value} error={error} onChange={(v) => onChange(v)} />;
    default:           return null;
  }
}
