# CartItem

- **id:** `commerce-cart-item`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/cart/CartItem.tsx`
- **status:** stable
- **since:** 2026-05

Cart line item row with product image, name, quantity, unit price, and remove action.

## Variants

### Single item with remove

```tsx
<CartItem item={item} onRemove={() => removeItem(item.productId)} />
```

### Multi-quantity item

```tsx
<CartItem item={{ ...item, quantity: 2 }} />
```

## Full source

```tsx
import { CartItem } from '@/modules/domains/commerce/cart/CartItem';
<CartItem item={item} onRemove={() => removeItem(item.productId)} />
```
