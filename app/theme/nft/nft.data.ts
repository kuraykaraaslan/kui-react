import type {
  NftAsset,
  NftCollection,
  NftCreator,
  NftActivity,
  NftBid,
  NftAuction,
  MintDrop,
  ConnectedWallet,
} from '@/modules/domains/nft/types';
import type { FloorPricePoint } from '@/modules/domains/nft/collection/FloorPriceChart';

/* ─── Connected wallet (demo) ─── */

export const DEMO_WALLET: ConnectedWallet = {
  provider: 'METAMASK',
  address: '0x9c2A3F0B7E5d4a1Cf6E7B2A1d3F4e5A6B7C8d9E0',
  balanceEth: 12.487,
  ensName: 'glyph.eth',
};

/* ─── Creators ─── */

export const CREATORS: NftCreator[] = [
  {
    handle: 'novabyte',
    displayName: 'Nova Byte',
    avatar: 'https://i.pravatar.cc/200?img=12',
    banner: 'https://picsum.photos/seed/nft-banner-nova/1200/300',
    verified: true,
    walletAddress: '0xA1b2C3d4E5f6789012345678901234567890aBcD',
    bio: 'Generative artist working at the intersection of code and chaos. Solo drops monthly.',
    collectionsCount: 4,
    itemsCreated: 312,
    followers: 24_530,
    totalVolumeEth: 1842.5,
    joinedAt: new Date('2022-04-12'),
    socials: [
      { platform: 'TWITTER',   url: 'https://twitter.com/novabyte' },
      { platform: 'INSTAGRAM', url: 'https://instagram.com/novabyte' },
      { platform: 'WEBSITE',   url: 'https://novabyte.art' },
    ],
  },
  {
    handle: 'pixelmonk',
    displayName: 'Pixel Monk',
    avatar: 'https://i.pravatar.cc/200?img=33',
    banner: 'https://picsum.photos/seed/nft-banner-monk/1200/300',
    verified: true,
    walletAddress: '0xB2c3D4e5F6789012345678901234567890ABcDeF',
    bio: 'Pixel-perfect characters for the on-chain era.',
    collectionsCount: 2,
    itemsCreated: 8_888,
    followers: 91_200,
    totalVolumeEth: 9230.18,
    joinedAt: new Date('2021-08-21'),
    socials: [
      { platform: 'TWITTER', url: 'https://twitter.com/pixelmonk' },
      { platform: 'DISCORD', url: 'https://discord.gg/pixelmonk' },
    ],
  },
  {
    handle: 'studio-aether',
    displayName: 'Studio Aether',
    avatar: 'https://i.pravatar.cc/200?img=47',
    banner: 'https://picsum.photos/seed/nft-banner-aether/1200/300',
    verified: true,
    walletAddress: '0xC3d4E5f6789012345678901234567890aBcDeF12',
    bio: 'A collective of three artists exploring 3D form and motion in collectible objects.',
    collectionsCount: 3,
    itemsCreated: 540,
    followers: 14_780,
    totalVolumeEth: 612.4,
    joinedAt: new Date('2023-02-09'),
    socials: [
      { platform: 'TWITTER', url: 'https://twitter.com/aetherstudio' },
      { platform: 'WEBSITE', url: 'https://aether.studio' },
    ],
  },
  {
    handle: 'lumen',
    displayName: 'Lumen',
    avatar: 'https://i.pravatar.cc/200?img=24',
    verified: false,
    walletAddress: '0xD4e5F6789012345678901234567890ABcDeF1234',
    bio: 'Light, gradient, and silence.',
    collectionsCount: 1,
    itemsCreated: 64,
    followers: 3_120,
    totalVolumeEth: 88.7,
    joinedAt: new Date('2024-09-04'),
    socials: [
      { platform: 'INSTAGRAM', url: 'https://instagram.com/lumen' },
    ],
  },
  {
    handle: 'okatu',
    displayName: 'Okatu',
    avatar: 'https://i.pravatar.cc/200?img=54',
    verified: true,
    walletAddress: '0xE5f6789012345678901234567890aBcDeF123456',
    bio: 'Anime-coded characters, hand-drawn 1/1s.',
    collectionsCount: 2,
    itemsCreated: 144,
    followers: 18_200,
    totalVolumeEth: 421.0,
    joinedAt: new Date('2023-06-15'),
    socials: [
      { platform: 'TWITTER', url: 'https://twitter.com/okatu' },
    ],
  },
  {
    handle: 'soundwave',
    displayName: 'Soundwave',
    avatar: 'https://i.pravatar.cc/200?img=68',
    verified: false,
    walletAddress: '0xF6789012345678901234567890ABcDeF12345678',
    bio: 'Audio-reactive NFTs. Sound is the artifact.',
    collectionsCount: 1,
    itemsCreated: 24,
    followers: 1_640,
    totalVolumeEth: 17.6,
    joinedAt: new Date('2025-03-20'),
    socials: [
      { platform: 'TWITTER', url: 'https://twitter.com/soundwave' },
      { platform: 'WEBSITE', url: 'https://soundwave.audio' },
    ],
  },
];

