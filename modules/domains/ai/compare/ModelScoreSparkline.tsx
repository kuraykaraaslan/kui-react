'use client';
import { cn } from '@/libs/utils/cn';

type ModelScoreSparklineProps = {
  scores: number[];
  width?: number;
  height?: number;
  color?: string;
  label?: string;
  className?: string;
};

export function ModelScoreSparkline({
  scores,
  width = 120,
  height = 32,
  color = 'var(--primary)',
  label,
  className,
}: ModelScoreSparklineProps) {
  if (!scores.length) return null;

  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min || 1;
  const stepX = scores.length > 1 ? width / (scores.length - 1) : width;

  const points = scores
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const last = scores[scores.length - 1];

  return (
    <div className={cn('inline-flex flex-col gap-0.5', className)} aria-label={label ?? 'Score trend'}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label ?? `Score trend, latest value ${last.toFixed(1)}`}
        className="overflow-visible"
      >
        <polygon points={areaPoints} fill={color} opacity={0.12} />
        <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        <circle
          cx={(scores.length - 1) * stepX}
          cy={height - ((last - min) / range) * height}
          r={2.5}
          fill={color}
        />
      </svg>
      {label && (
        <span className="text-[10px] text-text-secondary leading-none">{label}</span>
      )}
    </div>
  );
}
