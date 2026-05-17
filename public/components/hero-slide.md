# HeroSlide

- **id:** `hero-slide`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/HeroSlide.tsx`
- **status:** stable
- **since:** 2025-04

Slider içinde kullanılan tam ekran hero slayt: çift gradyan katmanı, badge'ler, fiyat, CTA butonları.

## Variants

### Tek slayt önizleme

```tsx
<HeroSlide event={event} />
```

## Full source

```tsx
import { HeroSlide } from '@/modules/domains/event/HeroSlide';
import { Slider } from '@/modules/ui/Slider';

const slides = events.map((e) => <HeroSlide key={e.eventId} event={e} />);
<Slider slides={slides} autoPlay showDots showArrows loop className="rounded-none" />
```
