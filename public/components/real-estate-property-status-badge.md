# PropertyStatusBadge

- **id:** `real-estate-property-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/real-estate/property/PropertyStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays property listing status with semantic colour coding.

## Variants

### All statuses

```tsx
{(['DRAFT', 'ACTIVE', 'PUBLISHED', 'SOLD', 'RENTED', 'ARCHIVED'] as const).map((s) => (
  <PropertyStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<PropertyStatusBadge status="PUBLISHED" size="sm" />
<PropertyStatusBadge status="PUBLISHED" size="md" />
```

## Full source

```tsx
import { PropertyStatusBadge } from '@/modules/domains/real-estate/property/PropertyStatusBadge';
<PropertyStatusBadge status="PUBLISHED" />
```
