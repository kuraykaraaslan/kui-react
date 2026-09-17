'use client';
import { cn } from '@/libs/utils/cn';

type ProgressVariant = 'primary' | 'success' | 'warning' | 'error';
type ProgressSize = 'sm' | 'md' | 'lg';

const barColorMap: Record<ProgressVariant, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
};

const barHeightMap: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const strokeColorMap: Record<ProgressVariant, string> = {
  primary: 'stroke-[var(--primary)]',
  success: 'stroke-[var(--success)]',
  warning: 'stroke-[var(--warning)]',
  error:   'stroke-[var(--error)]',
};

const circleDimMap: Record<ProgressSize, number> = { sm: 40, md: 64, lg: 96 };
const circleStrokeMap: Record<ProgressSize, number> = { sm: 4, md: 6, lg: 8 };

type ProgressProps = {
  value: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  shape?: 'bar' | 'circle';
  showLabel?: boolean;
  label?: string;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

export function Progress({
  value,
  variant = 'primary',
  size = 'md',
  shape = 'bar',
  showLabel = false,
  label,
  className,
  ...rest
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  if (shape === 'circle') {
    const dim = circleDimMap[size];
    const stroke = circleStrokeMap[size];
    const radius = (dim - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped / 100);

    return (
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `${Math.round(clamped)}% complete`}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: dim, height: dim }}
        {...rest}
      >
        <svg width={dim} height={dim} className="-rotate-90">
          <circle cx={dim / 2} cy={dim / 2} r={radius} strokeWidth={stroke} className="fill-none stroke-[var(--surface-sunken)]" />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn('fill-none transition-[stroke-dashoffset] duration-300 ease-out', strokeColorMap[variant])}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-xs font-semibold tabular-nums text-text-primary">{Math.round(clamped)}%</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)} {...rest}>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `${Math.round(clamped)}% complete`}
        className={cn('w-full overflow-hidden rounded-full bg-surface-sunken', barHeightMap[size])}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-300 ease-out', barColorMap[variant])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <p className="mt-1 text-xs tabular-nums text-text-secondary">{Math.round(clamped)}%</p>}
    </div>
  );
}
