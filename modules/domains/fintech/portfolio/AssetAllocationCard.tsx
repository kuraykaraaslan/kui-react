'use client';
import { cn } from '@/libs/utils/cn';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(ArcElement, Tooltip, Legend);

type AssetAllocationAsset = {
  currency: string;
  usdEquivalent: number;
};

type AssetAllocationCardProps = {
  assets: AssetAllocationAsset[];
  totalUsd?: number;
  changePct?: number;
  changeAbsUsd?: number;
  className?: string;
};

const CURRENCY_COLORS: Record<string, string> = {
  TRY: 'rgba(245, 158, 11, 0.85)',
  USD: 'rgba(34, 197, 94, 0.85)',
  EUR: 'rgba(59, 130, 246, 0.85)',
  GBP: 'rgba(99, 102, 241, 0.85)',
  BTC: 'rgba(249, 115, 22, 0.85)',
  ETH: 'rgba(139, 92, 246, 0.85)',
};

function formatUsd(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function AssetAllocationCard({
  assets,
  totalUsd,
  changePct,
  changeAbsUsd,
  className,
}: AssetAllocationCardProps) {
  const total = totalUsd ?? assets.reduce((s, a) => s + a.usdEquivalent, 0);
  const positive = (changePct ?? 0) >= 0;

  const chartData = {
    labels: assets.map((a) => a.currency),
    datasets: [
      {
        data: assets.map((a) => a.usdEquivalent),
        backgroundColor: assets.map((a) => CURRENCY_COLORS[a.currency] ?? 'rgba(107,114,128,0.85)'),
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6,
      },
    ],
  };

  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
      aria-label="Asset allocation"
    >
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Total value</p>
          <p className="text-2xl font-bold text-text-primary tabular-nums">{formatUsd(total)}</p>
        </div>
        {changePct !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-sm font-semibold tabular-nums',
              positive ? 'text-success' : 'text-error',
            )}
          >
            <FontAwesomeIcon
              icon={positive ? faArrowUp : faArrowDown}
              className="w-3 h-3"
              aria-hidden="true"
            />
            {Math.abs(changePct).toFixed(2)}%
            {changeAbsUsd !== undefined && (
              <span className="ml-1 font-normal text-text-secondary">
                ({changeAbsUsd >= 0 ? '+' : ''}{formatUsd(changeAbsUsd)})
              </span>
            )}
          </span>
        )}
      </header>

      <div className="mx-auto mt-4 max-w-xs">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            cutout: '68%',
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 }, padding: 10 } },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const val = ctx.raw as number;
                    const pct = ((val / total) * 100).toFixed(1);
                    return ` $${val.toLocaleString('en', { maximumFractionDigits: 0 })} (${pct}%)`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </section>
  );
}
