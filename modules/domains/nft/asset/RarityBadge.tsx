'use client';
import { cn } from '@/libs/utils/cn';
import type { RarityTier } from '../types';

const tierMeta: Record<RarityTier, { label: string; classes: string }> = {
  COMMON:    { label: 'Common',    classes: 'bg-surface-sunken text-text-secondary border border-border' },
  UNCOMMON:  { label: 'Uncommon',  classes: 'bg-success-subtle text-success-fg' },
  RARE:      { label: 'Rare',      classes: 'bg-info-subtle text-info-fg' },
  EPIC:      { label: 'Epic',      classes: 'bg-primary-subtle text-primary' },
  LEGENDARY: { label: 'Legendary', classes: 'bg-warning-subtle text-warning-fg' },
  MYTHIC:    { label: 'Mythic',    classes: 'bg-error-subtle text-error-fg' },
};

type RarityBadgeProps = {
  tier: RarityTier;
  rank?: number;
  size?: 'sm' | 'md';
  className?: string;
};

const sizeMap = {
  sm: 'px-1.5 py-0 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
};

export function RarityBadge({ tier, rank, size = 'md', className }: RarityBadgeProps) {
  const meta = tierMeta[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide',
        meta.classes,
        sizeMap[size],
        className,
      )}
    >
      {meta.label}
      {rank !== undefined && (
        <span className="opacity-70 normal-case">#{rank}</span>
      )}
    </span>
  );
}
