# TreeView

- **id:** `tree-view`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TreeView/index.tsx`
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

### Multi-select + type-ahead

```tsx
function Demo() {
  const [ids, setIds] = useState<string[]>(['Card']);
  return (
    <TreeView
      label="Project files"
      selectionMode="multi"
      selectedIds={ids}
      onSelectionChange={setIds}
      nodes={[
        { id: 'docs', label: 'Documents', children: [
          { id: 'spec', label: 'spec.md' },
          { id: 'roadmap', label: 'roadmap.md' },
        ]},
        { id: 'src', label: 'src', children: [
          { id: 'Button', label: 'Button.tsx' },
          { id: 'Card', label: 'Card.tsx' },
          { id: 'Drawer', label: 'Drawer.tsx' },
          { id: 'TreeView', label: 'TreeView.tsx' },
        ]},
      ]}
    />
  );
}

// Try it:
//  - Cmd/Ctrl-click       → toggle individual rows
//  - Shift-click          → range-select between anchor and clicked row
//  - Type "tre"           → focus jumps to "TreeView.tsx"
//  - Cmd/Ctrl+A           → select all visible rows
//  - Arrow keys / Home/End / Space / Enter — full keyboard nav.
```

## Full source

```tsx
'use client';
import { useTreeState } from './hooks/useTreeState';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { TreeNodeRow } from './parts/Node';

export function TreeView({ nodes, selectedId, selectedIds, onSelect, onSelectionChange, selectionMode = 'single', ... }) {
  // M1: expand all / collapse all, single + multi (Cmd/Shift-click) selection,
  //      arrow keys, Home/End, type-ahead jump, Space toggle, Enter activate.
  // M2-M5: drag-drop, lazy load, virtualize, context menu, full ARIA polish.
}
```
