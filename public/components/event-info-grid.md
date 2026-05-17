# EventInfoGrid

- **id:** `event-info-grid`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/EventInfoGrid.tsx`
- **status:** stable
- **since:** 2025-03

Etkinlik detay sayfası için tarih/saat, mekan, format ve doluluk oranı bilgilerini düzenli bir kart içinde gösterir.

## Variants

### Tüm alanlar

```tsx
<EventInfoGrid event={event} venue={venue} />
```

### Online etkinlik (mekan yok)

```tsx
<EventInfoGrid event={{ ...event, format: 'ONLINE' }} venue={null} />
```

## Full source

```tsx
import { EventInfoGrid } from '@/modules/domains/event/EventInfoGrid';
<EventInfoGrid
  event={event}
  venue={{ name: 'Atatürk Olimpiyat Stadyumu', address: 'Başakşehir, İstanbul' }}
/>
```
