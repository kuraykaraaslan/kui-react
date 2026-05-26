'use client';
import type { Field } from '../../types';
import { FieldShell, baseInputClasses, describedBy } from './FieldShell';

type Props = {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (v: string) => void;
};

export function DateField({ field, value, error, onChange }: Props) {
  return (
    <FieldShell id={field.id} label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <input
        id={field.id}
        name={field.name}
        type="date"
        value={typeof value === 'string' ? value : ''}
        required={field.required}
        aria-required={field.required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(field.helperText, error, field.id)}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClasses}
      />
    </FieldShell>
  );
}
