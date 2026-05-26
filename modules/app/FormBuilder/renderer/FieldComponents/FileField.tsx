'use client';
import type { Field } from '../../types';
import { FieldShell, baseInputClasses, describedBy } from './FieldShell';

type Props = {
  field: Field;
  // Files are non-serialisable — we expose only the file *name* through
  // values; consumers wanting the FileList can wire it up via DOM refs.
  value: unknown;
  error?: string;
  onChange: (fileName: string) => void;
};

export function FileField({ field, error, onChange }: Props) {
  return (
    <FieldShell id={field.id} label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <input
        id={field.id}
        name={field.name}
        type="file"
        required={field.required}
        aria-required={field.required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(field.helperText, error, field.id)}
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? '')}
        className={baseInputClasses + ' file:mr-3 file:px-2 file:py-1 file:rounded file:border-0 file:bg-surface-overlay file:text-text-primary'}
      />
    </FieldShell>
  );
}
