# MintProgressBar

- **id:** `nft-mint-progress-bar`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/mint/MintProgressBar.tsx`
- **status:** stable
- **since:** 2026-05

Mint progress strip — "X / Y minted" with percentage, mint price, and hot/sold-out state colour.

## Variants

### In progress

```tsx
<MintProgressBar mintedCount={1247} totalSupply={5000} mintPriceEth={0.08} />
```

### Hot (≥80%)

```tsx
<MintProgressBar mintedCount={4812} totalSupply={5000} mintPriceEth={0.08} />
```

### Sold out

```tsx
<MintProgressBar mintedCount={5000} totalSupply={5000} mintPriceEth={0.08} />
```

## Full source

```tsx
'use client';

export function MintProgressBar({ mintedCount, totalSupply, mintPriceEth, label }) {
  // bar + count + price + state colour
}
```
