# EmptyWishlistState

- **id:** `commerce-empty-wishlist-state`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/wishlist/EmptyWishlistState.tsx`
- **status:** stable

Empty state for an empty wishlist with an optional recommendations grid.

## Variants

### With recommendations

```tsx
<EmptyWishlistState recommendations={[…]} />
```

### Minimal

```tsx
<EmptyWishlistState browseHref="/products" />
```

## Full source

```tsx
import { EmptyWishlistState } from '@/modules/domains/commerce/wishlist/EmptyWishlistState';
<EmptyWishlistState browseHref="/products" recommendations={[…]} />
```
