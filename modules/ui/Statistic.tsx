'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type StatisticTrend = 'up' | 'down';

const trendColorMap: Record<StatisticTrend, string> = {
  up: 'text-success',
  down: 'text-error',
};

const trendIconMap: Record<StatisticTrend, IconDefinition> = {
  up: faArrowUp,
  down: faArrowDown,
};

type StatisticProps = {
  label: string;
  value: number | string;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: StatisticTrend;
  trendValue?: string;
  loading?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'>;

export function Statistic({
  label,
  value,
  precision,
  prefix,
  suffix,
  trend,
  trendValue,
  loading = false,
  className,
  ...rest
}: StatisticProps) {
  const displayValue = typeof value === 'number' && precision !== undefined ? value.toFixed(precision) : value;

  return (
    <div className={cn('space-y-1', className)} aria-busy={loading} {...rest}>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      {loading ? (
        <div className="h-7 w-24 animate-pulse rounded bg-surface-sunken" aria-hidden="true" />
      ) : (
        <div className="flex items-baseline gap-1.5">
          {prefix && <span className="text-lg text-text-secondary">{prefix}</span>}
          <span className="text-2xl font-bold tabular-nums text-text-primary">{displayValue}</span>
          {suffix && <span className="text-lg text-text-secondary">{suffix}</span>}
          {trend && (
            <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold', trendColorMap[trend])}>
              <FontAwesomeIcon icon={trendIconMap[trend]} className="h-2.5 w-2.5" aria-hidden="true" />
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