/* ─── Collections ─── */

export const COLLECTIONS: NftCollection[] = [
  {
    collectionId: 'col-001',
    slug: 'glyph-genesis',
    name: 'Glyph Genesis',
    description: 'The founding 1024-piece collection. Each piece is a generative sigil composed from on-chain entropy.',
    banner: 'https://picsum.photos/seed/nft-col-genesis-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-genesis-avatar/200/200',
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
    createdAt: new Date('2024-01-12'),
  },
  {
    collectionId: 'col-002',
    slug: 'voidpunks',
    name: 'Voidpunks',
    description: '8,888 pixel-art punks lost in the void. Each carries a unique trait set.',
    banner: 'https://picsum.photos/seed/nft-col-voidpunks-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-voidpunks-avatar/200/200',
    creatorHandle: 'pixelmonk',
    verified: true,
    blockchain: 'ETHEREUM',
    floorPriceEth: 1.85,
    totalVolumeEth: 9230.18,
    itemCount: 8888,
    ownerCount: 4_120,
    listedCount: 412,
    volumeChange24hPct: -4.2,
    floorChange24hPct: -1.8,
    createdAt: new Date('2022-09-01'),
  },
  {
    collectionId: 'col-003',
    slug: 'solar-nomads',
    name: 'Solar Nomads',
    description: 'A 3D pilgrimage across procedural deserts. 540 nomads, each rendered with a unique caravan.',
    banner: 'https://picsum.photos/seed/nft-col-nomads-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-nomads-avatar/200/200',
    creatorHandle: 'studio-aether',
    verified: true,
    blockchain: 'POLYGON',
    floorPriceEth: 0.18,
    totalVolumeEth: 612.4,
    itemCount: 540,
    ownerCount: 287,
    listedCount: 31,
    volumeChange24hPct: 22.8,
    floorChange24hPct: 5.4,
    createdAt: new Date('2024-08-30'),
  },
  {
    collectionId: 'col-004',
    slug: 'aurora-fields',
    name: 'Aurora Fields',
    description: 'Quiet light studies. 64 hand-composed 1/1 pieces.',
    banner: 'https://picsum.photos/seed/nft-col-aurora-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-aurora-avatar/200/200',
    creatorHandle: 'lumen',
    verified: false,
    blockchain: 'BASE',
    floorPriceEth: 0.08,
    totalVolumeEth: 88.7,
    itemCount: 64,
    ownerCount: 41,
    listedCount: 12,
    volumeChange24hPct: 8.2,
    floorChange24hPct: 0.4,
    createdAt: new Date('2024-11-04'),
  },
  {
    collectionId: 'col-005',
    slug: 'okatu-spirits',
    name: 'Okatu Spirits',
    description: 'A 144-piece collection of hand-drawn anime spirits. 1/1 originals.',
    banner: 'https://picsum.photos/seed/nft-col-okatu-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-okatu-avatar/200/200',
    creatorHandle: 'okatu',
    verified: true,
    blockchain: 'ETHEREUM',
    floorPriceEth: 0.95,
    totalVolumeEth: 421.0,
    itemCount: 144,
    ownerCount: 98,
    listedCount: 17,
    volumeChange24hPct: -1.4,
    floorChange24hPct: 2.6,
    createdAt: new Date('2024-04-19'),
  },
  {
    collectionId: 'col-006',
    slug: 'soundforms',
    name: 'Soundforms',
    description: '24 audio-reactive shapes. Each NFT plays its own composition.',
    banner: 'https://picsum.photos/seed/nft-col-soundforms-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-soundforms-avatar/200/200',
    creatorHandle: 'soundwave',
    verified: false,
    blockchain: 'SOLANA',
    floorPriceEth: 0.34,
    totalVolumeEth: 17.6,
    itemCount: 24,
    ownerCount: 21,
    listedCount: 4,
    volumeChange24hPct: 41.6,
    floorChange24hPct: 12.0,
    createdAt: new Date('2025-04-02'),
  },
  {
    collectionId: 'col-007',
    slug: 'monk-relics',
    name: 'Monk Relics',
    description: 'A second drop from Pixel Monk — relic-themed pixel art.',
    banner: 'https://picsum.photos/seed/nft-col-relics-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-relics-avatar/200/200',
    creatorHandle: 'pixelmonk',
    verified: true,
    blockchain: 'ARBITRUM',
    floorPriceEth: 0.27,
    totalVolumeEth: 184.2,
    itemCount: 2_000,
    ownerCount: 740,
    listedCount: 102,
    volumeChange24hPct: 6.8,
    floorChange24hPct: 1.1,
    createdAt: new Date('2025-01-18'),
  },
  {
    collectionId: 'col-008',
    slug: 'aether-vessels',
    name: 'Aether Vessels',
    description: 'A second Studio Aether collection — sculptural vessel forms.',
    banner: 'https://picsum.photos/seed/nft-col-vessels-banner/1200/400',
    avatar: 'https://picsum.photos/seed/nft-col-vessels-avatar/200/200',
    creatorHandle: 'studio-aether',
    verified: true,
    blockchain: 'ETHEREUM',
    floorPriceEth: 0.61,
    totalVolumeEth: 240.5,
    itemCount: 180,
    ownerCount: 122,
    listedCount: 19,
    volumeChange24hPct: 3.4,
    floorChange24hPct: -0.6,
    createdAt: new Date('2024-12-08'),
  },
];

