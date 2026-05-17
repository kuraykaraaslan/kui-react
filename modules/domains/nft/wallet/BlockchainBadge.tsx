'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import type { Blockchain } from '../types';

const chainMeta: Record<Blockchain, { label: string; classes: string; useEth: boolean }> = {
  ETHEREUM: { label: 'Ethereum', classes: 'bg-primary-subtle text-primary',         useEth: true  },
  POLYGON:  { label: 'Polygon',  classes: 'bg-secondary-subtle text-secondary',     useEth: false },
  SOLANA:   { label: 'Solana',   classes: 'bg-info-subtle text-info-fg',            useEth: false },
  BASE:     { label: 'Base',     classes: 'bg-primary-subtle text-primary',         useEth: false },
  ARBITRUM: { label: 'Arbitrum', classes: 'bg-info-subtle text-info-fg',            useEth: false },
};

type BlockchainBadgeProps = {
  chain: Blockchain;
  size?: 'sm' | 'md';
  iconOnly?: boolean;
  className?: string;
};

const sizeMap = {
  sm: 'px-1.5 py-0 text-[10px] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1.5',
};

export function BlockchainBadge({ chain, size = 'md', iconOnly = false, className }: BlockchainBadgeProps) {
  const meta = chainMeta[chain];
  const icon = meta.useEth ? faEthereum : faCube;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        meta.classes,
        sizeMap[size],
        iconOnly && 'aspect-square justify-center px-0 w-5',
        className,
      )}
      aria-label={meta.label}
    >
      <FontAwesomeIcon icon={icon} className="w-3 h-3" aria-hidden="true" />
      {!iconOnly && meta.label}
    </span>
  );
}
