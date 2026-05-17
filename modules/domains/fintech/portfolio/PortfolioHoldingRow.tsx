'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CurrencyBadge } from '../wallet/CurrencyBadge';
import type { Currency } from '../types';

type PortfolioHoldingRowProps = {
  symbol: string;
  name: string;
  amount: number;
  currency: Currency;
  usdValue: number;
  costBasis?: number;
  dayChangePct?: number;
  className?: string;
};

function formatUsd(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatAmount(n: number, currency: string) {
  const decimals = ['BTC', 'ETH'].includes(currency) ? 4 : 2;
  return `${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${currency}`;
}

export function PortfolioHoldingRow({
  symbol,
  name,
  amount,
  currency,
  usdValue,
  costBasis,
  dayChangePct,
  className,
}: PortfolioHoldingRowProps) {
  const pnl = costBasis !== undefined ? usdValue - costBasis : undefined;
  const pnlPct = costBasis ? (pnl! / costBasis) * 100 : undefined;
  const positive = (dayChangePct ?? 0) >= 0;

  return (
    <div
      className={cn(
        'grid items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3',
        'grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]',
        className,
      )}
    >
      <CurrencyBadge currency={currency} size="md" />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
        <p className="text-xs text-text-secondary">{symbol}</p>
      </div>

      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs text-text-secondary">Holdings</span>
        <span className="text-sm font-medium text-text-primary tabular-nums">
          {formatAmount(amount, currency)}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-xs text-text-secondary">Value</span>
        <span className="text-sm font-bold text-text-primary tabular-nums">{formatUsd(usdValue)}</span>
      </div>

      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs text-text-secondary">24h</span>
        {dayChangePct !== undefined ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums',
              positive ? 'text-success' : 'text-error',
            )}
          >
            <FontAwesomeIcon
              icon={positive ? faArrowUp : faArrowDown}
              className="w-2.5 h-2.5"
              aria-hidden="true"
            />
            {Math.abs(dayChangePct).toFixed(2)}%
          </span>
        ) : (
          <span className="text-sm text-text-secondary">—</span>
        )}
        {pnl !== undefined && pnlPct !== undefined && (
          <span className={cn('text-[11px] tabular-nums', pnl >= 0 ? 'text-success' : 'text-error')}>
            {pnl >= 0 ? '+' : ''}{formatUsd(pnl)} ({pnlPct.toFixed(1)}%)
          </span>
        )}
      </div>
    </div>
  );
}
