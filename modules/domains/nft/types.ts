import { z } from 'zod';
import { IdSchema } from '../common/types';

/* =========================================================
   ENUMS
========================================================= */

export const BlockchainEnum = z.enum([
  'ETHEREUM',
  'POLYGON',
  'SOLANA',
  'BASE',
  'ARBITRUM',
]);

export const TokenStandardEnum = z.enum(['ERC721', 'ERC1155', 'SPL']);

export const RarityTierEnum = z.enum([
  'COMMON',
  'UNCOMMON',
  'RARE',
  'EPIC',
  'LEGENDARY',
  'MYTHIC',
]);

export const ListingStatusEnum = z.enum(['LISTED', 'AUCTION', 'SOLD', 'UNLISTED']);

export const ActivityKindEnum = z.enum([
  'MINT',
  'LIST',
  'SALE',
  'BID',
  'TRANSFER',
  'OFFER',
]);

export const WalletProviderEnum = z.enum([
  'METAMASK',
  'WALLETCONNECT',
  'COINBASE',
  'PHANTOM',
  'RAINBOW',
]);

export const BidStatusEnum = z.enum(['ACTIVE', 'OUTBID', 'WON', 'EXPIRED', 'CANCELLED']);

/* =========================================================
   TRAITS
========================================================= */

export const NftTraitSchema = z.object({
  traitType: z.string(),
  value: z.string(),
  rarityPercent: z.number().min(0).max(100).optional(),
});

/* =========================================================
   ASSET (NFT item)
========================================================= */

export const NftAssetSchema = z.object({
  assetId: IdSchema,
  tokenId: z.string(),
  name: z.string(),
  image: z.string().url(),
  description: z.string().optional(),
  collectionId: IdSchema,
  creatorHandle: z.string(),
  ownerHandle: z.string(),
  blockchain: BlockchainEnum,
  tokenStandard: TokenStandardEnum,
  traits: z.array(NftTraitSchema).default([]),
  priceEth: z.number().nonnegative().nullable().optional(),
  priceUsd: z.number().nonnegative().nullable().optional(),
  lastSalePriceEth: z.number().nonnegative().nullable().optional(),
  status: ListingStatusEnum,
  rarityTier: RarityTierEnum,
  rarityScore: z.number().nonnegative().optional(),
  rarityRank: z.number().int().positive().optional(),
  likes: z.number().int().nonnegative().default(0),
  views: z.number().int().nonnegative().default(0),
  listedAt: z.coerce.date().nullable().optional(),
  mintedAt: z.coerce.date().optional(),
});

/* =========================================================
   COLLECTION
========================================================= */

export const NftCollectionSchema = z.object({
  collectionId: IdSchema,
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  banner: z.string().url(),
  avatar: z.string().url(),
  creatorHandle: z.string(),
  verified: z.boolean().default(false),
  blockchain: BlockchainEnum,
  floorPriceEth: z.number().nonnegative(),
  totalVolumeEth: z.number().nonnegative(),
  itemCount: z.number().int().nonnegative(),
  ownerCount: z.number().int().nonnegative(),
  listedCount: z.number().int().nonnegative(),
  volumeChange24hPct: z.number().optional(),
  floorChange24hPct: z.number().optional(),
  createdAt: z.coerce.date().optional(),
});

/* =========================================================
   CREATOR
========================================================= */

export const SocialLinkSchema = z.object({
  platform: z.enum(['TWITTER', 'INSTAGRAM', 'WEBSITE', 'DISCORD']),
  url: z.string().url(),
});

export const NftCreatorSchema = z.object({
  handle: z.string(),
  displayName: z.string(),
  avatar: z.string().url(),
  banner: z.string().url().optional(),
  verified: z.boolean().default(false),
  walletAddress: z.string(),
  bio: z.string().optional(),
  collectionsCount: z.number().int().nonnegative().default(0),
  itemsCreated: z.number().int().nonnegative().default(0),
  followers: z.number().int().nonnegative().default(0),
  totalVolumeEth: z.number().nonnegative().default(0),
  joinedAt: z.coerce.date().optional(),
  socials: z.array(SocialLinkSchema).default([]),
});

/* =========================================================
   BID + AUCTION
========================================================= */

export const NftBidSchema = z.object({
  bidId: IdSchema,
  assetId: IdSchema,
  bidderHandle: z.string(),
  bidderAvatar: z.string().url().optional(),
  amountEth: z.number().positive(),
  amountUsd: z.number().positive().optional(),
  placedAt: z.coerce.date(),
  expiresAt: z.coerce.date().nullable().optional(),
  status: BidStatusEnum,
});

export const NftAuctionSchema = z.object({
  auctionId: IdSchema,
  assetId: IdSchema,
  startingPriceEth: z.number().nonnegative(),
  currentBidEth: z.number().nonnegative(),
  reservePriceEth: z.number().nonnegative().optional(),
  endsAt: z.coerce.date(),
  bidCount: z.number().int().nonnegative().default(0),
});

/* =========================================================
   ACTIVITY EVENT
========================================================= */

export const NftActivitySchema = z.object({
  eventId: IdSchema,
  kind: ActivityKindEnum,
  assetId: IdSchema,
  assetName: z.string(),
  assetImage: z.string().url(),
  collectionName: z.string(),
  fromHandle: z.string().nullable().optional(),
  toHandle: z.string().nullable().optional(),
  priceEth: z.number().nonnegative().nullable().optional(),
  txHash: z.string().optional(),
  blockchain: BlockchainEnum,
  timestamp: z.coerce.date(),
});

/* =========================================================
   WALLET
========================================================= */

export const ConnectedWalletSchema = z.object({
  provider: WalletProviderEnum,
  address: z.string(),
  balanceEth: z.number().nonnegative(),
  ensName: z.string().nullable().optional(),
});

/* =========================================================
   MINT DROP
========================================================= */

export const MintDropSchema = z.object({
  dropId: IdSchema,
  collectionId: IdSchema,
  name: z.string(),
  mintPriceEth: z.number().nonnegative(),
  totalSupply: z.number().int().positive(),
  mintedCount: z.number().int().nonnegative(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().nullable().optional(),
});

/* =========================================================
   INFERRED TYPES
========================================================= */

export type Blockchain = z.infer<typeof BlockchainEnum>;
export type TokenStandard = z.infer<typeof TokenStandardEnum>;
export type RarityTier = z.infer<typeof RarityTierEnum>;
export type ListingStatus = z.infer<typeof ListingStatusEnum>;
export type ActivityKind = z.infer<typeof ActivityKindEnum>;
export type WalletProvider = z.infer<typeof WalletProviderEnum>;
export type BidStatus = z.infer<typeof BidStatusEnum>;

export type NftTrait = z.infer<typeof NftTraitSchema>;
export type NftAsset = z.infer<typeof NftAssetSchema>;
export type NftCollection = z.infer<typeof NftCollectionSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type NftCreator = z.infer<typeof NftCreatorSchema>;
export type NftBid = z.infer<typeof NftBidSchema>;
export type NftAuction = z.infer<typeof NftAuctionSchema>;
export type NftActivity = z.infer<typeof NftActivitySchema>;
export type ConnectedWallet = z.infer<typeof ConnectedWalletSchema>;
export type MintDrop = z.infer<typeof MintDropSchema>;
