# AppCommandBar

- **id:** `app-command-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/CommandPalette/index.tsx`
- **status:** beta
- **since:** 2025-04

Keyboard-first command palette. Opens with ⌘K. Lists the `items` it gets plus every command registered with `registerCommand` / `registerCommands` / `useRegisterCommand`; commands carry `group`, `order` and `hidden`. Sample commands only with `demo`.

## Variants

### Sample commands (demo)

```tsx
<AppCommandBar demo onSelect={(item) => console.log(item.label)} />
```

### Özel items + trigger

```tsx
<AppCommandBar
  items={customItems}
  trigger={<Button variant="ghost" size="sm" iconRight={<Badge variant="neutral" size="sm">⌘K</Badge>}>Search…</Button>}
  onSelect={handleSelect}
/>
```

### Fuzzy search + özel gruplar

```tsx
// Try typing "kbd", "asgn" or "rls" to exercise the subsequence matcher.
const fuzzyItems = [
  { icon: '⌨️', label: 'Open Keyboard Shortcuts',  shortcut: '?',   category: 'Help',        keywords: ['kbd'] },
  { icon: '📚', label: 'Browse Documentation',     shortcut: 'G H', category: 'Help' },
  { icon: '🔔', label: 'Notification Preferences', shortcut: 'G N', category: 'Preferences' },
  { icon: '🛠️', label: 'Assign Reviewer to PR-42', shortcut: 'A R', category: 'Workflows',   keywords: ['asgn'] },
  { icon: '🚀', label: 'Release & Tag v1.4.0',     shortcut: 'R T', category: 'Workflows',   keywords: ['rls'] },
];

<AppCommandBar items={fuzzyItems} />
```

### Registered commands: group, order, hidden

```tsx
// Any module adds commands to the shared registry; the palette lists them with its own items.
useEffect(() => registerCommands([
  { id: 'tel-call', label: 'Call a contact', group: 'Telephony', order: 30, hidden: !canCall },
  { id: 'tel-log', label: 'Open call log', group: 'Telephony', order: 31 },
]), [canCall]);

<AppCommandBar items={[
  { id: 'go-home', label: 'Go to dashboard', group: 'Navigation', order: 0 },
  { id: 'new-lead', label: 'New lead', group: 'Create', order: 10 },
]} />
```

## Full source

```tsx
'use client';
import { AppCommandBar } from '@/modules/app/CommandPalette';

// With the sample commands (demos only):
<AppCommandBar demo onSelect={(item) => console.log(item.label)} />

// With custom commands:
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
