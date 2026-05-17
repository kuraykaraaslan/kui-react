# CuisineTagChip

- **id:** `food-cuisine-tag-chip`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/cuisine/CuisineTagChip.tsx`
- **status:** stable
- **since:** 2026-05

Pill button for cuisine filtering. Supports selected state and an optional result count badge.

## Variants

### Selected + neutral

```tsx
<CuisineTagChip label="Italian" selected count={12} />
```

### Without counts

```tsx
<CuisineTagChip label="Healthy" selected />
```

## Full source

```tsx
import { CuisineTagChip } from '@/modules/domains/food/cuisine/CuisineTagChip';
<CuisineTagChip label="Italian" selected count={12} />
```