/* ─── Assets ─── */

function asset(
  i: number,
  overrides: Partial<NftAsset> & Pick<NftAsset, 'collectionId' | 'creatorHandle'>,
): NftAsset {
  const base: NftAsset = {
    assetId: `nft-${String(i).padStart(3, '0')}`,
    tokenId: String(i),
    name: `Untitled #${i}`,
    image: `https://picsum.photos/seed/nft-asset-${i}/600/600`,
    description: 'Part of the curated Glyph marketplace catalog.',
    collectionId: 'col-001',
    creatorHandle: 'novabyte',
    ownerHandle: 'glyph-collector',
    blockchain: 'ETHEREUM',
    tokenStandard: 'ERC721',
    traits: [],
    priceEth: 0.5,
    priceUsd: 1_550,
    lastSalePriceEth: 0.4,
    status: 'LISTED',
    rarityTier: 'COMMON',
    rarityScore: 50,
    rarityRank: i,
    likes: 42,
    views: 1_234,
    listedAt: new Date(Date.now() - i * 3_600_000),
    mintedAt: new Date('2024-01-12'),
  };
  return { ...base, ...overrides };
}

export const ASSETS: NftAsset[] = [
  // Glyph Genesis
  asset(1, {
    collectionId: 'col-001', creatorHandle: 'novabyte', name: 'Genesis Sigil 001',
    rarityTier: 'MYTHIC', rarityRank: 1, priceEth: 4.2, priceUsd: 13_020, lastSalePriceEth: 3.4,
    status: 'AUCTION', likes: 312, views: 12_488,
    traits: [
      { traitType: 'Form',     value: 'Crystalline',  rarityPercent: 0.3 },
      { traitType: 'Palette',  value: 'Aurora',       rarityPercent: 1.2 },
      { traitType: 'Entropy',  value: 'Maximal',      rarityPercent: 0.5 },
      { traitType: 'Ring',     value: 'Triple',       rarityPercent: 2.1 },
    ],
  }),
  asset(2, {
    collectionId: 'col-001', creatorHandle: 'novabyte', name: 'Genesis Sigil 002',
    rarityTier: 'LEGENDARY', rarityRank: 12, priceEth: 1.8, priceUsd: 5_580, lastSalePriceEth: 1.5,
    likes: 184, views: 5_212,
    traits: [
      { traitType: 'Form',    value: 'Spiral',   rarityPercent: 3.4 },
      { traitType: 'Palette', value: 'Solar',    rarityPercent: 5.1 },
      { traitType: 'Entropy', value: 'Medium',   rarityPercent: 24.0 },
    ],
  }),
  asset(3, {
    collectionId: 'col-001', creatorHandle: 'novabyte', name: 'Genesis Sigil 003',
    rarityTier: 'EPIC', rarityRank: 48, priceEth: 0.82, priceUsd: 2_542, lastSalePriceEth: 0.9,
    likes: 96, views: 2_104,
    traits: [
      { traitType: 'Form',    value: 'Linear',  rarityPercent: 12.0 },
      { traitType: 'Palette', value: 'Mono',    rarityPercent: 18.5 },
    ],
  }),
  asset(4, {
    collectionId: 'col-001', creatorHandle: 'novabyte', name: 'Genesis Sigil 004',
    rarityTier: 'RARE', rarityRank: 204, priceEth: 0.45, priceUsd: 1_395, lastSalePriceEth: 0.42,
    likes: 48, views: 1_120,
  }),
  asset(5, {
    collectionId: 'col-001', creatorHandle: 'novabyte', name: 'Genesis Sigil 005',
    rarityTier: 'UNCOMMON', rarityRank: 612, priceEth: 0.41,
  }),

  // Voidpunks
  asset(101, {
    collectionId: 'col-002', creatorHandle: 'pixelmonk', name: 'Voidpunk #1001',
    blockchain: 'ETHEREUM', rarityTier: 'LEGENDARY', rarityRank: 7, priceEth: 12.5, priceUsd: 38_750, lastSalePriceEth: 9.8,
    status: 'AUCTION', likes: 1_204, views: 28_400,
    traits: [
      { traitType: 'Skin',       value: 'Void',     rarityPercent: 0.8 },
      { traitType: 'Hat',        value: 'Crown',    rarityPercent: 1.4 },
      { traitType: 'Accessory',  value: 'Cigarette',rarityPercent: 6.2 },
      { traitType: 'Background', value: 'Nebula',   rarityPercent: 2.1 },
    ],
  }),
  asset(102, {
    collectionId: 'col-002', creatorHandle: 'pixelmonk', name: 'Voidpunk #2412',
    rarityTier: 'EPIC', rarityRank: 412, priceEth: 4.1, priceUsd: 12_710, lastSalePriceEth: 4.5,
    likes: 318, views: 8_120,
  }),
  asset(103, {
    collectionId: 'col-002', creatorHandle: 'pixelmonk', name: 'Voidpunk #4500',
    rarityTier: 'RARE', rarityRank: 1_240, priceEth: 2.1, priceUsd: 6_510, lastSalePriceEth: 1.8,
    likes: 142, views: 3_240,
  }),
  asset(104, {
    collectionId: 'col-002', creatorHandle: 'pixelmonk', name: 'Voidpunk #6021',
    rarityTier: 'COMMON', rarityRank: 5_204, priceEth: 1.85, priceUsd: 5_735,
  }),

  // Solar Nomads
  asset(201, {
    collectionId: 'col-003', creatorHandle: 'studio-aether', name: 'Caravan of Three',
    blockchain: 'POLYGON', rarityTier: 'EPIC', rarityRank: 21, priceEth: 1.4, priceUsd: 4_340, lastSalePriceEth: 1.1,
    likes: 88, views: 2_410,
    traits: [
      { traitType: 'Caravan', value: '3 camels',  rarityPercent: 4.1 },
      { traitType: 'Sky',     value: 'Eclipse',   rarityPercent: 2.0 },
      { traitType: 'Robe',    value: 'Sand-dyed', rarityPercent: 18.2 },
    ],
  }),
  asset(202, {
    collectionId: 'col-003', creatorHandle: 'studio-aether', name: 'Nomad 042',
    blockchain: 'POLYGON', rarityTier: 'RARE', rarityRank: 130, priceEth: 0.42, priceUsd: 1_302,
  }),
  asset(203, {
    collectionId: 'col-003', creatorHandle: 'studio-aether', name: 'Lone Wanderer',
    blockchain: 'POLYGON', rarityTier: 'UNCOMMON', rarityRank: 312, priceEth: 0.19,
  }),

  // Aurora Fields
  asset(301, {
    collectionId: 'col-004', creatorHandle: 'lumen', name: 'Aurora 12 — Stillness',
    blockchain: 'BASE', rarityTier: 'LEGENDARY', rarityRank: 2, priceEth: 0.9, priceUsd: 2_790, lastSalePriceEth: 0.6,
    likes: 41, views: 612,
    traits: [
      { traitType: 'Hue',    value: 'Magenta',  rarityPercent: 6.2 },
      { traitType: 'Tempo',  value: 'Slow',     rarityPercent: 18.0 },
    ],
  }),
  asset(302, {
    collectionId: 'col-004', creatorHandle: 'lumen', name: 'Aurora 04 — Drift',
    blockchain: 'BASE', rarityTier: 'RARE', rarityRank: 14, priceEth: 0.12, priceUsd: 372,
  }),

  // Okatu Spirits
  asset(401, {
    collectionId: 'col-005', creatorHandle: 'okatu', name: 'Spirit of the East Wind',
    rarityTier: 'MYTHIC', rarityRank: 3, priceEth: 5.2, priceUsd: 16_120, lastSalePriceEth: 4.4,
    status: 'AUCTION', likes: 412, views: 8_440,
    traits: [
      { traitType: 'Element',   value: 'Wind',       rarityPercent: 2.8 },
      { traitType: 'Mask',      value: 'Half',       rarityPercent: 4.1 },
      { traitType: 'Companion', value: 'Crane',      rarityPercent: 1.4 },
    ],
  }),
  asset(402, {
    collectionId: 'col-005', creatorHandle: 'okatu', name: 'Spirit 072',
    rarityTier: 'EPIC', rarityRank: 18, priceEth: 1.4, priceUsd: 4_340,
  }),
  asset(403, {
    collectionId: 'col-005', creatorHandle: 'okatu', name: 'Spirit 118',
    rarityTier: 'RARE', rarityRank: 62, priceEth: 0.95, priceUsd: 2_945,
  }),

  // Soundforms
  asset(501, {
    collectionId: 'col-006', creatorHandle: 'soundwave', name: 'Soundform 01',
    blockchain: 'SOLANA', tokenStandard: 'SPL', rarityTier: 'LEGENDARY', rarityRank: 1, priceEth: 1.2, priceUsd: 3_720,
    status: 'AUCTION', likes: 64, views: 1_840,
    traits: [
      { traitType: 'Wave',    value: 'Sine',   rarityPercent: 12.5 },
      { traitType: 'BPM',     value: '120',    rarityPercent: 4.2 },
    ],
  }),
  asset(502, {
    collectionId: 'col-006', creatorHandle: 'soundwave', name: 'Soundform 14',
    blockchain: 'SOLANA', tokenStandard: 'SPL', rarityTier: 'EPIC', rarityRank: 8, priceEth: 0.34,
  }),

  // Monk Relics
  asset(601, {
    collectionId: 'col-007', creatorHandle: 'pixelmonk', name: 'Relic of the Forge',
    blockchain: 'ARBITRUM', rarityTier: 'LEGENDARY', rarityRank: 4, priceEth: 0.84, priceUsd: 2_604,
  }),
  asset(602, {
    collectionId: 'col-007', creatorHandle: 'pixelmonk', name: 'Relic of the Mountain',
    blockchain: 'ARBITRUM', rarityTier: 'RARE', rarityRank: 102, priceEth: 0.32,
  }),

  // Aether Vessels
  asset(701, {
    collectionId: 'col-008', creatorHandle: 'studio-aether', name: 'Vessel No. 1',
    rarityTier: 'LEGENDARY', rarityRank: 1, priceEth: 2.1, priceUsd: 6_510,
    traits: [
      { traitType: 'Form',     value: 'Amphora',     rarityPercent: 8.0 },
      { traitType: 'Material', value: 'Bronze',      rarityPercent: 4.4 },
    ],
  }),
  asset(702, {
    collectionId: 'col-008', creatorHandle: 'studio-aether', name: 'Vessel No. 18',
    rarityTier: 'EPIC', rarityRank: 14, priceEth: 0.78, priceUsd: 2_418,
  }),
];

