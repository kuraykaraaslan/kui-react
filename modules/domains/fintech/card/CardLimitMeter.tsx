'use client';
import { cn } from '@/libs/utils/cn';

type CardLimitMeterProps = {
  label?: string;
  spent: number;
  limit: number;
  currency?: string;
  warningThresholdPct?: number;
  className?: string;
};

function formatMoney(n: number, currency: string) {
  return n.toLocaleString('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
}

export function CardLimitMeter({
  label = 'Monthly spend',
  spent,
  limit,
  currency = 'USD',
  warningThresholdPct = 80,
  className,
}: CardLimitMeterProps) {
  const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  const over = spent > limit;
  const warning = pct >= warningThresholdPct;

  const remaining = Math.max(0, limit - spent);

  const fillColor = over
    ? 'bg-error'
    : warning
      ? 'bg-warning'
      : 'bg-primary';

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface-raised p-4',
        className,
      )}
      role="group"
      aria-label={`${label} progress`}
    >
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
        <p className="text-sm font-semibold text-text-primary tabular-nums">
          {formatMoney(spent, currency)}
          <span className="ml-1 font-normal text-text-secondary">
            / {formatMoney(limit, currency)}
          </span>
        </p>
      </div>

      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-all', fillColor)}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p
        className={cn(
          'mt-1.5 text-xs tabular-nums',
          over ? 'text-error font-semibold' : warning ? 'text-warning' : 'text-text-secondary',
        )}
      >
        {over
          ? `Over by ${formatMoney(spent - limit, currency)}`
          : `${formatMoney(remaining, currency)} left this period`}
      </p>
    </div>
  );
}
