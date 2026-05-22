# app/theme/nft

NFT marketplace theme demo — explore, collections, assets, activity, creators, and create/mint pages. Wires `modules/domains/nft/`.

## Files

```
activity/
assets/
collections/
create/
creators/
explore/
layout.tsx
nft.data.ts
page.tsx
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `nft.data.ts` — passed in as props.
3. Dynamic asset/collection/creator routes use `generateStaticParams`.
4. Compose `@/modules/domains/nft/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
