'use client';
import { cn } from '@/libs/utils/cn';

export type FloorPricePoint = { date: string; floorEth: number };

type FloorPriceChartProps = {
  points: FloorPricePoint[];
  height?: number;
  className?: string;
};

export function FloorPriceChart({ points, height = 220, className }: FloorPriceChartProps) {
  if (points.length < 2) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border border-border bg-surface-raised text-sm text-text-secondary',
          className,
        )}
        style={{ height }}
      >
        Not enough data to chart
      </div>
    );
  }

  const width = 600;
  const padding = { top: 16, right: 16, bottom: 28, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const min = Math.min(...points.map((p) => p.floorEth));
  const max = Math.max(...points.map((p) => p.floorEth));
  const range = max - min || 1;
  const step = innerW / (points.length - 1);

  const toX = (i: number) => padding.left + i * step;
  const toY = (v: number) => padding.top + innerH - ((v - min) / range) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(2)} ${toY(p.floorEth).toFixed(2)}`)
    .join(' ');

  const areaPath = `${linePath} L ${toX(points.length - 1).toFixed(2)} ${padding.top + innerH} L ${toX(0).toFixed(2)} ${padding.top + innerH} Z`;

  const last = points[points.length - 1];
  const first = points[0];
  const changePct = first.floorEth > 0 ? ((last.floorEth - first.floorEth) / first.floorEth) * 100 : 0;
  const positive = changePct >= 0;
  const stroke = positive ? 'var(--success)' : 'var(--error)';

  const gridLines = 4;

  return (
    <div className={cn('rounded-xl border border-border bg-surface-base p-4', className)}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Floor Price · {points.length}d
          </p>
          <p className="mt-1 text-2xl font-bold text-text-primary tabular-nums">
            {last.floorEth.toFixed(3)} ETH
          </p>
        </div>
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            positive ? 'text-success' : 'text-error',
          )}
        >
          {positive ? '+' : ''}
          {changePct.toFixed(1)}%
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
        role="img"
        aria-label="Floor price chart"
      >
        {/* Grid */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = padding.top + (innerH * i) / gridLines;
          const v = max - (range * i) / gridLines;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                x2={padding.left + innerW}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="2 4"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                fontSize="9"
                fill="var(--text-secondary)"
              >
                {v.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill={stroke} opacity={0.12} />
        {/* Line */}
        <path d={linePath} fill="none" stroke={stroke} strokeWidth={2} vectorEffect="non-scaling-stroke" />

        {/* X-axis labels: first / mid / last */}
        {[0, Math.floor((points.length - 1) / 2), points.length - 1].map((i) => (
          <text
            key={i}
            x={toX(i)}
            y={height - 8}
            textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
            fontSize="9"
            fill="var(--text-secondary)"
          >
            {points[i].date}
          </text>
        ))}
      </svg>
    </div>
  );
}
