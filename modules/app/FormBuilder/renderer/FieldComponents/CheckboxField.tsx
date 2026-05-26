'use client';
import { cn } from '@/libs/utils/cn';
import type { Field } from '../../types';
import { describedBy } from './FieldShell';

type Props = {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (v: boolean) => void;
};

export function CheckboxField({ field, value, error, onChange }: Props) {
  const checked = value === true;
  const helperId = field.helperText ? field.id + '-help' : undefined;
  const errorId = error ? field.id + '-error' : undefined;
  return (
    <div className="fb-field flex flex-col gap-1">
      <label htmlFor={field.id} className={cn('inline-flex items-center gap-2 text-sm text-text-primary')}>
        <input
          id={field.id}
          name={field.name}
          type="checkbox"
          checked={checked}
          required={field.required}
          aria-required={field.required || undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(field.helperText, error, field.id)}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-border-strong text-primary focus-visible:ring-2 focus-visible:ring-border-focus"
        />
        <span>
          {field.label}
          {field.required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
        </span>
      </label>
      {field.helperText && !error && (
        <p id={helperId} className="text-xs text-text-secondary">{field.helperText}</p>
      )}
      {error && <p id={errorId} role="alert" className="text-xs text-error">{error}</p>}
    </div>
  );
}
