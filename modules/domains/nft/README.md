# modules/domains/nft

NFT marketplace domain — collections, assets, creators, auctions, minting, and on-chain activity components.

## Subdirectories

```
activity/
asset/
auction/
collection/
creator/
mint/
wallet/
index.ts
types.ts
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `'use client';` at top of every component file.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`.
6. Money/Currency types reused from `@/modules/domains/common`; on-chain identifiers defined in local `types.ts`.

See [/AGENTS.md](../../../AGENTS.md).
