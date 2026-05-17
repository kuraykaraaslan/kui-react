import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { ActivityFeedRow } from '@/modules/domains/nft/activity/ActivityFeedRow';
import { ACTIVITY, COLLECTIONS } from '../nft.data';

export default function NftActivityPage() {
  const sorted = [...ACTIVITY].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Activity</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Live marketplace events across {COLLECTIONS.length} collections.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-surface-base p-4">
        <div className="flex flex-wrap items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-text-secondary" aria-hidden="true" />

          <label className="text-xs font-medium text-text-secondary">
            Event
            <select className="ml-2 rounded-lg border border-border bg-surface-base px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
              <option>All events</option>
              <option>Sales</option>
              <option>Bids</option>
              <option>Listings</option>
              <option>Mints</option>
              <option>Transfers</option>
              <option>Offers</option>
            </select>
          </label>

          <label className="text-xs font-medium text-text-secondary">
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

          <label className="text-xs font-medium text-text-secondary">
            Collection
            <select className="ml-2 rounded-lg border border-border bg-surface-base px-2 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
              <option>All collections</option>
              {COLLECTIONS.map((c) => (
                <option key={c.collectionId}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Feed */}
      <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
        <div className="divide-y divide-border">
          {sorted.map((e) => (
            <ActivityFeedRow key={e.eventId} event={e} />
          ))}
        </div>
      </section>
    </div>
  );
}
