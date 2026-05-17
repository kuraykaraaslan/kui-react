'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { NftCard } from '@/modules/domains/nft/asset/NftCard';
import { NftDetailHeader } from '@/modules/domains/nft/asset/NftDetailHeader';
import { TraitTag } from '@/modules/domains/nft/asset/TraitTag';
import { RarityBadge } from '@/modules/domains/nft/asset/RarityBadge';
import { PriceTag } from '@/modules/domains/nft/asset/PriceTag';
import { CollectionCard } from '@/modules/domains/nft/collection/CollectionCard';
import { CollectionStatsBar } from '@/modules/domains/nft/collection/CollectionStatsBar';
import { FloorPriceChart } from '@/modules/domains/nft/collection/FloorPriceChart';
import { CreatorProfileCard } from '@/modules/domains/nft/creator/CreatorProfileCard';
import { CreatorLeaderboardRow } from '@/modules/domains/nft/creator/CreatorLeaderboardRow';
import { ActivityFeedRow } from '@/modules/domains/nft/activity/ActivityFeedRow';
import { AuctionCountdown } from '@/modules/domains/nft/auction/AuctionCountdown';
import { BidHistoryRow } from '@/modules/domains/nft/auction/BidHistoryRow';
import { WalletConnectButton } from '@/modules/domains/nft/wallet/WalletConnectButton';
import { BlockchainBadge } from '@/modules/domains/nft/wallet/BlockchainBadge';
import { MintProgressBar } from '@/modules/domains/nft/mint/MintProgressBar';
import type {
  NftAsset,
  NftCollection,
  NftCreator,
  NftBid,
  NftActivity,
} from '@/modules/domains/nft/types';

/* ─── demo data ─── */

const DEMO_ASSET_LISTED: NftAsset = {
  assetId: 'demo-asset-1',
  tokenId: '042',
  name: 'Genesis Sigil 042',
  image: 'https://picsum.photos/seed/nft-demo-1/600/600',
  collectionId: 'demo-col-1',
  creatorHandle: 'novabyte',
  ownerHandle: 'glyph.eth',
  blockchain: 'ETHEREUM',
  tokenStandard: 'ERC721',
  traits: [
    { traitType: 'Form',    value: 'Crystalline', rarityPercent: 0.3 },
    { traitType: 'Palette', value: 'Aurora',      rarityPercent: 1.2 },
    { traitType: 'Entropy', value: 'Maximal',     rarityPercent: 0.5 },
  ],
  priceEth: 0.85,
  priceUsd: 2_635,
  lastSalePriceEth: 0.72,
  status: 'LISTED',
  rarityTier: 'LEGENDARY',
  rarityRank: 12,
  likes: 184,
  views: 5_212,
  listedAt: new Date(Date.now() - 3 * 3_600_000),
};

const DEMO_ASSET_AUCTION: NftAsset = {
  ...DEMO_ASSET_LISTED,
  assetId: 'demo-asset-2',
  tokenId: '001',
  name: 'Genesis Sigil 001',
  image: 'https://picsum.photos/seed/nft-demo-2/600/600',
  status: 'AUCTION',
  rarityTier: 'MYTHIC',
  rarityRank: 1,
  priceEth: 4.2,
  priceUsd: 13_020,
  lastSalePriceEth: 3.4,
  likes: 312,
};

const DEMO_COLLECTION: NftCollection = {
  collectionId: 'demo-col-1',
  slug: 'glyph-genesis',
  name: 'Glyph Genesis',
  description: 'The founding 1024-piece collection.',
  banner: 'https://picsum.photos/seed/nft-demo-col-banner/800/200',
  avatar: 'https://picsum.photos/seed/nft-demo-col-avatar/200/200',
  creatorHandle: 'novabyte',
  verified: true,
  blockchain: 'ETHEREUM',
  floorPriceEth: 0.42,
  totalVolumeEth: 1842.5,
  itemCount: 1024,
  ownerCount: 612,
  listedCount: 87,
  volumeChange24hPct: 12.4,
  floorChange24hPct: 3.1,
};

