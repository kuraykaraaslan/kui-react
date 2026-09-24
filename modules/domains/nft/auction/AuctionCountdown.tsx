'use client';
import { cn } from '@/libs/utils/cn';
import { useSyncExternalStore } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

type AuctionCountdownProps = {
  endsAt: Date | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

type TimeParts = { days: number; hours: number; minutes: number; seconds: number; ended: boolean };

/** Whole seconds left until `targetMs`, or -1 once it has passed. */
function secondsLeft(targetMs: number): number {
  const ms = targetMs - Date.now();
  return ms <= 0 ? -1 : Math.floor(ms / 1000);
}

function toParts(total: number): TimeParts {
  if (total < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  return {
    days:    Math.floor(total / 86_400),
    hours:   Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
    ended: false,
  };
}

function subscribeEverySecond(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

const sizeMap = {
  sm: { value: 'text-lg', label: 'text-[10px]', cell: 'min-w-10 p-1.5' },
  md: { value: 'text-2xl', label: 'text-[11px]', cell: 'min-w-12 p-2' },
  lg: { value: 'text-3xl', label: 'text-xs',     cell: 'min-w-14 p-3' },
};

export function AuctionCountdown({ endsAt, label = 'Auction ends in', size = 'md', className }: AuctionCountdownProps) {
  const targetMs = new Date(endsAt).getTime();
  // Wall-clock subscription: re-read once a second; `null` during SSR/hydration.
  const remaining = useSyncExternalStore(
    subscribeEverySecond,
    () => secondsLeft(targetMs),
    () => null,
  );
  const parts: TimeParts | null = remaining === null ? null : toParts(remaining);

  const s = sizeMap[size];

  if (parts?.ended) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm font-medium text-text-secondary',
          className,
        )}
      >
        <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" aria-hidden="true" />
        Auction ended
      </div>
    );
  }

  const cells = [
    { key: 'days',    label: 'Days',    value: parts?.days    ?? 0 },
    { key: 'hours',   label: 'Hours',   value: parts?.hours   ?? 0 },
    { key: 'minutes', label: 'Min',     value: parts?.minutes ?? 0 },
    { key: 'seconds', label: 'Sec',     value: parts?.seconds ?? 0 },
  ];

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-text-secondary">
        <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        {cells.map((c, i) => (
          <div key={c.key} className="flex items-center gap-1.5">
            <div
              className={cn(
                'flex flex-col items-center rounded-lg border border-border bg-surface-base tabular-nums',
                s.cell,
              )}
            >
              <span className={cn('font-bold text-text-primary', s.value)}>
                {String(c.value).padStart(2, '0')}
              </span>
              <span className={cn('font-medium uppercase tracking-wide text-text-secondary', s.label)}>
                {c.label}
              </span>
            </div>
            {i < cells.length - 1 && (
              <span className="text-text-disabled font-bold">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
