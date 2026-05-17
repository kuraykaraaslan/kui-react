# MenuItemCard

- **id:** `food-menu-item-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/menu/MenuItemCard.tsx`
- **status:** stable
- **since:** 2026-05

Horizontal menu item card showing name, description, dietary badges, calories, price, and an add-to-cart button.

## Variants

### Vegetarian with add to cart

```tsx
<MenuItemCard item={item} onAddToCart={() => addToCart(item)} />
```

### Vegan item

```tsx
<MenuItemCard item={{ ...item, isVegan: true }} onAddToCart={() => addToCart(item)} />
```

### Out of stock

```tsx
<MenuItemCard item={{ ...item, status: 'OUT_OF_STOCK' }} />
```

## Full source

```tsx
import { MenuItemCard } from '@/modules/domains/food/menu/MenuItemCard';
<MenuItemCard item={item} onAddToCart={() => addToCart(item)} />
```
