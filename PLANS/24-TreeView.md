# TreeView — Geliştirme Planı (EJS Pariteli)

> NextJS: [TreeView.tsx](../modules/ui/TreeView.tsx) 116. EJS: 130.

## Kuzey Yıldızı
VSCode Explorer + Finder + Notion Sidebar seviyesi: drag-and-drop, lazy load, multi-select, virtualization, accessible (WAI-ARIA Tree pattern).

---

## Hedef yapı
```
modules/ui/TreeView/
├── index.tsx              ← named export
├── types.ts               ← TreeNode<T>, NodeId, SelectionMode
├── parts/
│   ├── Node.tsx           ← expand toggle + icon + label + dnd handle
│   └── DropIndicator.tsx
└── hooks/
    ├── useTreeState.ts    ← expanded set, selected set, focus id
    ├── useDnD.ts          ← HTML5 DnD; drop target = before/after/inside
    ├── useLazyChildren.ts ← onLoadChildren async + cache
    ├── useKeyboardNav.ts  ← arrow / Home / End / type-ahead
    └── useVirtualize.ts   ← visible-only render
```

### EJS paralel
- TreeView.ejs root + partial `_node.ejs` (rekursif `include('_node', { node })`).
- scripts: tree-state.js, dnd.js, lazy.js, keyboard.js, virtualize.js.

---

## Milestone'lar

### M1 — Core nav + selection
- Expand/collapse all (button + Cmd+A).
- Single / multi (Cmd+click) / range (Shift+click) selection.
- Type-ahead jump ("d" basınca "Documents"'a atla).
- Klavye: arrow, ←/→ (collapse/expand), Home, End.

### M2 — Drag & drop
- Drag node → drop before/after/inside.
- Visual drop indicator (line vs highlight).
- `canDrop?: (drag, drop) => boolean` validation.
- Multi-drag (seçili tüm node'ları sürükle).
- `onMove?: (ids: NodeId[], target: { parentId: NodeId | null; index: number }) => void`.

### M3 — Lazy load + virtualization
- `onLoadChildren?: (node) => Promise<TreeNode[]>` — expand'de fetch.
- Loading spinner per node.
- Caching with TTL.
- Virtualization: 10 000 visible node @ 60 fps.

### M4 — Context menu + inline edit
- Right-click → ContextMenu (Rename, Delete, Move, Duplicate, New folder).
- F2 / Enter → inline rename.
- Delete → Modal confirm.
- Cut/Copy/Paste with clipboard semantics.

### M5 — A11y + i18n
- WAI-ARIA Tree pattern (`role="tree"`, `aria-expanded`, `aria-selected`, `aria-level`).
- Screen reader: "Documents, expanded, 12 items, level 2 of 4".
- `messages` prop.
- Reduced motion.

---

## Public API
```ts
type TreeViewProps<T> = {
  nodes: TreeNode<T>[];
  selectedIds?: NodeId[];
  expandedIds?: NodeId[];
  focusId?: NodeId;
  selectionMode?: 'single' | 'multi';
  onSelectionChange?: (ids: NodeId[]) => void;
  onExpand?: (id: NodeId, expanded: boolean) => void;
  onLoadChildren?: (node: TreeNode<T>) => Promise<TreeNode<T>[]>;
  onMove?: (ids: NodeId[], target: { parentId: NodeId | null; index: number }) => void;
  onRename?: (id: NodeId, name: string) => Promise<void>;
  contextMenuItems?: (node: TreeNode<T>) => ContextMenuItem[];
  renderNode?: (node: TreeNode<T>) => React.ReactNode;
  virtualize?: boolean;
  messages?: Partial<TreeViewMessages>;
};
```

## Perf bütçesi
- Core ≤ 8 kB.
- 10 000 node virtualized @ ≥ 58 fps.
- Lazy expand ≤ 80 ms perceived.

## DoD
- [ ] NextJS + EJS paralel.
- [ ] axe-core 0 violations.
- [ ] Showcase: flat / nested / lazy / DnD / multi-select / context menu variant'ları.
