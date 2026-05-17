# AuctionCountdown

- **id:** `nft-auction-countdown`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/auction/AuctionCountdown.tsx`
- **status:** stable
- **since:** 2026-05

Live ticking countdown to an auction end — days, hours, minutes, seconds.

## Variants

### Ticking auction

```tsx
<AuctionCountdown endsAt={auction.endsAt} size="md" />
```

### Ended state

```tsx
<AuctionCountdown endsAt={pastDate} />
```

## Full source

```tsx
'use client';

export function AuctionCountdown({ endsAt, label, size = 'md' }) {
  // setInterval-driven d/h/m/s display
}
```
