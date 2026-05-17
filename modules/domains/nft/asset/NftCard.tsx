'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEye, faGavel, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { RarityBadge } from './RarityBadge';
import { BlockchainBadge } from '../wallet/BlockchainBadge';
import { PriceTag } from './PriceTag';
import type { NftAsset } from '../types';

type NftCardProps = {
  asset: NftAsset;
  href?: string;
  className?: string;
  onLike?: () => void;
};

export function NftCard({ asset, href, className, onLike }: NftCardProps) {
  const isAuction = asset.status === 'AUCTION';
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group block overflow-hidden rounded-2xl border border-border bg-surface-base transition-all',
        'hover:border-border-strong hover:shadow-lg',
        href && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.image}
          alt={asset.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          <BlockchainBadge chain={asset.blockchain} size="sm" iconOnly />
        </div>
        <div className="absolute right-2 top-2">
          <RarityBadge tier={asset.rarityTier} size="sm" />
        </div>
        {isAuction && (
          <span className="absolute left-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-[10px] font-semibold text-warning-fg">
            <FontAwesomeIcon icon={faGavel} className="w-2.5 h-2.5" aria-hidden="true" />
            Live auction
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-text-primary">{asset.name}</p>
          {asset.rarityRank !== undefined && (
            <span className="shrink-0 rounded-full bg-surface-overlay px-1.5 py-0 text-[10px] font-medium text-text-secondary">
              #{asset.rarityRank}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 text-xs text-text-secondary">
          <span className="truncate">{asset.creatorHandle}</span>
          <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
        </p>

        <div className="flex items-end justify-between gap-2 pt-1 border-t border-border">
          {asset.priceEth !== null && asset.priceEth !== undefined ? (
            <PriceTag
              label={isAuction ? 'Top bid' : 'Price'}
              priceEth={asset.priceEth}
              size="sm"
            />
          ) : (
            <span className="text-xs text-text-secondary">Not listed</span>
          )}

          <div className="flex items-center gap-2 text-xs text-text-secondary">
            {onLike ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onLike(); }}
                className="inline-flex items-center gap-1 hover:text-error transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
                aria-label={`Like ${asset.name}`}
              >
                <FontAwesomeIcon icon={faHeart} className="w-3 h-3" aria-hidden="true" />
                {asset.likes}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faHeart} className="w-3 h-3" aria-hidden="true" />
                {asset.likes}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} className="w-3 h-3" aria-hidden="true" />
              {asset.views}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
