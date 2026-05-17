'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import type { NftBid } from '../types';

type BidHistoryRowProps = {
  bid: NftBid;
  winning?: boolean;
  className?: string;
};

function timeAgo(date: Date): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function BidHistoryRow({ bid, winning = false, className }: BidHistoryRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg',
        winning && 'bg-warning-subtle',
        className,
      )}
    >
      <Avatar src={bid.bidderAvatar} name={bid.bidderHandle} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-medium text-text-primary truncate">
          {bid.bidderHandle}
          {winning && (
            <FontAwesomeIcon icon={faTrophy} className="w-3 h-3 text-warning" aria-hidden="true" />
          )}
        </p>
        <p className="text-xs text-text-secondary">{timeAgo(bid.placedAt)}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary tabular-nums">
          <FontAwesomeIcon icon={faEthereum} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
          {bid.amountEth.toFixed(3)}
        </p>
        {bid.amountUsd !== undefined && (
          <p className="text-[11px] text-text-secondary tabular-nums">
            ${bid.amountUsd.toFixed(0)}
          </p>
        )}
      </div>

      <button
        type="button"
        className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
        aria-label="View transaction"
      >
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" aria-hidden="true" />
      </button>
    </div>
  );
}
