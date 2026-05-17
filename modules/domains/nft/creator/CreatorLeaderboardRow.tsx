'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import type { NftCreator } from '../types';

type CreatorLeaderboardRowProps = {
  rank: number;
  creator: NftCreator;
  changePct?: number;
  className?: string;
};

export function CreatorLeaderboardRow({ rank, creator, changePct, className }: CreatorLeaderboardRowProps) {
  const positive = (changePct ?? 0) >= 0;
  const rankColor =
    rank === 1 ? 'bg-warning-subtle text-warning-fg' :
    rank === 2 ? 'bg-surface-sunken text-text-primary' :
    rank === 3 ? 'bg-error-subtle text-error-fg' :
    'bg-surface-overlay text-text-secondary';

  return (
    <a
      href={`/theme/nft/creators/${creator.handle}`}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-overlay',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums',
          rankColor,
        )}
      >
        {rank}
      </div>

      <Avatar src={creator.avatar} name={creator.displayName} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-medium text-text-primary">{creator.displayName}</p>
          {creator.verified && (
            <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
          )}
        </div>
        <p className="truncate text-xs text-text-secondary">@{creator.handle}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary tabular-nums">
          <FontAwesomeIcon icon={faEthereum} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
          {creator.totalVolumeEth >= 1000
            ? `${(creator.totalVolumeEth / 1000).toFixed(1)}k`
            : creator.totalVolumeEth.toFixed(1)}
        </p>
        {changePct !== undefined && (
          <p
            className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums',
              positive ? 'text-success' : 'text-error',
            )}
          >
            <FontAwesomeIcon
              icon={positive ? faArrowUp : faArrowDown}
              className="w-2 h-2"
              aria-hidden="true"
            />
            {Math.abs(changePct).toFixed(1)}%
          </p>
        )}
      </div>
    </a>
  );
}
