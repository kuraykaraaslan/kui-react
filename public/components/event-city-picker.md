# CityPicker

- **id:** `event-city-picker`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/CityPicker.tsx`
- **status:** stable
- **since:** 2026-05

Event nav barı için şehir seçici dropdown; varsayılan Türkiye şehirleri, props ile özelleştirilebilir.

## Variants

### Varsayılan

```tsx
<CityPicker />
```

### Özel şehir listesi

```tsx
<CityPicker cities={customCities} allCitiesHref="/cities" />
```

## Full source

```tsx
import { CityPicker } from '@/modules/domains/event/CityPicker';

// Varsayılan şehirler
<CityPicker />

// Özelleştirme
<CityPicker
  cities={[
    { id: 'berlin', label: 'Berlin', count: 42 },
    { id: 'munich', label: 'Munich', count: 18 },
  ]}
  allCitiesHref="/cities"
/>
```
