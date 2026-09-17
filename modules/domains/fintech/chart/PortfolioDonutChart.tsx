'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { cn } from '@/libs/utils/cn';

ChartJS.register(ArcElement, Tooltip, Legend);

type PortfolioAsset = {
  currency: string;
  usdEquivalent: number;
};

type PortfolioDonutChartProps = {
  assets: PortfolioAsset[];
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

export function PortfolioDonutChart({ assets, className }: PortfolioDonutChartProps) {
  const total = assets.reduce((s, a) => s + a.usdEquivalent, 0);

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
    <div className={cn('rounded-xl border border-border bg-surface-raised p-5 shadow-sm', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Portfolio Allocation</h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            Total ≈ ${total.toLocaleString('en', { maximumFractionDigits: 0 })} USD
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-xs">
        <Doughnut
          data={chartData}
          aria-label="Portfolio allocation chart"
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
    </div>
  );
}
