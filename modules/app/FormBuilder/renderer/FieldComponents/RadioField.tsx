'use client';
import { cn } from '@/libs/utils/cn';
import type { Field } from '../../types';
import { FieldShell, describedBy } from './FieldShell';

type Props = {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (v: string) => void;
};

export function RadioField({ field, value, error, onChange }: Props) {
  const options = field.options ?? [];
  const v = typeof value === 'string' ? value : '';
  return (
    <FieldShell
      id={field.id}
      label={field.label}
      required={field.required}
      helperText={field.helperText}
      error={error}
      labelAsLegend
    >
      <div
        role="radiogroup"
        aria-required={field.required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(field.helperText, error, field.id)}
        className="flex flex-col gap-1.5"
      >
        {options.map((opt) => (
          <label key={opt.value} className={cn(
            'inline-flex items-center gap-2 text-sm text-text-primary',
          )}>
            <input
              type="radio"
              name={field.name}
              value={opt.value}
              checked={v === opt.value}
              onChange={() => onChange(opt.value)}
              className="border-border-strong text-primary focus-visible:ring-2 focus-visible:ring-border-focus"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </FieldShell>
  );
}