const DEMO_CREATOR: NftCreator = {
  handle: 'novabyte',
  displayName: 'Nova Byte',
  avatar: 'https://i.pravatar.cc/200?img=12',
  banner: 'https://picsum.photos/seed/nft-demo-creator-banner/600/200',
  verified: true,
  walletAddress: '0xA1b2C3d4E5f6789012345678901234567890aBcD',
  bio: 'Generative artist exploring code and chaos.',
  collectionsCount: 4,
  itemsCreated: 312,
  followers: 24_530,
  totalVolumeEth: 1842.5,
  joinedAt: new Date('2022-04-12'),
  socials: [
    { platform: 'TWITTER', url: 'https://twitter.com/novabyte' },
    { platform: 'WEBSITE', url: 'https://novabyte.art' },
  ],
};

const DEMO_BID_WINNING: NftBid = {
  bidId: 'demo-bid-1',
  assetId: 'demo-asset-2',
  bidderHandle: '0xWhale',
  bidderAvatar: 'https://i.pravatar.cc/100?img=15',
  amountEth: 4.2,
  amountUsd: 13_020,
  placedAt: new Date(Date.now() - 7 * 60_000),
  status: 'ACTIVE',
};

const DEMO_BID_OUTBID: NftBid = {
  ...DEMO_BID_WINNING,
  bidId: 'demo-bid-2',
  bidderHandle: 'glyph-collector',
  bidderAvatar: 'https://i.pravatar.cc/100?img=22',
  amountEth: 3.85,
  amountUsd: 11_935,
  placedAt: new Date(Date.now() - 28 * 60_000),
  status: 'OUTBID',
};

const DEMO_ACTIVITY: NftActivity = {
  eventId: 'demo-evt-1',
  kind: 'SALE',
  assetId: 'demo-asset-1',
  assetName: 'Genesis Sigil 042',
  assetImage: 'https://picsum.photos/seed/nft-demo-1/100/100',
  collectionName: 'Glyph Genesis',
  fromHandle: 'novabyte',
  toHandle: 'glyph-collector',
  priceEth: 0.85,
  txHash: '0xab12cd34',
  blockchain: 'ETHEREUM',
  timestamp: new Date(Date.now() - 4 * 60_000),
};

const DEMO_FLOOR_HISTORY = Array.from({ length: 14 }, (_, i) => ({
  date: `${String(i + 1).padStart(2, '0')}/05`,
  floorEth: +(0.35 + Math.sin(i / 2) * 0.06 + i * 0.005).toFixed(3),
}));

/* ─── showcase builder ─── */

