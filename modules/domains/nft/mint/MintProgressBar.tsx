'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';

type MintProgressBarProps = {
  mintedCount: number;
  totalSupply: number;
  mintPriceEth: number;
  label?: string;
  className?: string;
};

export function MintProgressBar({
  mintedCount,
  totalSupply,
  mintPriceEth,
  label = 'Minted',
  className,
}: MintProgressBarProps) {
  const pct = totalSupply > 0 ? Math.min(100, (mintedCount / totalSupply) * 100) : 0;
  const hot = pct >= 80;
  const soldOut = mintedCount >= totalSupply;

  return (
    <div className={cn('rounded-xl border border-border bg-surface-base p-4', className)}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-text-primary tabular-nums">
          <FontAwesomeIcon icon={faEthereum} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
          {mintPriceEth.toFixed(3)} / mint
        </p>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            soldOut ? 'bg-error' : hot ? 'bg-warning' : 'bg-primary',
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={mintedCount}
          aria-valuemin={0}
          aria-valuemax={totalSupply}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-text-primary tabular-nums">
          {mintedCount.toLocaleString('en-US')} / {totalSupply.toLocaleString('en-US')}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 font-semibold',
            soldOut ? 'text-error' : hot ? 'text-warning' : 'text-text-secondary',
          )}
        >
          {hot && !soldOut && <FontAwesomeIcon icon={faFire} className="w-3 h-3" aria-hidden="true" />}
          {soldOut ? 'Sold out' : `${pct.toFixed(1)}%`}
        </span>
      </div>
    </div>
  );
}
