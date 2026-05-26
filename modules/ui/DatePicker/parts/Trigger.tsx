'use client';
// modules/ui/DatePicker/parts/Trigger.tsx
//
// Input-shaped trigger button used by both DatePicker and DateRangePicker.
// Click anywhere to open the popover; the calendar icon + clear (×) sit on
// the trailing edge.
//
// TODO M3: integrate input-mask so the user can type the date directly.

import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';

type TriggerProps = {
  /** Text displayed inside the trigger (empty → placeholder). */
  display: string;
  /** Placeholder when nothing selected. */
  placeholder: string;
  /** Whether the popover is open (drives aria-expanded). */
  open: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** Show the × button (only when there is a value to clear). */
  showClear?: boolean;
  clearLabel: string;
  onToggle: () => void;
  onClear?: () => void;
  /** Element id of the popover panel — wired via aria-controls. */
  controlsId?: string;
  /** Optional aria-label for the trigger button. */
  ariaLabel?: string;
  /** Optional aria-describedby for hint/error. */
  ariaDescribedBy?: string;
  required?: boolean;
  testId?: string;
  className?: string;
};

export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  {
    display,
    placeholder,
    open,
    disabled,
    invalid,
    showClear,
    clearLabel,
    onToggle,
    onClear,
    controlsId,
    ariaLabel,
    ariaDescribedBy,
    required,
    testId,
    className,
  },
  ref,
) {
  return (
    <div
      className={cn(
        'group relative flex w-full items-center rounded-md border transition-colors',
        'bg-surface-base text-text-primary',
        'focus-within:ring-2 focus-within:ring-border-focus focus-within:border-border-focus',
        disabled && 'opacity-50 cursor-not-allowed bg-surface-sunken',
        invalid ? 'border-error ring-1 ring-error bg-error-subtle' : 'border-border',
        className,
      )}
    >
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={controlsId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        data-testid={testId}
        className={cn(
          'flex-1 text-left px-3 py-2 text-sm bg-transparent rounded-l-md',
          'focus-visible:outline-none',
          'disabled:cursor-not-allowed',
        )}
      >
        {display ? (
          <span>{display}</span>
        ) : (
          <span className="text-text-disabled">{placeholder}</span>
        )}
      </button>

      {showClear && !disabled ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-md mr-1',
            'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={faXmark} className="h-3 w-3" aria-hidden="true" />
        </button>
      ) : null}

      <span
        className={cn(
          'pointer-events-none mr-3 text-text-secondary',
          disabled && 'opacity-50',
        )}
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={faCalendar} className="h-3.5 w-3.5" />
      </span>
    </div>
  );
});
