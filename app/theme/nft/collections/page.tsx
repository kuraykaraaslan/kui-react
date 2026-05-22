import type { Metadata } from 'next';
import { CollectionCard } from '@/modules/domains/nft/collection/CollectionCard';
import { COLLECTIONS } from '../nft.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('Collections', THEME_TITLES.nft),
};

const TABS = ['Trending', 'Top', 'New'] as const;

export default function NftCollectionsPage() {
  const sorted = [...COLLECTIONS].sort((a, b) => b.totalVolumeEth - a.totalVolumeEth);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Collections</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {COLLECTIONS.length} curated drops across multiple chains.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            className={
              i === 0
                ? 'px-4 py-2 text-sm font-semibold text-text-primary border-b-2 border-primary -mb-px'
                : 'px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors'
            }
          >
            {t}
          </button>
        ))}
        <label className="ml-auto text-xs font-medium text-text-secondary pb-2">
          Chain
          <select className="ml-2 rounded-lg border border-border bg-surface-base px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            <option>All chains</option>
            <option>Ethereum</option>
            <option>Polygon</option>
            <option>Solana</option>
            <option>Base</option>
            <option>Arbitrum</option>
          </select>
        </label>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((c) => (
          <CollectionCard
            key={c.collectionId}
            collection={c}
            href={`/theme/nft/collections/${c.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