/* ─── Activity Feed ─── */

export const ACTIVITY: NftActivity[] = [
  {
    eventId: 'evt-001', kind: 'SALE', assetId: 'nft-101', assetName: 'Voidpunk #1001',
    assetImage: 'https://picsum.photos/seed/nft-asset-101/100/100',
    collectionName: 'Voidpunks', fromHandle: 'pixelmonk', toHandle: 'glyph-collector',
    priceEth: 9.8, txHash: '0xab12cd34', blockchain: 'ETHEREUM',
    timestamp: new Date(Date.now() - 2 * 60_000),
  },
  {
    eventId: 'evt-002', kind: 'BID', assetId: 'nft-001', assetName: 'Genesis Sigil 001',
    assetImage: 'https://picsum.photos/seed/nft-asset-1/100/100',
    collectionName: 'Glyph Genesis', fromHandle: '0xWhale', toHandle: null,
    priceEth: 4.2, txHash: '0xcd34ef56', blockchain: 'ETHEREUM',
    timestamp: new Date(Date.now() - 7 * 60_000),
  },
  {
    eventId: 'evt-003', kind: 'LIST', assetId: 'nft-301', assetName: 'Aurora 12 — Stillness',
    assetImage: 'https://picsum.photos/seed/nft-asset-301/100/100',
    collectionName: 'Aurora Fields', fromHandle: 'lumen', toHandle: null,
    priceEth: 0.9, blockchain: 'BASE',
    timestamp: new Date(Date.now() - 12 * 60_000),
  },
  {
    eventId: 'evt-004', kind: 'MINT', assetId: 'nft-501', assetName: 'Soundform 01',
    assetImage: 'https://picsum.photos/seed/nft-asset-501/100/100',
    collectionName: 'Soundforms', fromHandle: null, toHandle: 'soundwave',
    priceEth: 0.05, txHash: '0xef56ab78', blockchain: 'SOLANA',
    timestamp: new Date(Date.now() - 22 * 60_000),
  },
  {
    eventId: 'evt-005', kind: 'TRANSFER', assetId: 'nft-401', assetName: 'Spirit of the East Wind',
    assetImage: 'https://picsum.photos/seed/nft-asset-401/100/100',
    collectionName: 'Okatu Spirits', fromHandle: 'okatu', toHandle: 'spirit-keeper',
    priceEth: null, txHash: '0x1234aabb', blockchain: 'ETHEREUM',
    timestamp: new Date(Date.now() - 38 * 60_000),
  },
  {
    eventId: 'evt-006', kind: 'OFFER', assetId: 'nft-201', assetName: 'Caravan of Three',
    assetImage: 'https://picsum.photos/seed/nft-asset-201/100/100',
    collectionName: 'Solar Nomads', fromHandle: 'sand-bidder', toHandle: null,
    priceEth: 1.2, blockchain: 'POLYGON',
    timestamp: new Date(Date.now() - 51 * 60_000),
  },
  {
    eventId: 'evt-007', kind: 'SALE', assetId: 'nft-103', assetName: 'Voidpunk #4500',
    assetImage: 'https://picsum.photos/seed/nft-asset-103/100/100',
    collectionName: 'Voidpunks', fromHandle: 'punk-trader', toHandle: 'pix3l',
    priceEth: 1.95, txHash: '0xcafebabe', blockchain: 'ETHEREUM',
    timestamp: new Date(Date.now() - 64 * 60_000),
  },
  {
    eventId: 'evt-008', kind: 'BID', assetId: 'nft-501', assetName: 'Soundform 01',
    assetImage: 'https://picsum.photos/seed/nft-asset-501/100/100',
    collectionName: 'Soundforms', fromHandle: 'audio-collector', toHandle: null,
    priceEth: 1.2, blockchain: 'SOLANA',
    timestamp: new Date(Date.now() - 80 * 60_000),
  },
  {
    eventId: 'evt-009', kind: 'LIST', assetId: 'nft-701', assetName: 'Vessel No. 1',
    assetImage: 'https://picsum.photos/seed/nft-asset-701/100/100',
    collectionName: 'Aether Vessels', fromHandle: 'studio-aether', toHandle: null,
    priceEth: 2.1, blockchain: 'ETHEREUM',
    timestamp: new Date(Date.now() - 2 * 3_600_000),
  },
  {
    eventId: 'evt-010', kind: 'SALE', assetId: 'nft-302', assetName: 'Aurora 04 — Drift',
    assetImage: 'https://picsum.photos/seed/nft-asset-302/100/100',
    collectionName: 'Aurora Fields', fromHandle: 'lumen', toHandle: 'light-collector',
    priceEth: 0.12, txHash: '0xdeadbeef', blockchain: 'BASE',
    timestamp: new Date(Date.now() - 3 * 3_600_000),
  },
  {
    eventId: 'evt-011', kind: 'TRANSFER', assetId: 'nft-602', assetName: 'Relic of the Mountain',
    assetImage: 'https://picsum.photos/seed/nft-asset-602/100/100',
    collectionName: 'Monk Relics', fromHandle: 'pixelmonk', toHandle: 'relic-vault',
    priceEth: null, blockchain: 'ARBITRUM',
    timestamp: new Date(Date.now() - 5 * 3_600_000),
  },
  {
    eventId: 'evt-012', kind: 'OFFER', assetId: 'nft-002', assetName: 'Genesis Sigil 002',
    assetImage: 'https://picsum.photos/seed/nft-asset-2/100/100',
    collectionName: 'Glyph Genesis', fromHandle: 'collector-12', toHandle: null,
    priceEth: 1.6, blockchain: 'ETHEREUM',
    timestamp: new Date(Date.now() - 6 * 3_600_000),
  },
];

