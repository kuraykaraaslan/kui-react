# TicketSidebarBox

- **id:** `ticket-sidebar-box`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/TicketSidebarBox.tsx`
- **status:** stable
- **since:** 2025-03

Etkinlik detay sayfasının yapışkan sağ kenar çubuğu: fiyat başlığı, fiyatlandırma listesi, satın al butonu ve harita.

## Variants

### Satın alınabilir

```tsx
<TicketSidebarBox
  priceLabel="₺1.500 – ₺8.500"
  pricings={pricings}
  canBuy={true}
  isSoldOut={false}
  isCancelled={false}
  eventSlug={event.slug}
  remainingCapacity={800}
  venue={venue}
/>
```

### Satışı bitti

```tsx
<TicketSidebarBox canBuy={false} isSoldOut={true} ... />
```

## Full source

```tsx
import { TicketSidebarBox } from '@/modules/domains/event/TicketSidebarBox';
<TicketSidebarBox
  priceLabel="₺1.500 – ₺8.500"
  pricings={pricings}
  canBuy={true}
  isSoldOut={false}
  isCancelled={false}
  eventSlug="coldplay-istanbul-2026"
  remainingCapacity={3200}
  venue={{ name: 'Atatürk Olimpiyat Stadyumu', address: 'Başakşehir', city: 'İstanbul' }}
/>
```
