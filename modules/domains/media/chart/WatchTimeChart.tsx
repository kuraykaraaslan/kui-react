'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { cn } from '@/libs/utils/cn';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export type WatchTimePoint = {
  date: string;
  hours: number;
};

type WatchTimeChartProps = {
  title?: string;
  subtitle?: string;
  data: WatchTimePoint[];
  className?: string;
};

export function WatchTimeChart({
  title = 'Watch time',
  subtitle = 'Hours over the period',
  data,
  className,
}: WatchTimeChartProps) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: 'Watch time (h)',
        data: data.map((d) => d.hours),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointRadius: 3,
        tension: 0.35,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { displayColors: false },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: {
              beginAtZero: true,
              ticks: { font: { size: 11 } },
              grid: { color: 'rgba(0,0,0,0.04)' },
            },
          },
        }}
      />
    </div>
  );
}