/* ─── Bids (keyed by asset id) ─── */

export const BIDS: Record<string, NftBid[]> = {
  'nft-001': [
    {
      bidId: 'bid-001', assetId: 'nft-001', bidderHandle: '0xWhale',
      bidderAvatar: 'https://i.pravatar.cc/100?img=15',
      amountEth: 4.2, amountUsd: 13_020,
      placedAt: new Date(Date.now() - 7 * 60_000),
      expiresAt: new Date(Date.now() + 18 * 3_600_000),
      status: 'ACTIVE',
    },
    {
      bidId: 'bid-002', assetId: 'nft-001', bidderHandle: 'glyph-collector',
      bidderAvatar: 'https://i.pravatar.cc/100?img=22',
      amountEth: 3.85, amountUsd: 11_935,
      placedAt: new Date(Date.now() - 28 * 60_000),
      expiresAt: null,
      status: 'OUTBID',
    },
    {
      bidId: 'bid-003', assetId: 'nft-001', bidderHandle: 'sigil-hunter',
      bidderAvatar: 'https://i.pravatar.cc/100?img=8',
      amountEth: 3.4, amountUsd: 10_540,
      placedAt: new Date(Date.now() - 2 * 3_600_000),
      expiresAt: null,
      status: 'OUTBID',
    },
  ],
  'nft-101': [
    {
      bidId: 'bid-101', assetId: 'nft-101', bidderHandle: 'punk-baron',
      bidderAvatar: 'https://i.pravatar.cc/100?img=44',
      amountEth: 12.5, amountUsd: 38_750,
      placedAt: new Date(Date.now() - 14 * 60_000),
      expiresAt: new Date(Date.now() + 6 * 3_600_000),
      status: 'ACTIVE',
    },
    {
      bidId: 'bid-102', assetId: 'nft-101', bidderHandle: 'pix3l',
      bidderAvatar: 'https://i.pravatar.cc/100?img=51',
      amountEth: 11.8, amountUsd: 36_580,
      placedAt: new Date(Date.now() - 90 * 60_000),
      expiresAt: null,
      status: 'OUTBID',
    },
  ],
  'nft-401': [
    {
      bidId: 'bid-401', assetId: 'nft-401', bidderHandle: 'spirit-keeper',
      bidderAvatar: 'https://i.pravatar.cc/100?img=27',
      amountEth: 5.2, amountUsd: 16_120,
      placedAt: new Date(Date.now() - 3 * 60_000),
      expiresAt: new Date(Date.now() + 11 * 3_600_000),
      status: 'ACTIVE',
    },
    {
      bidId: 'bid-402', assetId: 'nft-401', bidderHandle: 'anime-lord',
      bidderAvatar: 'https://i.pravatar.cc/100?img=36',
      amountEth: 4.8, amountUsd: 14_880,
      placedAt: new Date(Date.now() - 4 * 3_600_000),
      expiresAt: null,
      status: 'OUTBID',
    },
  ],
  'nft-501': [
    {
      bidId: 'bid-501', assetId: 'nft-501', bidderHandle: 'audio-collector',
      bidderAvatar: 'https://i.pravatar.cc/100?img=18',
      amountEth: 1.2, amountUsd: 3_720,
      placedAt: new Date(Date.now() - 80 * 60_000),
      expiresAt: new Date(Date.now() + 20 * 3_600_000),
      status: 'ACTIVE',
    },
  ],
};

