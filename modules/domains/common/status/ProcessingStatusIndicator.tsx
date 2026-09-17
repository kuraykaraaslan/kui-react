'use client';
import { cn } from '@/libs/utils/cn';
import type { ProcessingStatus } from '../BaseTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faGear, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const STATUS_META: Record<ProcessingStatus, { label: string; icon: React.ReactNode; color: string; pulse: boolean }> = {
  UPLOADING:  { label: 'Uploading',  icon: <FontAwesomeIcon icon={faCloudArrowUp} />, color: 'text-info',    pulse: true  },
  PROCESSING: { label: 'Processing', icon: <FontAwesomeIcon icon={faGear} />,         color: 'text-warning', pulse: true  },
  READY:      { label: 'Ready',      icon: <FontAwesomeIcon icon={faCheck} />,         color: 'text-success', pulse: false },
  FAILED:     { label: 'Failed',     icon: <FontAwesomeIcon icon={faXmark} />,         color: 'text-error',   pulse: false },
};

type ProcessingStatusIndicatorProps = {
  status: ProcessingStatus;
  label?: string;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: { text: 'text-xs', icon: 'text-sm', bar: 'h-1' },
  md: { text: 'text-sm', icon: 'text-base', bar: 'h-1.5' },
  lg: { text: 'text-base', icon: 'text-lg', bar: 'h-2' },
};

export function ProcessingStatusIndicator({
  status,
  label,
  progress,
  size = 'md',
  className,
}: ProcessingStatusIndicatorProps) {
  const meta = STATUS_META[status];
  const s    = sizeMap[size];

  return (
    <div className={cn('space-y-1.5', className)} role="status" aria-label={label ?? meta.label} aria-live="polite">
      <div className="flex items-center gap-2">
        <span
          className={cn(s.icon, meta.color, meta.pulse && 'animate-pulse')}
          aria-hidden="true"
        >
          {meta.icon}
        </span>
        <span className={cn(s.text, 'font-medium text-text-primary')}>
          {label ?? meta.label}
        </span>
        {progress !== undefined && (
          <span className={cn(s.text, 'text-text-secondary ml-auto tabular-nums')}>
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className={cn('w-full rounded-full bg-surface-sunken overflow-hidden', s.bar)}>
          <div
            role="progressbar"
            aria-label={label ?? meta.label}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              status === 'READY'   && 'bg-success',
              status === 'FAILED'  && 'bg-error',
              status === 'UPLOADING'  && 'bg-info',
              status === 'PROCESSING' && 'bg-warning',
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
