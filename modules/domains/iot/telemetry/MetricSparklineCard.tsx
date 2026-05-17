'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

type MetricSparklineCardProps = {
  label: string;
  value: number | string;
  unit?: string;
  series: number[];
  deltaPct?: number;
  /** Direction of "good" — affects delta color. Default 'down' (lower is better). */
  goodWhen?: 'up' | 'down';
  className?: string;
};

function buildPath(series: number[], width = 100, height = 32): string {
  if (series.length < 2) return '';
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const step = width / (series.length - 1);
  return series
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export function MetricSparklineCard({
  label,
  value,
  unit,
  series,
  deltaPct,
  goodWhen = 'down',
  className,
}: MetricSparklineCardProps) {
  const width = 100;
  const height = 32;
  const path = buildPath(series, width, height);
  const areaPath = path ? `${path} L ${width} ${height} L 0 ${height} Z` : '';

  const positive = (deltaPct ?? 0) >= 0;
  const good = positive ? goodWhen === 'up' : goodWhen === 'down';
  const stroke = good ? 'var(--success)' : 'var(--error)';

  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-4 shadow-sm',
        className,
      )}
      aria-label={label}
    >
      <header className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {label}
        </p>
        {deltaPct !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-semibold',
              good ? 'text-success' : 'text-error',
            )}
          >
            <FontAwesomeIcon
              icon={positive ? faArrowUp : faArrowDown}
              className="w-2.5 h-2.5"
              aria-hidden="true"
            />
            {Math.abs(deltaPct).toFixed(1)}%
          </span>
        )}
      </header>

      <p className="mt-1 flex items-baseline gap-1 text-2xl font-bold text-text-primary tabular-nums">
        {value}
        {unit && <span className="text-sm font-medium text-text-secondary">{unit}</span>}
      </p>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-2 h-8 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {areaPath && (
          <path d={areaPath} fill={stroke} opacity={0.12} />
        )}
        {path && (
          <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        )}
      </svg>
    </section>
  );
}
