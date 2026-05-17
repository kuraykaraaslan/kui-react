import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CreatorProfileCard } from '@/modules/domains/nft/creator/CreatorProfileCard';
import { NftCard } from '@/modules/domains/nft/asset/NftCard';
import { CollectionCard } from '@/modules/domains/nft/collection/CollectionCard';
import { ActivityFeedRow } from '@/modules/domains/nft/activity/ActivityFeedRow';
import { CREATORS, COLLECTIONS, ASSETS, ACTIVITY } from '../../nft.data';

export async function generateStaticParams() {
  return CREATORS.map((c) => ({ handle: c.handle }));
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const creator = CREATORS.find((c) => c.handle === handle);
  if (!creator) notFound();

  const collections = COLLECTIONS.filter((c) => c.creatorHandle === handle);
  const created = ASSETS.filter((a) => a.creatorHandle === handle);
  const activity = ACTIVITY.filter((e) => e.fromHandle === handle || e.toHandle === handle);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <a
        href="/theme/nft"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
        Home
      </a>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CreatorProfileCard creator={creator} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border">
            <button type="button" className="px-4 py-2 text-sm font-semibold text-text-primary border-b-2 border-primary -mb-px">
              Created ({created.length})
            </button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Collected
            </button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Activity
            </button>
          </div>

          {/* Collections */}
          {collections.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-text-primary">Collections</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {collections.map((c) => (
                  <CollectionCard
                    key={c.collectionId}
                    collection={c}
                    href={`/theme/nft/collections/${c.slug}`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Created items */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-text-primary">Items by {creator.displayName}</h2>
            {created.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-surface-raised p-12 text-center text-sm text-text-secondary">
                No items yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {created.map((a) => (
                  <NftCard key={a.assetId} asset={a} href={`/theme/nft/assets/${a.assetId}`} />
                ))}
              </div>
            )}
          </section>

          {/* Activity */}
          {activity.length > 0 && (
            <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary">Recent activity</h2>
              </div>
              <div className="divide-y divide-border">
                {activity.map((e) => (
                  <ActivityFeedRow key={e.eventId} event={e} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
