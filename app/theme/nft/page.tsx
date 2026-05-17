import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faFire,
  faLayerGroup,
  faUsers,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { CollectionCard } from '@/modules/domains/nft/collection/CollectionCard';
import { NftCard } from '@/modules/domains/nft/asset/NftCard';
import { ActivityFeedRow } from '@/modules/domains/nft/activity/ActivityFeedRow';
import { CreatorLeaderboardRow } from '@/modules/domains/nft/creator/CreatorLeaderboardRow';
import { COLLECTIONS, ASSETS, ACTIVITY, CREATORS } from './nft.data';

const HERO = COLLECTIONS[0];
const TRENDING = [...COLLECTIONS].sort((a, b) => b.totalVolumeEth - a.totalVolumeEth).slice(0, 4);
const TOP_ASSETS = ASSETS
  .filter((a) => a.status !== 'UNLISTED')
  .sort((a, b) => (b.priceEth ?? 0) - (a.priceEth ?? 0))
  .slice(0, 6);
const FEED = ACTIVITY.slice(0, 8);
const TOP_CREATORS = [...CREATORS]
  .sort((a, b) => b.totalVolumeEth - a.totalVolumeEth)
  .slice(0, 5);

const TOTAL_VOL = COLLECTIONS.reduce((sum, c) => sum + c.totalVolumeEth, 0);
const TOTAL_ITEMS = COLLECTIONS.reduce((sum, c) => sum + c.itemCount, 0);
const TOTAL_OWNERS = COLLECTIONS.reduce((sum, c) => sum + c.ownerCount, 0);
const TOTAL_LISTED = COLLECTIONS.reduce((sum, c) => sum + c.listedCount, 0);

const STATS = [
  {
    label: '24h Volume',
    value: (
      <span className="inline-flex items-center gap-1">
        <FontAwesomeIcon icon={faEthereum} className="w-5 h-5 text-text-secondary" aria-hidden="true" />
        {(TOTAL_VOL / 1000).toFixed(1)}K
      </span>
    ),
    icon: faChartLine,
    iconBg: 'bg-primary-subtle text-primary',
  },
  {
    label: 'Listings',     value: TOTAL_LISTED.toLocaleString('en-US'), icon: faFire,        iconBg: 'bg-warning-subtle text-warning-fg' },
  {
    label: 'Items minted', value: TOTAL_ITEMS.toLocaleString('en-US'),  icon: faLayerGroup,  iconBg: 'bg-info-subtle text-info-fg' },
  {
    label: 'Active wallets', value: TOTAL_OWNERS.toLocaleString('en-US'), icon: faUsers,    iconBg: 'bg-success-subtle text-success-fg' },
] as const;

export default function NftHomePage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface-base">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO.banner} alt="" className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-surface-base/70 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-6 p-6 sm:p-10">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary-subtle px-3 py-1 text-xs font-semibold text-secondary">
            <FontAwesomeIcon icon={faFire} className="w-3 h-3" aria-hidden="true" />
            Featured collection
          </span>
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">{HERO.name}</h1>
            <p className="mt-2 text-sm text-text-secondary">{HERO.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Floor</p>
              <p className="mt-0.5 inline-flex items-center gap-1 font-semibold text-text-primary">
                <FontAwesomeIcon icon={faEthereum} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
                {HERO.floorPriceEth.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Items</p>
              <p className="mt-0.5 font-semibold text-text-primary tabular-nums">{HERO.itemCount.toLocaleString('en-US')}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Owners</p>
              <p className="mt-0.5 font-semibold text-text-primary tabular-nums">{HERO.ownerCount.toLocaleString('en-US')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`/theme/nft/collections/${HERO.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover transition-colors"
            >
              Explore collection
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href="/theme/nft/explore"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-base px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-overlay transition-colors"
            >
              Browse all
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-surface-base p-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}>
              <FontAwesomeIcon icon={s.icon} className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary tabular-nums">{s.value}</p>
              <p className="text-xs text-text-secondary">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trending collections */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-text-primary">Trending collections</h2>
          <a href="/theme/nft/collections" className="text-xs font-medium text-primary hover:underline">
            View all
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING.map((c) => (
            <CollectionCard
              key={c.collectionId}
              collection={c}
              href={`/theme/nft/collections/${c.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Top items */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-text-primary">Top listed items</h2>
          <a href="/theme/nft/explore" className="text-xs font-medium text-primary hover:underline">
            View all
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {TOP_ASSETS.map((a) => (
            <NftCard key={a.assetId} asset={a} href={`/theme/nft/assets/${a.assetId}`} />
          ))}
        </div>
      </section>

      {/* Two-column: activity + leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-border bg-surface-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Live activity</h2>
            <a href="/theme/nft/activity" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <div className="divide-y divide-border">
            {FEED.map((e) => (
              <ActivityFeedRow key={e.eventId} event={e} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Top creators · 7d</h2>
          </div>
          <div className="p-2 space-y-0.5">
            {TOP_CREATORS.map((c, i) => (
              <CreatorLeaderboardRow
                key={c.handle}
                rank={i + 1}
                creator={c}
                changePct={[12.4, -3.1, 22.8, 5.4, -0.9][i]}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
