'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMedal,
  faStar,
  faAward,
  faCircleCheck,
  faHandshake,
  faHeart,
  faComments,
  faFire,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type ForumBadgeTier = 'bronze' | 'silver' | 'gold';

export type ForumBadge = {
  badgeId: string;
  name: string;
  description?: string;
  tier: ForumBadgeTier;
  count?: number;
  icon?: 'medal' | 'star' | 'award' | 'verified' | 'handshake' | 'heart' | 'comments' | 'fire';
};

type BadgeShelfProps = {
  title?: string;
  badges: ForumBadge[];
  className?: string;
};

const ICON_MAP: Record<NonNullable<ForumBadge['icon']>, IconDefinition> = {
  medal: faMedal,
  star: faStar,
  award: faAward,
  verified: faCircleCheck,
  handshake: faHandshake,
  heart: faHeart,
  comments: faComments,
  fire: faFire,
};

const TIER_CLASSES: Record<ForumBadgeTier, { ring: string; bg: string; fg: string; label: string }> = {
  bronze: { ring: 'ring-[#cd7f32]/30', bg: 'bg-[#cd7f32]/10', fg: 'text-[#a26227]', label: 'Bronze' },
  silver: { ring: 'ring-text-secondary/30', bg: 'bg-surface-overlay', fg: 'text-text-primary', label: 'Silver' },
  gold:   { ring: 'ring-warning/30', bg: 'bg-warning/10', fg: 'text-warning', label: 'Gold' },
};

export function BadgeShelf({ title = 'Badges', badges, className }: BadgeShelfProps) {
  return (
    <section
      className={cn(
        'rounded-lg border border-border bg-surface-raised p-4',
        className,
      )}
      aria-label={title}
    >
      <header className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-xs text-text-secondary">{badges.length} earned</span>
      </header>

      {badges.length === 0 ? (
        <p className="text-xs text-text-secondary italic">No badges yet.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {badges.map((b) => {
            const tier = TIER_CLASSES[b.tier];
            const icon = ICON_MAP[b.icon ?? 'medal'];
            return (
              <li key={b.badgeId} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full ring-2',
                    tier.bg,
                    tier.ring,
                    tier.fg,
                  )}
                  aria-label={`${tier.label} badge`}
                >
                  <FontAwesomeIcon icon={icon} className="w-4 h-4" aria-hidden="true" />
                </span>
                <p className="mt-1.5 text-xs font-medium text-text-primary line-clamp-1">{b.name}</p>
                {b.count !== undefined && b.count > 1 && (
                  <p className="text-[11px] text-text-secondary tabular-nums">×{b.count}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
