'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

type PerformanceSparklineProps = {
  /** Sequence of values over time (length >= 2). */
  series: number[];
  height?: number;
  /** Where to color the line/area based on net change. */
  className?: string;
  /** When the chart should be considered "negative" — defaults to comparing first vs. last. */
  forceNegative?: boolean;
};

export function PerformanceSparkline({
  series,
  height = 36,
  className,
  forceNegative,
}: PerformanceSparklineProps) {
  if (series.length < 2) return null;

  const width = 100;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const step = width / (series.length - 1);

  const path = series
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  const negative = forceNegative ?? series[series.length - 1] < series[0];
  const startValue = series[0];
  const endValue = series[series.length - 1];
  const deltaPct = startValue !== 0 ? ((endValue - startValue) / startValue) * 100 : 0;
  const stroke = negative ? 'var(--error)' : 'var(--success)';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-9 w-full max-w-[180px]"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={areaPath} fill={stroke} opacity={0.12} />
        <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        className={cn(
          'inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums whitespace-nowrap',
          negative ? 'text-error' : 'text-success',
        )}
      >
        <FontAwesomeIcon
          icon={negative ? faArrowDown : faArrowUp}
          className="w-2.5 h-2.5"
          aria-hidden="true"
        />
        {Math.abs(deltaPct).toFixed(2)}%
      </span>
    </div>
  );
}
