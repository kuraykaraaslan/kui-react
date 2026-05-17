import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { NftCard } from '@/modules/domains/nft/asset/NftCard';
import { ASSETS, COLLECTIONS } from '../nft.data';

export default function NftExplorePage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Explore NFTs</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {ASSETS.length} items across {COLLECTIONS.length} collections
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-surface-base p-4">
        <div className="flex flex-wrap items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-text-secondary" aria-hidden="true" />

          <label className="text-xs font-medium text-text-secondary">
            Chain
            <select className="ml-2 rounded-lg border border-border bg-surface-base px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
              <option>All</option>
              <option>Ethereum</option>
              <option>Polygon</option>
              <option>Solana</option>
              <option>Base</option>
              <option>Arbitrum</option>
            </select>
          </label>

          <label className="text-xs font-medium text-text-secondary">
            Status
            <select className="ml-2 rounded-lg border border-border bg-surface-base px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
              <option>All</option>
              <option>Listed</option>
              <option>Auction</option>
            </select>
          </label>

          <label className="text-xs font-medium text-text-secondary">
            Rarity
            <select className="ml-2 rounded-lg border border-border bg-surface-base px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
              <option>All tiers</option>
              <option>Common+</option>
              <option>Rare+</option>
              <option>Legendary+</option>
              <option>Mythic only</option>
            </select>
          </label>

          <label className="text-xs font-medium text-text-secondary">
            Sort
            <select className="ml-2 rounded-lg border border-border bg-surface-base px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
              <option>Recently listed</option>
              <option>Price low → high</option>
              <option>Price high → low</option>
              <option>Most liked</option>
            </select>
          </label>

          <span className="ml-auto text-xs text-text-secondary">
            Showing <strong className="text-text-primary">{ASSETS.length}</strong> results
          </span>
        </div>
      </section>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {ASSETS.map((a) => (
          <NftCard key={a.assetId} asset={a} href={`/theme/nft/assets/${a.assetId}`} />
        ))}
      </div>
    </div>
  );
}
