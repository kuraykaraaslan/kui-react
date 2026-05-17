# TraitTag

- **id:** `nft-trait-tag`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/asset/TraitTag.tsx`
- **status:** stable
- **since:** 2026-05

Single trait chip — type, value, and rarity percentage.

## Variants

### Trait grid

```tsx
<TraitTag trait={{ traitType: 'Form', value: 'Crystalline', rarityPercent: 0.3 }} />
```

### Without rarity

```tsx
<TraitTag trait={{ traitType: 'Ring', value: 'Triple' }} />
```

## Full source

```tsx
'use client';
import type { NftTrait } from '../types';

export function TraitTag({ trait, size = 'md' }) {
  // small panel with type / value / "X% have this"
}
```
