# MentionPicker

- **id:** `mention-picker`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/MentionPicker.tsx`
- **status:** stable
- **since:** 2026-05

@-trigger autocomplete picker. Headless: takes users + query + position, fires onSelect. Keyboard nav (ArrowUp/Down, Enter/Tab, Escape).

## Depends on

- `avatar`

## Accessibility

- WCAG: AA
- ARIA patterns: role="listbox", role="option", aria-selected
- Keyboard:
  - `ArrowDown / ArrowUp` — Move selection
  - `Enter / Tab` — Insert highlighted mention
  - `Escape` — Cancel picker

## Design tokens consumed

- `--surface-raised`
- `--surface-overlay`
- `--border`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`

## Variants

### Filtered list

```tsx
<MentionPicker users={users} query="ay" onSelect={(u) => {}} onCancel={() => {}} />
```

### Empty results

```tsx
<MentionPicker users={users} query="zzz" onSelect={(u) => {}} onCancel={() => {}} />
```

## Full source

```tsx
'use client';
import { MentionPicker } from '@/modules/app/MentionPicker';

<MentionPicker
  users={users}
  query={query}
  position={{ top, left }}
  onSelect={(u) => insertMention(u)}
  onCancel={() => closePicker()}
/>
```
