import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGavel, faTag } from '@fortawesome/free-solid-svg-icons';
import { NftDetailHeader } from '@/modules/domains/nft/asset/NftDetailHeader';
import { PriceTag } from '@/modules/domains/nft/asset/PriceTag';
import { TraitTag } from '@/modules/domains/nft/asset/TraitTag';
import { BidHistoryRow } from '@/modules/domains/nft/auction/BidHistoryRow';
import { AuctionCountdown } from '@/modules/domains/nft/auction/AuctionCountdown';
import { ActivityFeedRow } from '@/modules/domains/nft/activity/ActivityFeedRow';
import { ASSETS, COLLECTIONS, BIDS, AUCTIONS, ACTIVITY } from '../../nft.data';

export async function generateStaticParams() {
  return ASSETS.map((a) => ({ id: a.assetId }));
}

export default async function NftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = ASSETS.find((a) => a.assetId === id);
  if (!asset) notFound();

  const collection = COLLECTIONS.find((c) => c.collectionId === asset.collectionId);
  const bids = BIDS[asset.assetId] ?? [];
  const auction = AUCTIONS.find((a) => a.assetId === asset.assetId);
  const provenance = ACTIVITY.filter((e) => e.assetId === asset.assetId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <a
        href="/theme/nft/explore"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
        Back to explore
      </a>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-sunken aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.image} alt={asset.name} className="h-full w-full object-cover" />
          </div>

          {asset.description && (
            <div className="mt-4 rounded-xl border border-border bg-surface-base p-4">
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary mb-2">Description</p>
              <p className="text-sm text-text-secondary leading-relaxed">{asset.description}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-3 space-y-6">
          <NftDetailHeader
            asset={asset}
            collectionName={collection?.name ?? ''}
            collectionSlug={collection?.slug ?? ''}
          />

          {/* Price + CTA */}
          <section className="rounded-2xl border border-border bg-surface-base p-5">
            {auction && (
              <div className="mb-4">
                <AuctionCountdown endsAt={auction.endsAt} label="Auction ends in" size="md" />
              </div>
            )}
            <div className="flex flex-wrap items-end justify-between gap-3">
              {asset.priceEth !== null && asset.priceEth !== undefined ? (
                <PriceTag
                  label={asset.status === 'AUCTION' ? 'Top bid' : 'Current price'}
                  priceEth={asset.priceEth}
                  priceUsd={asset.priceUsd ?? undefined}
                  lastSalePriceEth={asset.lastSalePriceEth ?? undefined}
                  size="lg"
                />
              ) : (
                <p className="text-sm text-text-secondary">Not currently listed.</p>
              )}
              <div className="flex flex-wrap gap-2">
                {asset.status === 'AUCTION' ? (
                  <button className="inline-flex items-center gap-2 rounded-lg bg-warning px-5 py-2.5 text-sm font-semibold text-warning-fg hover:opacity-90 transition-opacity">
                    <FontAwesomeIcon icon={faGavel} className="w-3.5 h-3.5" aria-hidden="true" />
                    Place a bid
                  </button>
                ) : (
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary-hover transition-colors">
                    <FontAwesomeIcon icon={faTag} className="w-3.5 h-3.5" aria-hidden="true" />
                    Buy now
                  </button>
                )}
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-base px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-surface-overlay transition-colors">
                  Make offer
                </button>
              </div>
            </div>
          </section>

          {/* Traits */}
          {asset.traits.length > 0 && (
            <section className="rounded-2xl border border-border bg-surface-base p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Traits</h2>
              <div className="grid gap-2 sm:grid-cols-3">
                {asset.traits.map((t) => (
                  <TraitTag key={`${t.traitType}-${t.value}`} trait={t} />
                ))}
              </div>
            </section>
          )}

          {/* Bids */}
          {bids.length > 0 && (
            <section className="rounded-2xl border border-border bg-surface-base overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary">Bids ({bids.length})</h2>
              </div>
              <div className="p-2 space-y-1">
                {bids.map((b, i) => (
                  <BidHistoryRow key={b.bidId} bid={b} winning={i === 0 && b.status === 'ACTIVE'} />
                ))}
              </div>
            </section>
          )}

          {/* Provenance */}
          {provenance.length > 0 && (
            <section className="rounded-2xl border border-border bg-surface-base overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary">Item history</h2>
              </div>
              <div className="divide-y divide-border">
                {provenance.map((e) => (
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
