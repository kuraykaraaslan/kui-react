'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { VideoStatusBadge } from './VideoStatusBadge';
import type { VideoStatus } from '../types';

type VideoPerformanceRowProps = {
  thumbnailUrl?: string | null;
  title: string;
  status: VideoStatus;
  publishedAt?: Date | string | null;
  views: number;
  watchTimeHours: number;
  ctrPct: number;
  deltaPct?: number;
  href?: string;
  className?: string;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function dateLabel(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function VideoPerformanceRow({
  thumbnailUrl,
  title,
  status,
  publishedAt,
  views,
  watchTimeHours,
  ctrPct,
  deltaPct,
  href,
  className,
}: VideoPerformanceRowProps) {
  const Wrapper = href ? 'a' : 'div';
  const positive = (deltaPct ?? 0) >= 0;

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        'grid items-center gap-3 rounded-lg border border-border bg-surface-raised p-3',
        'grid-cols-[80px_minmax(0,1fr)_auto] sm:grid-cols-[80px_minmax(0,1fr)_repeat(3,auto)]',
        href && 'transition-colors hover:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      <div className="relative aspect-video w-20 overflow-hidden rounded bg-surface-sunken">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FontAwesomeIcon icon={faPlay} className="w-4 h-4 text-text-disabled" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-semibold text-text-primary leading-snug">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <VideoStatusBadge status={status} size="sm" />
          {publishedAt && <span>{dateLabel(publishedAt)}</span>}
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end text-xs">
        <span className="text-text-secondary">Views</span>
        <span className="font-semibold text-text-primary tabular-nums">{formatCount(views)}</span>
      </div>

      <div className="hidden sm:flex flex-col items-end text-xs">
        <span className="text-text-secondary">Watch (h)</span>
        <span className="font-semibold text-text-primary tabular-nums">
          {formatCount(Math.round(watchTimeHours))}
        </span>
      </div>

      <div className="flex flex-col items-end text-xs">
        <span className="text-text-secondary">CTR</span>
        <span className="font-semibold text-text-primary tabular-nums">{ctrPct.toFixed(1)}%</span>
        {deltaPct !== undefined && (
          <span
            className={cn(
              'mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-medium',
              positive ? 'text-success' : 'text-error',
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
      </div>
    </Wrapper>
  );
}
