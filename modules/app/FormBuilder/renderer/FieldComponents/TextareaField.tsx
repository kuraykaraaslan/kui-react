'use client';
import type { Field } from '../../types';
import { FieldShell, baseInputClasses, describedBy } from './FieldShell';

type Props = {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (v: string) => void;
};

export function TextareaField({ field, value, error, onChange }: Props) {
  return (
    <FieldShell id={field.id} label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <textarea
        id={field.id}
        name={field.name}
        rows={4}
        value={typeof value === 'string' ? value : ''}
        placeholder={field.placeholder}
        required={field.required}
        aria-required={field.required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(field.helperText, error, field.id)}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClasses + ' resize-y min-h-[6rem]'}
      />
    </FieldShell>
  );
}
