# OrganizerCard

- **id:** `organizer-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/OrganizerCard.tsx`
- **status:** stable
- **since:** 2025-03

Organizatör logo/baş harfleri, isim, doğrulanmış rozetleri ve iletişim bağlantılarını gösterir.

## Variants

### Doğrulanmış organizatör

```tsx
<OrganizerCard organizer={organizer} />
```

### Logosuz

```tsx
<OrganizerCard organizer={{ ...organizer, verified: false }} />
```

## Full source

```tsx
import { OrganizerCard } from '@/modules/domains/event/OrganizerCard';
<OrganizerCard organizer={organizer} />
```
