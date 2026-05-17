# TreeView

- **id:** `tree-view`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TreeView.tsx`
- **status:** stable
- **since:** 2025-03

Collapsible tree with keyboard navigation, selection, and aria-tree roles.

## Variants

### File tree

```tsx
function Demo() {
  const [sel, setSel] = useState();
  return (
    <TreeView selectedId={sel} onSelect={setSel} label="Files"
      nodes={[
        { id: 'src', label: 'src', children: [
          { id: 'Button', label: 'Button.tsx' },
        ]},
      ]}
    />
  );
}
```

### Navigation menu

```tsx
function Demo() {
  const [sel, setSel] = useState();
  return (
    <TreeView label="Settings navigation" selectedId={sel} onSelect={setSel}
      nodes={[
        { id: 'account', label: 'Account', children: [
          { id: 'profile', label: 'Profile' },
          { id: 'password', label: 'Password' },
        ]},
        { id: 'workspace', label: 'Workspace', children: [
          { id: 'general', label: 'General' },
          { id: 'billing', label: 'Billing' },
        ]},
        { id: 'integrations', label: 'Integrations' },
      ]}
    />
  );
}
```

### Flat list

```tsx
function Demo() {
  const [sel, setSel] = useState('ts');
  return (
    <TreeView label="Language selector" selectedId={sel} onSelect={setSel}
      nodes={[
        { id: 'ts', label: 'TypeScript' },
        { id: 'js', label: 'JavaScript' },
        { id: 'py', label: 'Python' },
        { id: 'go', label: 'Go' },
      ]}
    />
  );
}
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';

export function TreeView({ nodes, selectedId, onSelect, label }) {
  // recursive treeitem rendering, arrow-key expand/collapse
}
```
