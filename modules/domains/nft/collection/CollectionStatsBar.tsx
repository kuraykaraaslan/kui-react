'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import type { NftCollection } from '../types';

type CollectionStatsBarProps = {
  collection: NftCollection;
  className?: string;
};

function format(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function CollectionStatsBar({ collection, className }: CollectionStatsBarProps) {
  const listedPct = collection.itemCount > 0
    ? (collection.listedCount / collection.itemCount) * 100
    : 0;

  const stats = [
    {
      label: 'Floor',
      value: (
        <span className="inline-flex items-center gap-1">
          <FontAwesomeIcon icon={faEthereum} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
          {collection.floorPriceEth.toFixed(2)}
        </span>
      ),
    },
    {
      label: 'Total Volume',
      value: (
        <span className="inline-flex items-center gap-1">
          <FontAwesomeIcon icon={faEthereum} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
          {format(collection.totalVolumeEth)}
        </span>
      ),
    },
    { label: 'Items',  value: format(collection.itemCount) },
    { label: 'Owners', value: format(collection.ownerCount) },
    { label: 'Listed', value: `${listedPct.toFixed(1)}%` },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-5 gap-px rounded-xl border border-border bg-border overflow-hidden',
        className,
      )}
    >
      {stats.map((s) => (
        <div key={s.label} className="bg-surface-base p-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
            {s.label}
          </p>
          <p className="mt-1 text-lg font-bold text-text-primary tabular-nums">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
