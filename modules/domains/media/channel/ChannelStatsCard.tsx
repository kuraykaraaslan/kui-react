'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faEye,
  faClock,
  faVideo,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type ChannelStatsMetric = 'subscribers' | 'views' | 'watchTime' | 'videos';

type ChannelStat = {
  metric: ChannelStatsMetric;
  value: number;
  deltaPct?: number;
  helper?: string;
};

type ChannelStatsCardProps = {
  channelName: string;
  period?: string;
  stats: ChannelStat[];
  className?: string;
};

const METRIC_META: Record<ChannelStatsMetric, { label: string; icon: IconDefinition; suffix?: string }> = {
  subscribers: { label: 'Subscribers', icon: faUsers },
  views: { label: 'Views', icon: faEye },
  watchTime: { label: 'Watch time', icon: faClock, suffix: 'h' },
  videos: { label: 'Videos', icon: faVideo },
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function ChannelStatsCard({
  channelName,
  period = 'Last 28 days',
  stats,
  className,
}: ChannelStatsCardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
      aria-label={`Stats for ${channelName}`}
    >
      <header className="mb-5 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{channelName}</h3>
        <span className="text-xs text-text-secondary">{period}</span>
      </header>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => {
          const meta = METRIC_META[s.metric];
          const positive = (s.deltaPct ?? 0) >= 0;
          return (
            <div key={s.metric} className="flex flex-col gap-1">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <FontAwesomeIcon icon={meta.icon} className="w-3.5 h-3.5" aria-hidden="true" />
                {meta.label}
              </dt>
              <dd className="text-xl font-bold text-text-primary tabular-nums">
                {formatCount(s.value)}
                {meta.suffix && (
                  <span className="ml-0.5 text-sm font-medium text-text-secondary">{meta.suffix}</span>
                )}
              </dd>
              {s.deltaPct !== undefined && (
                <p
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium',
                    positive ? 'text-success' : 'text-error',
                  )}
                >
                  <FontAwesomeIcon
                    icon={positive ? faArrowUp : faArrowDown}
                    className="w-3 h-3"
                    aria-hidden="true"
                  />
                  {Math.abs(s.deltaPct).toFixed(1)}%
                  {s.helper && <span className="text-text-secondary font-normal ml-1">{s.helper}</span>}
                </p>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
