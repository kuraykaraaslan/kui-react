# EventCategoryBadge

- **id:** `event-category-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/EventCategoryBadge.tsx`
- **status:** stable
- **since:** 2025-03

Etkinlik kategorisini chip olarak gösterir; href verilirse tıklanabilir bağlantıya dönüşür.

## Variants

### Badge ve link

```tsx
<EventCategoryBadge category={category} />
<EventCategoryBadge category={category} href="/events?category=muzik" />
```

## Full source

```tsx
import { EventCategoryBadge } from '@/modules/domains/event/EventCategoryBadge';
<EventCategoryBadge category={category} />
<EventCategoryBadge category={category} href="/events?category=muzik" />
```
