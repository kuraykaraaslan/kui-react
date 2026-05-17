# AppCommandBar

- **id:** `app-command-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppCommandBar.tsx`
- **status:** beta
- **since:** 2025-04

Keyboard-first komut paleti. ⌘K trigger'ı ile açılır; items prop'u ile özel komutlar geçilebilir, varsayılan navigation/actions/recent seti dahilidir.

## Variants

### Varsayılan komutlar

```tsx
<AppCommandBar onSelect={(item) => console.log(item.label)} />
```

### Özel items + trigger

```tsx
<AppCommandBar
  items={customItems}
  trigger={<Button variant="ghost" size="sm" iconRight={<Badge variant="neutral" size="sm">⌘K</Badge>}>Search…</Button>}
  onSelect={handleSelect}
/>
```

## Full source

```tsx
'use client';
import { AppCommandBar } from '@/modules/app/AppCommandBar';

// Varsayılan komutlarla:
<AppCommandBar onSelect={(item) => router.push(item.href)} />

// Özel komutlarla:
<AppCommandBar
  items={[
    { icon: '🏠', label: 'Dashboard', shortcut: 'G D', category: 'Navigation' },
    { icon: '➕', label: 'New Project', shortcut: '⌘N', category: 'Actions', onClick: handleNew },
    { icon: '🕐', label: 'Recent Item', category: 'Recent' },
  ]}
  trigger={<Button variant="outline" size="sm">⌘K</Button>}
  onSelect={handleSelect}
/>
```
