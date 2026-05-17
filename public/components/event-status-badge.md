# EventStatusBadge

- **id:** `event-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/EventStatusBadge.tsx`
- **status:** stable
- **since:** 2025-03

Etkinlik durumunu (PUBLISHED, SOLD_OUT, CANCELLED…) renkli badge ile gösterir.

## Variants

### Tüm durumlar

```tsx
<EventStatusBadge status="DRAFT" />
<EventStatusBadge status="PUBLISHED" />
<EventStatusBadge status="SOLD_OUT" />
```

### Boyutlar

```tsx
<EventStatusBadge status="CANCELLED" size="sm" />
<EventStatusBadge status="CANCELLED" size="md" />
<EventStatusBadge status="CANCELLED" size="lg" />
```

## Full source

```tsx
import { EventStatusBadge } from '@/modules/domains/event/EventStatusBadge';
// DRAFT | PUBLISHED | SCHEDULED | CANCELLED | POSTPONED | SOLD_OUT | ARCHIVED
<EventStatusBadge status="PUBLISHED" />
```