export function buildNftDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'nft-rarity-badge',
      title: 'RarityBadge',
      category: 'Domain',
      abbr: 'RB',
      description: 'Tier-coloured badge — Common, Uncommon, Rare, Epic, Legendary, Mythic.',
      filePath: 'modules/domains/nft/asset/RarityBadge.tsx',
      sourceCode: `'use client';
import { Badge } from '@/modules/ui/Badge';
import type { RarityTier } from '../types';

export function RarityBadge({ tier, rank, size = 'md' }) {
  // tier-coloured pill, optional #rank suffix
}`,
      variants: [
        {
          title: 'All tiers',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <RarityBadge tier="COMMON" />
              <RarityBadge tier="UNCOMMON" />
              <RarityBadge tier="RARE" />
              <RarityBadge tier="EPIC" />
              <RarityBadge tier="LEGENDARY" />
              <RarityBadge tier="MYTHIC" />
            </div>
          ),
          code: `<RarityBadge tier="COMMON" />
<RarityBadge tier="MYTHIC" />`,
        },
        {
          title: 'With rank',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <RarityBadge tier="LEGENDARY" rank={12} />
              <RarityBadge tier="MYTHIC" rank={1} size="sm" />
            </div>
          ),
          code: `<RarityBadge tier="LEGENDARY" rank={12} />
<RarityBadge tier="MYTHIC" rank={1} size="sm" />`,
        },
      ],
    },
    {
      id: 'nft-blockchain-badge',
      title: 'BlockchainBadge',
      category: 'Domain',
      abbr: 'BB',
      description: 'Chain pill — Ethereum, Polygon, Solana, Base, Arbitrum.',
      filePath: 'modules/domains/nft/wallet/BlockchainBadge.tsx',
      sourceCode: `'use client';
import type { Blockchain } from '../types';

export function BlockchainBadge({ chain, size = 'md', iconOnly = false }) {
  // chain-coloured pill with FA icon
}`,
      variants: [
        {
          title: 'All chains',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <BlockchainBadge chain="ETHEREUM" />
              <BlockchainBadge chain="POLYGON" />
              <BlockchainBadge chain="SOLANA" />
              <BlockchainBadge chain="BASE" />
              <BlockchainBadge chain="ARBITRUM" />
            </div>
          ),
          code: `<BlockchainBadge chain="ETHEREUM" />
<BlockchainBadge chain="POLYGON" />`,
        },
        {
          title: 'Icon-only',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <BlockchainBadge chain="ETHEREUM" iconOnly />
              <BlockchainBadge chain="POLYGON" iconOnly />
              <BlockchainBadge chain="SOLANA" iconOnly />
            </div>
          ),
          code: `<BlockchainBadge chain="ETHEREUM" iconOnly />`,
        },
      ],
    },
    {
      id: 'nft-price-tag',
      title: 'PriceTag',
      category: 'Domain',
      abbr: 'PT',
      description: 'Dual ETH / USD price display with optional last-sale delta arrow.',
      filePath: 'modules/domains/nft/asset/PriceTag.tsx',
      sourceCode: `'use client';

export function PriceTag({ label, priceEth, priceUsd, lastSalePriceEth, size = 'md' }) {
  // ETH icon + value, optional USD line, optional delta arrow
}`,
      variants: [
        {
          title: 'Listed with delta',
          layout: 'side',
          preview: (
            <PriceTag label="Current price" priceEth={0.85} priceUsd={2_635} lastSalePriceEth={0.72} size="lg" />
          ),
          code: `<PriceTag label="Current price" priceEth={0.85} priceUsd={2635} lastSalePriceEth={0.72} size="lg" />`,
        },
        {
          title: 'Sizes',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap items-end gap-6">
              <PriceTag label="Sm" priceEth={0.42} size="sm" />
              <PriceTag label="Md" priceEth={0.42} priceUsd={1_300} size="md" />
              <PriceTag label="Lg" priceEth={0.42} priceUsd={1_300} size="lg" />
            </div>
          ),
          code: `<PriceTag label="Md" priceEth={0.42} priceUsd={1300} size="md" />`,
        },
      ],
    },
    {
      id: 'nft-trait-tag',
      title: 'TraitTag',
      category: 'Domain',
      abbr: 'TT',
      description: 'Single trait chip — type, value, and rarity percentage.',
      filePath: 'modules/domains/nft/asset/TraitTag.tsx',
      sourceCode: `'use client';
import type { NftTrait } from '../types';

export function TraitTag({ trait, size = 'md' }) {
  // small panel with type / value / "X% have this"
}`,
      variants: [
        {
          title: 'Trait grid',
          layout: 'side',
          preview: (
            <div className="grid grid-cols-3 gap-2 w-full max-w-md">
              <TraitTag trait={{ traitType: 'Form',    value: 'Crystalline', rarityPercent: 0.3 }} />
              <TraitTag trait={{ traitType: 'Palette', value: 'Aurora',      rarityPercent: 1.2 }} />
              <TraitTag trait={{ traitType: 'Entropy', value: 'Maximal',     rarityPercent: 0.5 }} />
            </div>
          ),
          code: `<TraitTag trait={{ traitType: 'Form', value: 'Crystalline', rarityPercent: 0.3 }} />`,
        },
        {
          title: 'Without rarity',
          layout: 'side',
          preview: (
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
              <TraitTag trait={{ traitType: 'Ring',    value: 'Triple' }} />
              <TraitTag trait={{ traitType: 'Glyph',   value: 'Solar' }} />
            </div>
          ),
          code: `<TraitTag trait={{ traitType: 'Ring', value: 'Triple' }} />`,
        },
      ],
    },
    {
      id: 'nft-card',
      title: 'NftCard',
      category: 'Domain',
      abbr: 'NC',
      description: 'Image-forward NFT tile — thumbnail, name, price, like + view counters, status pill.',
      filePath: 'modules/domains/nft/asset/NftCard.tsx',
      sourceCode: `'use client';
import type { NftAsset } from '../types';

export function NftCard({ asset, href, onLike }) {
  // image, rarity, chain icon, price, likes/views
}`,
      variants: [
        {
          title: 'Listed',
          layout: 'side',
          preview: (
            <div className="w-64">
              <NftCard asset={DEMO_ASSET_LISTED} />
            </div>
          ),
          code: `<NftCard asset={asset} href="/theme/nft/assets/abc" />`,
        },
        {
          title: 'Live auction',
          layout: 'side',
          preview: (
            <div className="w-64">
              <NftCard asset={DEMO_ASSET_AUCTION} />
            </div>
          ),
          code: `<NftCard asset={auctionAsset} />`,
        },
      ],
    },
    {
      id: 'nft-detail-header',
      title: 'NftDetailHeader',
      category: 'Domain',
      abbr: 'DH',
      description: 'Asset page header — collection link, name, token id, owner, share / like actions.',
      filePath: 'modules/domains/nft/asset/NftDetailHeader.tsx',
      sourceCode: `'use client';
import type { NftAsset } from '../types';

export function NftDetailHeader({ asset, collectionName, collectionSlug }) {
  // crumb, h1, owner, rarity, chain
}`,
      variants: [
        {
          title: 'Full header',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-2xl">
              <NftDetailHeader
                asset={DEMO_ASSET_AUCTION}
                collectionName="Glyph Genesis"
                collectionSlug="glyph-genesis"
                onLike={() => {}}
                onShare={() => {}}
              />
            </div>
          ),
          code: `<NftDetailHeader asset={asset} collectionName="Glyph Genesis" collectionSlug="glyph-genesis" />`,
        },
      ],
    },
    {
      id: 'nft-collection-card',
      title: 'CollectionCard',
      category: 'Domain',
      abbr: 'CC',
      description: 'Collection tile — banner + avatar, floor, 24h volume, chain badge.',
      filePath: 'modules/domains/nft/collection/CollectionCard.tsx',
      sourceCode: `'use client';
import type { NftCollection } from '../types';

export function CollectionCard({ collection, href }) {
  // banner, avatar, floor, 24h vol, verified
}`,
      variants: [
        {
          title: 'Verified collection',
          layout: 'side',
          preview: (
            <div className="w-72">
              <CollectionCard collection={DEMO_COLLECTION} />
            </div>
          ),
          code: `<CollectionCard collection={collection} href="/theme/nft/collections/glyph-genesis" />`,
        },
        {
          title: 'Falling floor',
          layout: 'side',
          preview: (
            <div className="w-72">
              <CollectionCard
                collection={{ ...DEMO_COLLECTION, volumeChange24hPct: -8.4, floorChange24hPct: -3.2 }}
              />
            </div>
          ),
          code: `<CollectionCard collection={{ ...c, volumeChange24hPct: -8.4 }} />`,
        },
      ],
    },
    {
      id: 'nft-collection-stats-bar',
      title: 'CollectionStatsBar',
      category: 'Domain',
      abbr: 'SB',
      description: 'Horizontal stat strip — floor, volume, items, owners, listed %.',
      filePath: 'modules/domains/nft/collection/CollectionStatsBar.tsx',
      sourceCode: `'use client';

export function CollectionStatsBar({ collection }) {
  // 5-up stat strip
}`,
      variants: [
        {
          title: 'Default',
          layout: 'stack',
          preview: <CollectionStatsBar collection={DEMO_COLLECTION} />,
          code: `<CollectionStatsBar collection={collection} />`,
        },
      ],
    },
    {
      id: 'nft-floor-price-chart',
      title: 'FloorPriceChart',
      category: 'Domain',
      abbr: 'FC',
      description: 'Time-series chart of collection floor price over a configurable window.',
      filePath: 'modules/domains/nft/collection/FloorPriceChart.tsx',
      sourceCode: `'use client';

export function FloorPriceChart({ points, height = 220 }) {
  // SVG line + area chart with auto grid
}`,
      variants: [
        {
          title: '14-day window',
          layout: 'stack',
          preview: <FloorPriceChart points={DEMO_FLOOR_HISTORY} height={200} />,
          code: `<FloorPriceChart points={floorHistory} height={200} />`,
        },
      ],
    },
    {
      id: 'nft-creator-profile-card',
      title: 'CreatorProfileCard',
      category: 'Domain',
      abbr: 'CP',
      description: 'Creator block — avatar, handle, verified, wallet, follower count, social links.',
      filePath: 'modules/domains/nft/creator/CreatorProfileCard.tsx',
      sourceCode: `'use client';
import type { NftCreator } from '../types';

export function CreatorProfileCard({ creator, following, onFollowToggle }) {
  // banner, avatar, bio, wallet, stats, socials
}`,
      variants: [
        {
          title: 'Not following',
          layout: 'side',
          preview: (
            <div className="w-80">
              <CreatorProfileCard creator={DEMO_CREATOR} onFollowToggle={() => {}} />
            </div>
          ),
          code: `<CreatorProfileCard creator={creator} onFollowToggle={fn} />`,
        },
        {
          title: 'Following',
          layout: 'side',
          preview: (
            <div className="w-80">
              <CreatorProfileCard creator={DEMO_CREATOR} following onFollowToggle={() => {}} />
            </div>
          ),
          code: `<CreatorProfileCard creator={creator} following onFollowToggle={fn} />`,
        },
      ],
    },
    {
      id: 'nft-creator-leaderboard-row',
      title: 'CreatorLeaderboardRow',
      category: 'Domain',
      abbr: 'LR',
      description: 'Ranked row — rank chip, avatar, handle, volume, 24h change.',
      filePath: 'modules/domains/nft/creator/CreatorLeaderboardRow.tsx',
      sourceCode: `'use client';
import type { NftCreator } from '../types';

export function CreatorLeaderboardRow({ rank, creator, changePct }) {
  // rank chip + avatar + handle + volume + delta
}`,
      variants: [
        {
          title: 'Top 3 leaderboard',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-md space-y-1">
              <CreatorLeaderboardRow rank={1} creator={DEMO_CREATOR} changePct={12.4} />
              <CreatorLeaderboardRow rank={2} creator={{ ...DEMO_CREATOR, handle: 'pixelmonk', displayName: 'Pixel Monk', totalVolumeEth: 920.3 }} changePct={-3.1} />
              <CreatorLeaderboardRow rank={3} creator={{ ...DEMO_CREATOR, handle: 'okatu', displayName: 'Okatu', totalVolumeEth: 421.0 }} changePct={22.8} />
            </div>
          ),
          code: `<CreatorLeaderboardRow rank={1} creator={creator} changePct={12.4} />`,
        },
      ],
    },
    {
      id: 'nft-activity-feed-row',
      title: 'ActivityFeedRow',
      category: 'Domain',
      abbr: 'AF',
      description: 'Single activity event — kind icon, asset thumb, parties, price, chain, time.',
      filePath: 'modules/domains/nft/activity/ActivityFeedRow.tsx',
      sourceCode: `'use client';
import type { NftActivity } from '../types';

export function ActivityFeedRow({ event }) {
  // kind pill + asset image + parties + price + chain + time
}`,
      variants: [
        {
          title: 'Sale event',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-2xl rounded-xl border border-border bg-surface-base overflow-hidden">
              <ActivityFeedRow event={DEMO_ACTIVITY} />
            </div>
          ),
          code: `<ActivityFeedRow event={event} />`,
        },
        {
          title: 'Mixed feed',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-2xl rounded-xl border border-border bg-surface-base overflow-hidden divide-y divide-border">
              <ActivityFeedRow event={DEMO_ACTIVITY} />
              <ActivityFeedRow event={{ ...DEMO_ACTIVITY, eventId: 'd2', kind: 'BID',      priceEth: 4.2 }} />
              <ActivityFeedRow event={{ ...DEMO_ACTIVITY, eventId: 'd3', kind: 'MINT',     fromHandle: null, priceEth: 0.05 }} />
              <ActivityFeedRow event={{ ...DEMO_ACTIVITY, eventId: 'd4', kind: 'TRANSFER', priceEth: null }} />
            </div>
          ),
          code: `<ActivityFeedRow event={event} />`,
        },
      ],
    },
    {
      id: 'nft-auction-countdown',
      title: 'AuctionCountdown',
      category: 'Domain',
      abbr: 'AC',
      description: 'Live ticking countdown to an auction end — days, hours, minutes, seconds.',
      filePath: 'modules/domains/nft/auction/AuctionCountdown.tsx',
      sourceCode: `'use client';

export function AuctionCountdown({ endsAt, label, size = 'md' }) {
  // setInterval-driven d/h/m/s display
}`,
      variants: [
        {
          title: 'Ticking auction',
          layout: 'stack',
          preview: <AuctionCountdown endsAt={new Date(Date.now() + 26 * 3_600_000)} size="md" />,
          code: `<AuctionCountdown endsAt={auction.endsAt} size="md" />`,
        },
        {
          title: 'Ended state',
          layout: 'side',
          preview: <AuctionCountdown endsAt={new Date(Date.now() - 1000)} />,
          code: `<AuctionCountdown endsAt={pastDate} />`,
        },
      ],
    },
    {
      id: 'nft-bid-history-row',
      title: 'BidHistoryRow',
      category: 'Domain',
      abbr: 'BH',
      description: 'Bid row — bidder avatar + handle, amount, time, winning indicator.',
      filePath: 'modules/domains/nft/auction/BidHistoryRow.tsx',
      sourceCode: `'use client';
import type { NftBid } from '../types';

export function BidHistoryRow({ bid, winning }) {
  // avatar + handle + amount + tx link
}`,
      variants: [
        {
          title: 'With winning highlight',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-md rounded-xl border border-border bg-surface-base p-2 space-y-1">
              <BidHistoryRow bid={DEMO_BID_WINNING} winning />
              <BidHistoryRow bid={DEMO_BID_OUTBID} />
            </div>
          ),
          code: `<BidHistoryRow bid={bid} winning />`,
        },
      ],
    },
    {
      id: 'nft-wallet-connect-button',
      title: 'WalletConnectButton',
      category: 'Domain',
      abbr: 'WC',
      description: 'Two-state wallet connector — disconnected (provider picker) or connected (address + balance menu).',
      filePath: 'modules/domains/nft/wallet/WalletConnectButton.tsx',
      sourceCode: `'use client';
import type { ConnectedWallet, WalletProvider } from '../types';

export function WalletConnectButton({ wallet, onConnect, onDisconnect }) {
  // disconnected → provider list; connected → balance + menu
}`,
      variants: [
        {
          title: 'Disconnected',
          layout: 'side',
          preview: <WalletConnectButton wallet={null} onConnect={() => {}} />,
          code: `<WalletConnectButton wallet={null} onConnect={fn} />`,
        },
        {
          title: 'Connected',
          layout: 'side',
          preview: (
            <WalletConnectButton
              wallet={{
                provider: 'METAMASK',
                address: '0x9c2A3F0B7E5d4a1Cf6E7B2A1d3F4e5A6B7C8d9E0',
                balanceEth: 12.487,
                ensName: 'glyph.eth',
              }}
              onDisconnect={() => {}}
            />
          ),
          code: `<WalletConnectButton wallet={connectedWallet} onDisconnect={fn} />`,
        },
      ],
    },
    {
      id: 'nft-mint-progress-bar',
      title: 'MintProgressBar',
      category: 'Domain',
      abbr: 'MP',
      description: 'Mint progress strip — "X / Y minted" with percentage, mint price, and hot/sold-out state colour.',
      filePath: 'modules/domains/nft/mint/MintProgressBar.tsx',
      sourceCode: `'use client';

export function MintProgressBar({ mintedCount, totalSupply, mintPriceEth, label }) {
  // bar + count + price + state colour
}`,
      variants: [
        {
          title: 'In progress',
          layout: 'stack',
          preview: <MintProgressBar mintedCount={1_247} totalSupply={5_000} mintPriceEth={0.08} />,
          code: `<MintProgressBar mintedCount={1247} totalSupply={5000} mintPriceEth={0.08} />`,
        },
        {
          title: 'Hot (≥80%)',
          layout: 'stack',
          preview: <MintProgressBar mintedCount={4_812} totalSupply={5_000} mintPriceEth={0.08} />,
          code: `<MintProgressBar mintedCount={4812} totalSupply={5000} mintPriceEth={0.08} />`,
        },
        {
          title: 'Sold out',
          layout: 'stack',
          preview: <MintProgressBar mintedCount={5_000} totalSupply={5_000} mintPriceEth={0.08} />,
          code: `<MintProgressBar mintedCount={5000} totalSupply={5000} mintPriceEth={0.08} />`,
        },
      ],
    },
  ];
}
