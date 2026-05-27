'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench, faClock, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';

export type MaintenancePageProps = {
  title?: string;
  description?: string;
  eta?: Date | string | number | null;
  statusUrl?: string;
  statusLabel?: string;
  icon?: React.ReactNode;
  className?: string;
};

function formatRemaining(targetMs: number, nowMs: number): string {
  const ms = targetMs - nowMs;
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function MaintenancePage({
  title = 'System Maintenance',
  description = "We're performing a short maintenance to improve service quality. We'll be back shortly.",
  eta,
  statusUrl,
  statusLabel = 'Status Page',
  icon,
  className,
}: MaintenancePageProps) {
  const etaMs = eta ? new Date(eta).getTime() : null;
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (etaMs === null) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [etaMs]);

  const remaining = etaMs !== null ? formatRemaining(etaMs, nowMs) : null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'min-h-screen flex flex-col items-center justify-center px-4 bg-surface-base',
        className,
      )}
    >
      <div
        className="flex h-20 w-20 mb-6 items-center justify-center rounded-2xl text-4xl shadow-lg"
        style={{
          background: 'linear-gradient(135deg, var(--warning) 0%, var(--primary) 100%)',
          boxShadow: '0 8px 32px color-mix(in srgb, var(--warning) 30%, transparent)',
        }}
      >
        {icon ?? (
          <FontAwesomeIcon
            icon={faScrewdriverWrench}
            className="w-8 h-8 text-text-inverse"
            aria-hidden="true"
          />
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary text-center">
        {title}
      </h1>

      <p className="mt-3 max-w-md text-center text-text-secondary text-sm sm:text-base leading-relaxed">
        {description}
      </p>

      {remaining && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-text-disabled">
            Estimated Return
          </span>
          <Badge variant="warning" size="lg">
            <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
            <span className="font-mono tabular-nums">{remaining}</span>
          </Badge>
        </div>
      )}

      {statusUrl && (
        <a
          href={statusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold',
            'text-text-primary border border-border transition-colors hover:bg-surface-overlay',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          {statusLabel}
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="w-3.5 h-3.5"
            aria-hidden="true"
          />
        </a>
      )}

      <div className="mt-16 flex items-center gap-2 opacity-20" aria-hidden>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="rounded-full bg-warning"
            style={{
              width: i === 2 ? 10 : i === 1 || i === 3 ? 7 : 5,
              height: i === 2 ? 10 : i === 1 || i === 3 ? 7 : 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
