'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { cn } from '@/libs/utils/cn';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  Title,
);

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── 1. Bar Chart ─── */
const BAR_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [4200, 5800, 4900, 7100, 6300, 8400],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 6,
    },
    {
      label: 'Expenses',
      data: [2800, 3200, 3600, 4100, 3900, 4700],
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderRadius: 6,
    },
  ],
};

export function RevenueBarChart({ className }: { className?: string }) {
  return (
    <ChartCard
      title="Revenue vs Expenses"
      subtitle="Monthly comparison (USD)"
      className={className}
    >
      <Bar
        data={BAR_DATA}
        aria-label="Revenue vs Expenses chart"
        options={{
          responsive: true,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </ChartCard>
  );
}

/* ─── 2. Line Chart ─── */
const LINE_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Active Users',
      data: [1200, 1900, 1500, 2300, 2100, 2800, 1700],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'New Signups',
      data: [300, 480, 220, 560, 410, 690, 320],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export function UserActivityLineChart({ className }: { className?: string }) {
  return (
    <ChartCard
      title="User Activity"
      subtitle="Daily active users vs new signups"
      className={className}
    >
      <Line
        data={LINE_DATA}
        aria-label="User Activity chart"
        options={{
          responsive: true,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </ChartCard>
  );
}

/* ─── 3. Doughnut Chart ─── */
const DOUGHNUT_DATA = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
  datasets: [
    {
      data: [35, 25, 20, 12, 8],
      backgroundColor: [
        'rgba(59, 130, 246, 0.85)',
        'rgba(139, 92, 246, 0.85)',
        'rgba(34, 197, 94, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(107, 114, 128, 0.85)',
      ],
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
};

export function SalesByCategoryDoughnut({ className }: { className?: string }) {
  return (
    <ChartCard
      title="Sales by Category"
      subtitle="Percentage share of total revenue"
      className={className}
    >
      <div className="mx-auto max-w-xs">
        <Doughnut
          data={DOUGHNUT_DATA}
          aria-label="Sales by Category chart"
          options={{
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            cutout: '65%',
          }}
        />
      </div>
    </ChartCard>
  );
}

/* ─── 4. Radar Chart ─── */
const RADAR_DATA = {
  labels: ['Speed', 'Reliability', 'Support', 'Price', 'Features', 'UX'],
  datasets: [
    {
      label: 'Our Product',
      data: [88, 92, 78, 70, 85, 90],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
    },
    {
      label: 'Competitor',
      data: [72, 80, 65, 85, 75, 68],
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      pointBackgroundColor: 'rgb(139, 92, 246)',
    },
  ],
};

export function ProductComparisonRadar({ className }: { className?: string }) {
  return (
    <ChartCard
      title="Product Comparison"
      subtitle="Our product vs competitor across 6 dimensions"
      className={className}
    >
      <Radar
        data={RADAR_DATA}
        aria-label="Product Comparison chart"
        options={{
          responsive: true,
          plugins: { legend: { position: 'top' } },
          scales: { r: { beginAtZero: true, max: 100 } },
        }}
      />
    </ChartCard>
  );
}

/* ─── 5. Polar Area Chart ─── */
const POLAR_DATA = {
  labels: ['North', 'South', 'East', 'West', 'Central'],
  datasets: [
    {
      data: [42, 28, 35, 19, 56],
      backgroundColor: [
        'rgba(59, 130, 246, 0.75)',
        'rgba(34, 197, 94, 0.75)',
        'rgba(245, 158, 11, 0.75)',
        'rgba(239, 68, 68, 0.75)',
        'rgba(139, 92, 246, 0.75)',
      ],
      borderWidth: 1,
    },
  ],
};

export function RegionalSalesPolar({ className }: { className?: string }) {
  return (
    <ChartCard
      title="Regional Sales"
      subtitle="Units sold per region"
      className={className}
    >
      <div className="mx-auto max-w-xs">
        <PolarArea
          data={POLAR_DATA}
          aria-label="Regional Sales chart"
          options={{
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
          }}
        />
      </div>
    </ChartCard>
  );
}
