# WalletCard

- **id:** `fintech-wallet-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/wallet/WalletCard.tsx`
- **status:** stable
- **since:** 2026-05

Wallet card displaying balance, currency, status, and account reference with a premium gradient look.

## Variants

### Active primary (TRY)

```tsx
<WalletCard wallet={wallet} />
```

### Frozen wallet (EUR)

```tsx
<WalletCard wallet={{ ...wallet, status: 'FROZEN' }} />
```

### USD wallet

```tsx
<WalletCard wallet={usdWallet} />
```

## Full source

```tsx
import { WalletCard } from '@/modules/domains/fintech/wallet/WalletCard';
<WalletCard wallet={wallet} />
```
