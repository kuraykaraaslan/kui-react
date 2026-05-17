'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faHeart,
  faShareNodes,
  faEllipsis,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import { BlockchainBadge } from '../wallet/BlockchainBadge';
import { RarityBadge } from './RarityBadge';
import type { NftAsset } from '../types';

type NftDetailHeaderProps = {
  asset: NftAsset;
  collectionName: string;
  collectionSlug: string;
  ownerAvatar?: string;
  className?: string;
  onLike?: () => void;
  onShare?: () => void;
};

export function NftDetailHeader({
  asset,
  collectionName,
  collectionSlug,
  ownerAvatar,
  className,
  onLike,
  onShare,
}: NftDetailHeaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <a
        href={`/theme/nft/collections/${collectionSlug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {collectionName}
        <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5" aria-hidden="true" />
      </a>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-text-primary leading-tight">{asset.name}</h1>
          <p className="mt-1 text-sm text-text-secondary font-mono">#{asset.tokenId}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onLike && (
            <button
              type="button"
              onClick={onLike}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-base px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-overlay hover:text-error transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              aria-label="Like"
            >
              <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" aria-hidden="true" />
              {asset.likes}
            </button>
          )}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-base text-text-secondary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              aria-label="Share"
            >
              <FontAwesomeIcon icon={faShareNodes} className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-base text-text-secondary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            aria-label="More options"
          >
            <FontAwesomeIcon icon={faEllipsis} className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Owner + meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <Avatar src={ownerAvatar} name={asset.ownerHandle} size="xs" />
          Owned by{' '}
          <a href={`/theme/nft/creators/${asset.ownerHandle}`} className="font-medium text-text-primary hover:text-primary">
            {asset.ownerHandle}
          </a>
        </span>
        <BlockchainBadge chain={asset.blockchain} size="sm" />
        <RarityBadge tier={asset.rarityTier} rank={asset.rarityRank} size="sm" />
        <span className="inline-flex items-center gap-1">
          <FontAwesomeIcon icon={faEye} className="w-3 h-3" aria-hidden="true" />
          {asset.views} views
        </span>
      </div>
    </div>
  );
}
