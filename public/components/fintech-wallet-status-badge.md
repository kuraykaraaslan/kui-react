# WalletStatusBadge

- **id:** `fintech-wallet-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/wallet/WalletStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays wallet status with semantic colour coding: ACTIVE, FROZEN, CLOSED.

## Variants

### All statuses

```tsx
{(['ACTIVE', 'FROZEN', 'CLOSED'] as const).map((s) => (
  <WalletStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<WalletStatusBadge status="ACTIVE" size="sm" />
<WalletStatusBadge status="ACTIVE" size="md" />
```

## Full source

```tsx
import { WalletStatusBadge } from '@/modules/domains/fintech/wallet/WalletStatusBadge';
<WalletStatusBadge status="ACTIVE" />
```
