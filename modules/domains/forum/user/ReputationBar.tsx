'use client';
import { cn } from '@/libs/utils/cn';

export type ReputationTier = {
  label: string;
  threshold: number;
};

const DEFAULT_TIERS: ReputationTier[] = [
  { label: 'Newcomer', threshold: 0 },
  { label: 'Regular', threshold: 200 },
  { label: 'Trusted', threshold: 1000 },
  { label: 'Veteran', threshold: 3000 },
  { label: 'Sage', threshold: 8000 },
];

type ReputationBarProps = {
  reputation: number;
  tiers?: ReputationTier[];
  className?: string;
};

export function ReputationBar({
  reputation,
  tiers = DEFAULT_TIERS,
  className,
}: ReputationBarProps) {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);

  let currentIdx = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (reputation >= sorted[i].threshold) currentIdx = i;
    else break;
  }

  const current = sorted[currentIdx];
  const next = sorted[currentIdx + 1];

  const progressPct = next
    ? Math.min(
        100,
        ((reputation - current.threshold) / (next.threshold - current.threshold)) * 100,
      )
    : 100;

  const toNext = next ? next.threshold - reputation : 0;

  return (
    <div
      className={cn('rounded-lg border border-border bg-surface-raised p-4', className)}
      role="group"
      aria-label="Reputation progress"
    >
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Reputation
          </p>
          <p className="text-lg font-bold text-text-primary tabular-nums">
            {reputation.toLocaleString()}
            <span className="ml-1.5 text-sm font-medium text-text-secondary">· {current.label}</span>
          </p>
        </div>
        {next ? (
          <div className="text-right text-xs text-text-secondary">
            <p className="font-medium text-text-primary">{next.label}</p>
            <p className="tabular-nums">{toNext} to go</p>
          </div>
        ) : (
          <p className="text-xs font-medium text-success">Max tier reached</p>
        )}
      </div>

      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <ol className="mt-3 flex justify-between text-[10px] uppercase tracking-wide text-text-secondary">
        {sorted.map((t, i) => (
          <li
            key={t.label}
            className={cn(
              'flex flex-col items-center gap-1',
              i === currentIdx && 'text-primary font-semibold',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                i <= currentIdx ? 'bg-primary' : 'bg-border-strong',
              )}
            />
            <span className="hidden sm:block">{t.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
