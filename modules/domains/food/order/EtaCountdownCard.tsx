'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';

type EtaCountdownCardProps = {
  estimatedArrival: Date | string;
  label?: string;
  destinationLabel?: string;
  variant?: 'default' | 'urgent';
  className?: string;
};

function diffMinutes(target: Date): number {
  return Math.max(0, Math.round((target.getTime() - Date.now()) / 60_000));
}

export function EtaCountdownCard({
  estimatedArrival,
  label = 'Arriving in',
  destinationLabel,
  variant = 'default',
  className,
}: EtaCountdownCardProps) {
  const target = new Date(estimatedArrival);
  const [minutes, setMinutes] = useState(() => diffMinutes(target));

  useEffect(() => {
    const id = setInterval(() => setMinutes(diffMinutes(target)), 30_000);
    return () => clearInterval(id);
  }, [target]);

  const arrived = minutes === 0;
  const urgent = variant === 'urgent' || minutes <= 5;

  return (
    <section
      className={cn(
        'rounded-xl border p-5 shadow-sm',
        urgent
          ? 'border-warning bg-warning-subtle text-warning'
          : 'border-border bg-surface-raised text-text-primary',
        className,
      )}
      aria-label={label}
    >
      <header className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide opacity-80">
        <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" aria-hidden="true" />
        {arrived ? 'Driver arrived' : label}
      </header>

      <p className="mt-1 flex items-baseline gap-2 text-4xl font-extrabold tabular-nums">
        {arrived ? (
          <span>Now</span>
        ) : (
          <>
            <span>{minutes}</span>
            <span className="text-base font-semibold">min</span>
          </>
        )}
      </p>

      <p className="mt-1 text-sm opacity-90">
        Est. arrival at{' '}
        <time
          className="font-semibold"
          dateTime={target.toISOString()}
        >
          {target.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </time>
      </p>

      {destinationLabel && (
        <p className="mt-2 flex items-center gap-1.5 text-xs opacity-80">
          <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3" aria-hidden="true" />
          {destinationLabel}
        </p>
      )}
    </section>
  );
}
