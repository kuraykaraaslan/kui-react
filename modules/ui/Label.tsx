'use client';
import { cn } from '@/libs/utils/cn';

type LabelProps = {
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ required, disabled, className, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-text-primary select-none',
        disabled && 'text-text-disabled cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {children}
      {required && (
        <>
          <span className="text-error ml-1" aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </>
      )}
    </label>
  );
}
