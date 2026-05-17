# WishlistItemCard

- **id:** `commerce-wishlist-item-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/wishlist/WishlistItemCard.tsx`
- **status:** stable

Wishlist row card: product image, current price, sale strikethrough, price-drop badge, move-to-cart and remove actions.

## Variants

### On sale with price drop

```tsx
<WishlistItemCard item={{ …, salePrice: 279, priceWhenAdded: 349 }} onMoveToCart={…} onRemove={…} />
```

### Out of stock

```tsx
<WishlistItemCard item={{ …, stockStatus: 'OUT_OF_STOCK' }} onMoveToCart={…} onRemove={…} />
```

## Full source

```tsx
import { WishlistItemCard } from '@/modules/domains/commerce/wishlist/WishlistItemCard';
<WishlistItemCard item={item} onMoveToCart={…} onRemove={…} />
```
