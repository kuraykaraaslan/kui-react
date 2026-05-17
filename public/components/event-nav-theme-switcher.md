# NavThemeSwitcher

- **id:** `event-nav-theme-switcher`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/NavThemeSwitcher.tsx`
- **status:** stable
- **since:** 2026-05

Event koyu nav barına özel tema değiştirici (Açık / Koyu / Sistem); localStorage'a yazar ve html.dark class'ını yönetir.

## Variants

### Nav içinde

```tsx
<NavThemeSwitcher />
```

### Birlikte kullanım

```tsx
// Tipik event nav bar üst çubuğu:
<NavThemeSwitcher />
<TopBarDivider />
<NavLanguageSwitcher />
<TopBarDivider />
<CityPicker />
```

## Full source

```tsx
import { NavThemeSwitcher } from '@/modules/domains/event/NavThemeSwitcher';

// Koyu nav barı içinde kullanım
<NavThemeSwitcher />
```