/* ─── Live Auctions ─── */

export const AUCTIONS: NftAuction[] = [
  {
    auctionId: 'auc-001', assetId: 'nft-001',
    startingPriceEth: 2.0, currentBidEth: 4.2, reservePriceEth: 3.0,
    endsAt: new Date(Date.now() + 18 * 3_600_000), bidCount: 14,
  },
  {
    auctionId: 'auc-002', assetId: 'nft-101',
    startingPriceEth: 5.0, currentBidEth: 12.5, reservePriceEth: 8.0,
    endsAt: new Date(Date.now() + 6 * 3_600_000), bidCount: 22,
  },
  {
    auctionId: 'auc-003', assetId: 'nft-401',
    startingPriceEth: 2.0, currentBidEth: 5.2, reservePriceEth: 4.0,
    endsAt: new Date(Date.now() + 11 * 3_600_000), bidCount: 9,
  },
  {
    auctionId: 'auc-004', assetId: 'nft-501',
    startingPriceEth: 0.5, currentBidEth: 1.2,
    endsAt: new Date(Date.now() + 20 * 3_600_000), bidCount: 4,
  },
];

/* ─── Mint Drops ─── */

export const DROPS: MintDrop[] = [
  {
    dropId: 'drop-001', collectionId: 'col-007', name: 'Monk Relics — Wave 2',
    mintPriceEth: 0.08, totalSupply: 2_000, mintedCount: 1_412,
    startsAt: new Date(Date.now() - 24 * 3_600_000),
    endsAt: new Date(Date.now() + 12 * 3_600_000),
  },
  {
    dropId: 'drop-002', collectionId: 'col-006', name: 'Soundforms Genesis',
    mintPriceEth: 0.05, totalSupply: 24, mintedCount: 21,
    startsAt: new Date(Date.now() - 4 * 3_600_000),
    endsAt: new Date(Date.now() + 48 * 3_600_000),
  },
];

/* ─── Floor price history (keyed by collection slug) ─── */

function buildFloorHistory(base: number, jitter: number, days = 30): FloorPricePoint[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    const wobble = Math.sin(i / 3) * jitter + (Math.random() - 0.5) * jitter * 0.5;
    return {
      date: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
      floorEth: Math.max(0.001, +(base + wobble).toFixed(3)),
    };
  });
}

export const FLOOR_PRICE_HISTORY: Record<string, FloorPricePoint[]> = {
  'glyph-genesis':   buildFloorHistory(0.42, 0.08),
  'voidpunks':       buildFloorHistory(1.85, 0.30),
  'solar-nomads':    buildFloorHistory(0.18, 0.04),
  'aurora-fields':   buildFloorHistory(0.08, 0.02),
  'okatu-spirits':   buildFloorHistory(0.95, 0.18),
  'soundforms':      buildFloorHistory(0.34, 0.10),
  'monk-relics':     buildFloorHistory(0.27, 0.05),
  'aether-vessels':  buildFloorHistory(0.61, 0.12),
};
