'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faMinus, faClock } from '@fortawesome/free-solid-svg-icons';

export type FeatureCheckValue = 'yes' | 'no' | 'partial' | 'preview' | string | number;

type FeatureCheckCellProps = {
  value: FeatureCheckValue;
  label?: string;
  className?: string;
};

export function FeatureCheckCell({ value, label, className }: FeatureCheckCellProps) {
  if (value === 'yes') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full bg-success-subtle text-success px-2 py-0.5 text-xs font-medium',
          className,
        )}
        aria-label={label ?? 'Supported'}
      >
        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" />
        {label ?? 'Yes'}
      </span>
    );
  }

  if (value === 'no') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full bg-error-subtle text-error px-2 py-0.5 text-xs font-medium',
          className,
        )}
        aria-label={label ?? 'Not supported'}
      >
        <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
        {label ?? 'No'}
      </span>
    );
  }

  if (value === 'partial') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full bg-warning-subtle text-warning px-2 py-0.5 text-xs font-medium',
          className,
        )}
        aria-label={label ?? 'Partial support'}
      >
        <FontAwesomeIcon icon={faMinus} className="w-3 h-3" aria-hidden="true" />
        {label ?? 'Partial'}
      </span>
    );
  }

  if (value === 'preview') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full bg-info-subtle text-info px-2 py-0.5 text-xs font-medium',
          className,
        )}
        aria-label={label ?? 'Preview'}
      >
        <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
        {label ?? 'Preview'}
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center justify-center text-xs font-medium text-text-primary', className)}>
      {value}
    </span>
  );
}
