'use client';
import { cn } from '@/libs/utils/cn';
import type { NftTrait } from '../types';

type TraitTagProps = {
  trait: NftTrait;
  size?: 'sm' | 'md';
  className?: string;
};

export function TraitTag({ trait, size = 'md', className }: TraitTagProps) {
  const sizeClasses = size === 'sm' ? 'p-2 text-[11px]' : 'p-2.5 text-xs';
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface-raised text-center',
        sizeClasses,
        className,
      )}
    >
      <p className="font-medium uppercase tracking-wide text-primary opacity-80">
        {trait.traitType}
      </p>
      <p className="mt-0.5 font-semibold text-text-primary truncate">{trait.value}</p>
      {trait.rarityPercent !== undefined && (
        <p className="mt-0.5 text-text-secondary">
          {trait.rarityPercent < 1
            ? trait.rarityPercent.toFixed(2)
            : trait.rarityPercent.toFixed(1)}
          % have this
        </p>
      )}
    </div>
  );
}
