# ThemeSwitcher

- **id:** `theme-switcher`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ThemeSwitcher.tsx`
- **status:** stable
- **since:** 2026-05

Tri-state theme selector (light / dark / system). Persists the choice to localStorage and toggles the .dark class on <html>. Mounts safely on the server with a placeholder until hydrated.

## Variants

### Default

```tsx
<ThemeSwitcher />
```

## Full source

```tsx
'use client';
import { ThemeSwitcher } from '@/modules/app/ThemeSwitcher';

// Drop into any layout — manages its own state.
<ThemeSwitcher />
```
