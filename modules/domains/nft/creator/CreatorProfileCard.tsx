'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faGlobe,
  faCopy,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faInstagram,
  faDiscord,
} from '@fortawesome/free-brands-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import type { NftCreator, SocialLink } from '../types';

type CreatorProfileCardProps = {
  creator: NftCreator;
  following?: boolean;
  onFollowToggle?: () => void;
  className?: string;
};

function shortenAddress(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function socialIcon(platform: SocialLink['platform']) {
  if (platform === 'TWITTER')   return faTwitter;
  if (platform === 'INSTAGRAM') return faInstagram;
  if (platform === 'DISCORD')   return faDiscord;
  return faGlobe;
}

export function CreatorProfileCard({
  creator,
  following = false,
  onFollowToggle,
  className,
}: CreatorProfileCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-surface-base',
        className,
      )}
    >
      {/* Banner */}
      <div className="relative h-32 bg-surface-sunken">
        {creator.banner && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={creator.banner} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="p-5">
        <div className="-mt-12 mb-3 flex flex-wrap items-end justify-between gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-surface-base bg-surface-base shadow-sm overflow-hidden">
            <Avatar src={creator.avatar} name={creator.displayName} size="xl" className="border-0 rounded-none" />
          </div>
          {onFollowToggle && (
            <Button
              variant={following ? 'outline' : 'primary'}
              size="sm"
              onClick={onFollowToggle}
              iconLeft={<FontAwesomeIcon icon={faUserPlus} className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              {following ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-text-primary">{creator.displayName}</h2>
          {creator.verified && (
            <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 text-primary" aria-hidden="true" />
          )}
        </div>
        <p className="mt-0.5 text-sm text-text-secondary">@{creator.handle}</p>

        {creator.bio && (
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">{creator.bio}</p>
        )}

        {/* Wallet */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2">
          <span className="font-mono text-xs text-text-secondary truncate flex-1">
            {shortenAddress(creator.walletAddress)}
          </span>
          <button
            type="button"
            aria-label="Copy address"
            className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
          >
            <FontAwesomeIcon icon={faCopy} className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <div>
            <p className="text-lg font-bold text-text-primary tabular-nums">{creator.itemsCreated}</p>
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Items</p>
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary tabular-nums">{creator.collectionsCount}</p>
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Collections</p>
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary tabular-nums">
              {creator.followers >= 1000
                ? `${(creator.followers / 1000).toFixed(1)}K`
                : creator.followers}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Followers</p>
          </div>
        </div>

        {/* Socials */}
        {creator.socials.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {creator.socials.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                aria-label={s.platform}
              >
                <FontAwesomeIcon icon={socialIcon(s.platform)} className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
