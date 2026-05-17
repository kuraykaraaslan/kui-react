# LanguageSwitcher

- **id:** `common-language-switcher`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/i18n/LanguageSwitcher.tsx`
- **status:** stable
- **since:** 2025-04

Dropdown language selector using AppLanguage, LANG_NAMES and LANG_FLAGS from I18nTypes. RTL direction is applied per-option automatically.

## Variants

### Default

```tsx
<LanguageSwitcher value={lang} onChange={setLang} languages={['en', 'tr', 'de', 'fr']} />
```

### RTL selected

```tsx
<LanguageSwitcher value="ar" onChange={setLang} languages={['en', 'tr', 'de', 'fr', 'ar']} />
```

## Full source

```tsx
'use client';
import { LanguageSwitcher } from '@/modules/domains/common/i18n/LanguageSwitcher';

// Controlled — driven by AVAILABLE_LANGUAGES from env
<LanguageSwitcher value={lang} onChange={setLang} />

// Explicit list
<LanguageSwitcher
  value={lang}
  onChange={setLang}
  languages={['en', 'tr', 'de', 'fr', 'ar']}
/>
```
