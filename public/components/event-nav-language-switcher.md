# NavLanguageSwitcher

- **id:** `event-nav-language-switcher`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/NavLanguageSwitcher.tsx`
- **status:** stable
- **since:** 2026-05

Event koyu nav barına özel dil seçici; bayrak emojileri ve seçili işareti. Mevcut LanguageSwitcher'dan bağımsız koyu tema variant'ı.

## Variants

### Nav içinde

```tsx
<NavLanguageSwitcher />
```

## Full source

```tsx
import { NavLanguageSwitcher } from '@/modules/domains/event/NavLanguageSwitcher';

// Varsayılan diller (TR, EN, DE, FR, AR, RU)
<NavLanguageSwitcher />

// Kontrollü mod
<NavLanguageSwitcher
  value={lang}
  onChange={(id) => setLang(id)}
/>
```
