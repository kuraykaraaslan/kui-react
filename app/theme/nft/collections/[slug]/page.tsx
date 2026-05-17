import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CollectionStatsBar } from '@/modules/domains/nft/collection/CollectionStatsBar';
import { FloorPriceChart } from '@/modules/domains/nft/collection/FloorPriceChart';
import { NftCard } from '@/modules/domains/nft/asset/NftCard';
import { ActivityFeedRow } from '@/modules/domains/nft/activity/ActivityFeedRow';
import { BlockchainBadge } from '@/modules/domains/nft/wallet/BlockchainBadge';
import { COLLECTIONS, ASSETS, ACTIVITY, FLOOR_PRICE_HISTORY } from '../../nft.data';

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();

  const items = ASSETS.filter((a) => a.collectionId === collection.collectionId);
  const activity = ACTIVITY.filter((e) => e.collectionName === collection.name);
  const history = FLOOR_PRICE_HISTORY[collection.slug] ?? [];

  return (
    <div className="space-y-6 pb-10">
      {/* Banner */}
      <section className="relative h-48 sm:h-64 overflow-hidden bg-surface-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collection.banner}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base/80 to-transparent" />
      </section>

      <div className="px-6 max-w-7xl mx-auto space-y-6 -mt-20 relative">
        {/* Back */}
        <a
          href="/theme/nft/collections"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
          All collections
        </a>

        {/* Header */}
        <div className="flex flex-wrap items-end gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.avatar}
            alt={collection.name}
            className="h-24 w-24 rounded-2xl border-4 border-surface-base object-cover shadow-md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary">{collection.name}</h1>
              {collection.verified && (
                <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5 text-primary" aria-hidden="true" />
              )}
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
              by <a href={`/theme/nft/creators/${collection.creatorHandle}`} className="font-medium text-text-primary hover:text-primary">{collection.creatorHandle}</a>
              <BlockchainBadge chain={collection.blockchain} size="sm" />
            </p>
          </div>
        </div>

        {collection.description && (
          <p className="max-w-3xl text-sm text-text-secondary leading-relaxed">{collection.description}</p>
        )}

        {/* Stats bar */}
        <CollectionStatsBar collection={collection} />

        {/* Floor price chart */}
        {history.length > 0 && (
          <FloorPriceChart points={history} height={220} />
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          <button type="button" className="px-4 py-2 text-sm font-semibold text-text-primary border-b-2 border-primary -mb-px">
            Items ({items.length})
          </button>
          <button type="button" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Activity
          </button>
          <button type="button" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Holders
          </button>
        </div>

        {/* Items grid */}
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface-raised p-12 text-center text-sm text-text-secondary">
            No items in this collection yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((a) => (
              <NftCard key={a.assetId} asset={a} href={`/theme/nft/assets/${a.assetId}`} />
            ))}
          </div>
        )}

        {/* Recent activity */}
        {activity.length > 0 && (
          <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Recent activity</h2>
            </div>
            <div className="divide-y divide-border">
              {activity.slice(0, 5).map((e) => (
                <ActivityFeedRow key={e.eventId} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
