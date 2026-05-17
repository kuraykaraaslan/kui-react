'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

type PriceTagProps = {
  label?: string;
  priceEth: number;
  priceUsd?: number;
  lastSalePriceEth?: number;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  className?: string;
};

const sizeMap = {
  sm: { label: 'text-[10px]', value: 'text-sm',  icon: 'w-3 h-3'    },
  md: { label: 'text-xs',     value: 'text-base', icon: 'w-3.5 h-3.5' },
  lg: { label: 'text-xs',     value: 'text-xl',   icon: 'w-4 h-4'    },
};

function formatEth(value: number): string {
  if (value === 0) return '0';
  if (value < 0.001) return value.toFixed(6);
  if (value < 1) return value.toFixed(3);
  return value.toFixed(2);
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function PriceTag({
  label,
  priceEth,
  priceUsd,
  lastSalePriceEth,
  size = 'md',
  align = 'left',
  className,
}: PriceTagProps) {
  const s = sizeMap[size];
  const deltaPct =
    lastSalePriceEth && lastSalePriceEth > 0
      ? ((priceEth - lastSalePriceEth) / lastSalePriceEth) * 100
      : null;
  const positive = (deltaPct ?? 0) >= 0;

  return (
    <div
      className={cn(
        'inline-flex flex-col gap-0.5',
        align === 'right' && 'items-end text-right',
        className,
      )}
    >
      {label && (
        <span className={cn('font-medium uppercase tracking-wide text-text-secondary', s.label)}>
          {label}
        </span>
      )}
      <span
        className={cn(
          'inline-flex items-center gap-1 font-bold text-text-primary tabular-nums',
          s.value,
        )}
      >
        <FontAwesomeIcon icon={faEthereum} className={cn(s.icon, 'text-text-secondary')} aria-hidden="true" />
        {formatEth(priceEth)}
      </span>
      {(priceUsd !== undefined || deltaPct !== null) && (
        <span className={cn('flex items-center gap-1.5 text-text-secondary', s.label)}>
          {priceUsd !== undefined && <span>{formatUsd(priceUsd)}</span>}
          {deltaPct !== null && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold',
                positive ? 'text-success' : 'text-error',
              )}
            >
              <FontAwesomeIcon
                icon={positive ? faArrowUp : faArrowDown}
                className="w-2 h-2"
                aria-hidden="true"
              />
              {Math.abs(deltaPct).toFixed(1)}%
            </span>
          )}
        </span>
      )}
    </div>
  );
}
