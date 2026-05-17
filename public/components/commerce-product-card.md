# ProductCard

- **id:** `commerce-product-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/product/ProductCard.tsx`
- **status:** stable
- **since:** 2026-05

Product card with image, price, type and stock badges, and tags.

## Variants

### Physical product with link

```tsx
<ProductCard product={product} href="/products/slug" />
```

### Digital product with sale price

```tsx
<ProductCard product={{ ...product, salePrice: 199 }} href="/products/slug" />
```

## Full source

```tsx
import { ProductCard } from '@/modules/domains/commerce/product/ProductCard';
<ProductCard product={product} href="/products/slug" />
```
