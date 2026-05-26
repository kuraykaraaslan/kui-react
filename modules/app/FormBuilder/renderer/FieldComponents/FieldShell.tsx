'use client';
import { cn } from '@/libs/utils/cn';

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  labelAsLegend?: boolean; // for radio / checkbox groups
};

export function FieldShell({
  id,
  label,
  required,
  helperText,
  error,
  children,
  labelAsLegend,
}: FieldShellProps) {
  const helperId = helperText ? id + '-help' : undefined;
  const errorId = error ? id + '-error' : undefined;

  if (labelAsLegend) {
    return (
      <fieldset className="fb-field flex flex-col gap-1">
        <legend className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
        </legend>
        {children}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-text-secondary">{helperText}</p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-error">{error}</p>
        )}
      </fieldset>
    );
  }

  return (
    <div className="fb-field flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {helperText && !error && (
        <p id={helperId} className="text-xs text-text-secondary">{helperText}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-error">{error}</p>
      )}
    </div>
  );
}

export const baseInputClasses = cn(
  'w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary',
  'placeholder:text-text-disabled',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
  'aria-[invalid=true]:border-error aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error/40',
);

export function describedBy(helperText?: string, error?: string, id?: string): string | undefined {
  if (!id) return undefined;
  const parts: string[] = [];
  if (helperText) parts.push(id + '-help');
  if (error) parts.push(id + '-error');
  return parts.length ? parts.join(' ') : undefined;
}
