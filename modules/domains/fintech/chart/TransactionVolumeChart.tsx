'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { cn } from '@/libs/utils/cn';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type DailyVolume = {
  date: string;
  deposit: number;
  withdraw: number;
  payment: number;
  transfer: number;
};

type TransactionVolumeChartProps = {
  data: DailyVolume[];
  className?: string;
};

export function TransactionVolumeChart({ data, className }: TransactionVolumeChartProps) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: 'Deposit',
        data: data.map((d) => d.deposit),
        backgroundColor: 'rgba(34, 197, 94, 0.85)',
        borderRadius: 4,
        stack: 'vol',
      },
      {
        label: 'Withdraw',
        data: data.map((d) => d.withdraw),
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderRadius: 4,
        stack: 'vol',
      },
      {
        label: 'Payment',
        data: data.map((d) => d.payment),
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        borderRadius: 4,
        stack: 'vol',
      },
      {
        label: 'Transfer',
        data: data.map((d) => d.transfer),
        backgroundColor: 'rgba(139, 92, 246, 0.85)',
        borderRadius: 4,
        stack: 'vol',
      },
    ],
  };

  return (
    <div className={cn('rounded-xl border border-border bg-surface-raised p-5 shadow-sm', className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Transaction Volume</h3>
        <p className="mt-0.5 text-xs text-text-secondary">Last 7 days by type</p>
      </div>
      <Bar
        data={chartData}
        aria-label="Transaction volume chart"
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 }, padding: 10 } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { beginAtZero: true, ticks: { font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.04)' } },
          },
        }}
      />
    </div>
  );
}
