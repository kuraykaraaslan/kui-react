'use client';
// modules/ui/DateRangePicker.tsx
//
// Thin re-export shim — DateRangePicker now lives in `./DatePicker/`.
// TimePicker keeps its M1 native-input implementation here because the time
// flow belongs to milestone M4 (DateTimePicker / TimeStrip).

import { cn } from '@/libs/utils/cn';

export { DateRangePicker } from './DatePicker/index';
export type { DateRange, DateRangePickerProps } from './DatePicker/index';

// ---------------------------------------------------------------------------
// TimePicker — kept inline here for backwards compatibility.
// TODO M4: move into DatePicker/parts/TimeStrip.tsx and integrate with
// DateTimePicker (hour/minute/second + 12h/24h + timezone).
// ---------------------------------------------------------------------------

export function TimePicker({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  disabled,
  required,
  step = 60,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value?: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  required?: boolean;
  step?: number;
  className?: string;
}) {
  const hintId  = hint  ? `${id}-hint`  : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
        {required && (
          <>
            <span className="text-error ml-1" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>
      <input
        id={id}
        type="time"
        value={value ?? ''}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={cn(
          'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
          'text-text-primary bg-surface-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken',
          error ? 'border-error ring-1 ring-error bg-error-subtle' : 'border-border'
        )}
      />
      {hint && !error && <p id={hintId} className="text-xs text-text-secondary">{hint}</p>}
      {error && <p id={errorId} className="text-xs text-error" role="alert">{error}</p>}
    </div>
  );
}
