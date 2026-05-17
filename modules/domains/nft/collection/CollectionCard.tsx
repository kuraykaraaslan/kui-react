'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { BlockchainBadge } from '../wallet/BlockchainBadge';
import type { NftCollection } from '../types';

type CollectionCardProps = {
  collection: NftCollection;
  href?: string;
  className?: string;
};

function formatVolume(eth: number): string {
  if (eth >= 1000) return `${(eth / 1000).toFixed(1)}k`;
  if (eth >= 1) return eth.toFixed(1);
  return eth.toFixed(2);
}

export function CollectionCard({ collection, href, className }: CollectionCardProps) {
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href } : {};
  const change = collection.volumeChange24hPct;
  const positive = (change ?? 0) >= 0;

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group block overflow-hidden rounded-2xl border border-border bg-surface-base transition-shadow hover:shadow-lg',
        href && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      {/* Banner */}
      <div className="relative h-24 overflow-hidden bg-surface-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collection.banner}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <BlockchainBadge chain={collection.blockchain} size="sm" iconOnly />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4">
        <div className="-mt-8 mb-2 flex items-end gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.avatar}
            alt={collection.name}
            loading="lazy"
            className="h-16 w-16 rounded-xl border-4 border-surface-base object-cover shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-sm font-semibold text-text-primary">{collection.name}</h3>
          {collection.verified && (
            <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-text-secondary">by {collection.creatorHandle}</p>

        <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Floor</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-text-primary tabular-nums">
              <FontAwesomeIcon icon={faEthereum} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
              {collection.floorPriceEth.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">24h Vol</p>
            <p className="mt-0.5 flex items-center justify-start gap-1 text-sm font-semibold text-text-primary tabular-nums">
              {formatVolume(collection.totalVolumeEth)}
              {change !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-[10px] font-semibold',
                    positive ? 'text-success' : 'text-error',
                  )}
                >
                  <FontAwesomeIcon
                    icon={positive ? faArrowUp : faArrowDown}
                    className="w-2 h-2"
                    aria-hidden="true"
                  />
                  {Math.abs(change).toFixed(1)}%
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
