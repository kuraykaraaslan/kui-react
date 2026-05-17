# WalletConnectButton

- **id:** `nft-wallet-connect-button`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/wallet/WalletConnectButton.tsx`
- **status:** stable
- **since:** 2026-05

Two-state wallet connector — disconnected (provider picker) or connected (address + balance menu).

## Variants

### Disconnected

```tsx
<WalletConnectButton wallet={null} onConnect={fn} />
```

### Connected

```tsx
<WalletConnectButton wallet={connectedWallet} onDisconnect={fn} />
```

## Full source

```tsx
'use client';
import type { ConnectedWallet, WalletProvider } from '../types';

export function WalletConnectButton({ wallet, onConnect, onDisconnect }) {
  // disconnected → provider list; connected → balance + menu
}
```
