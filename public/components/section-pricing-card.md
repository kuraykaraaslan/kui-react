# SectionPricingCard

- **id:** `section-pricing-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/SectionPricingCard.tsx`
- **status:** stable
- **since:** 2025-03

Bilet kategorisi seçim kartı; −/+ adet kontrolü, kapasite uyarısı ve seçili durumu içerir.

## Variants

### Seçili

```tsx
<SectionPricingCard pricing={pricing} quantity={2} onQuantityChange={setQty} selected />
```

### Son koltuk uyarısı

```tsx
// soldCount yakın olduğunda "Son X koltuk" uyarısı gösterilir
<SectionPricingCard pricing={pricing} quantity={0} onQuantityChange={setQty} />
```

## Full source

```tsx
import { SectionPricingCard } from '@/modules/domains/event/SectionPricingCard';
<SectionPricingCard
  pricing={pricing}
  quantity={2}
  onQuantityChange={(qty) => setQty(qty)}
  selected
/>
```
