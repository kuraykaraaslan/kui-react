'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHammer,
  faTag,
  faMoneyBillTransfer,
  faGavel,
  faArrowRightArrowLeft,
  faHandshake,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { BlockchainBadge } from '../wallet/BlockchainBadge';
import type { NftActivity, ActivityKind } from '../types';

const kindMeta: Record<ActivityKind, { label: string; icon: typeof faHammer; classes: string }> = {
  MINT:     { label: 'Mint',     icon: faHammer,                classes: 'bg-success-subtle text-success-fg' },
  LIST:     { label: 'List',     icon: faTag,                   classes: 'bg-info-subtle text-info-fg' },
  SALE:     { label: 'Sale',     icon: faMoneyBillTransfer,     classes: 'bg-primary-subtle text-primary' },
  BID:      { label: 'Bid',      icon: faGavel,                 classes: 'bg-warning-subtle text-warning-fg' },
  TRANSFER: { label: 'Transfer', icon: faArrowRightArrowLeft,   classes: 'bg-surface-overlay text-text-secondary' },
  OFFER:    { label: 'Offer',    icon: faHandshake,             classes: 'bg-secondary-subtle text-secondary' },
};

type ActivityFeedRowProps = {
  event: NftActivity;
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

export function ActivityFeedRow({ event, className }: ActivityFeedRowProps) {
  const meta = kindMeta[event.kind];

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 hover:bg-surface-overlay transition-colors',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          meta.classes,
        )}
        aria-label={meta.label}
      >
        <FontAwesomeIcon icon={meta.icon} className="w-3.5 h-3.5" aria-hidden="true" />
      </span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.assetImage}
        alt=""
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-lg object-cover bg-surface-sunken"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-text-primary">
          <span className="font-semibold">{meta.label}</span>{' '}
          <a
            href={`/theme/nft/assets/${event.assetId}`}
            className="font-medium text-primary hover:underline"
          >
            {event.assetName}
          </a>
        </p>
        <p className="truncate text-xs text-text-secondary">
          {event.collectionName}
          {event.fromHandle && (
            <>
              {' · from '}
              <span className="text-text-primary">{event.fromHandle}</span>
            </>
          )}
          {event.toHandle && (
            <>
              {' to '}
              <span className="text-text-primary">{event.toHandle}</span>
            </>
          )}
        </p>
      </div>

      <div className="shrink-0 text-right">
        {event.priceEth !== null && event.priceEth !== undefined ? (
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary tabular-nums">
            <FontAwesomeIcon icon={faEthereum} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
            {event.priceEth.toFixed(3)}
          </p>
        ) : (
          <span className="text-xs text-text-secondary">—</span>
        )}
        <p className="mt-0.5 flex items-center justify-end gap-1.5 text-[11px] text-text-secondary">
          <BlockchainBadge chain={event.blockchain} size="sm" iconOnly />
          {timeAgo(event.timestamp)}
          {event.txHash && (
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-2.5 h-2.5" aria-hidden="true" />
          )}
        </p>
      </div>
    </div>
  );
}
