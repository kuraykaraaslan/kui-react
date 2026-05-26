# Kanban Board — Yeni Bileşen Planı (EJS Pariteli)

> Mevcut **yok** — her iki repoda yeni bileşen.

## Kuzey Yıldızı
Trello + Linear + Jira + Notion Board seviyesi: drag between columns, swimlanes, WIP limits, filter, bulk move, accessible.

---

## Hedef yapı
```
modules/app/KanbanBoard/
├── index.tsx              ← named export
├── types.ts               ← KanbanCard, KanbanColumn, Swimlane
├── parts/
│   ├── Column.tsx         ← header + WIP rozet + cards
│   ├── Card.tsx           ← title + meta + drag handle
│   ├── ColumnHeader.tsx
│   ├── SwimlaneRow.tsx
│   ├── AddCardInline.tsx  ← "+ Add card" inline form
│   └── ColumnDropIndicator.tsx
└── hooks/
    ├── useDnD.ts          ← cross-column drag (HTML5)
    ├── useColumnReorder.ts
    ├── useWipLimit.ts     ← validation
    ├── useKeyboardMove.ts ← Cmd+arrow → kart taşı
    └── useBulkSelect.ts
```

### EJS paralel
- KanbanBoard.ejs root + partials (_column/_card/_swimlane/_add-card).
- Scripts: dnd.js, column-reorder.js, wip.js, keyboard.js, bulk-select.js.

---

## Milestone'lar

### M1 — Core DnD
- Drag card between columns (HTML5 DnD).
- Drop indicator (line yerine highlight).
- Optimistic UI + `onCardMove` async callback.
- `canMove?: (card, from, to) => boolean`.

### M2 — Column ops
- Column reorder (drag column header).
- Column collapse/expand.
- Column color/icon.
- Column add/delete (inline form).
- WIP limit (column.wipLimit) + rozet ("3/5") + over-limit kırmızı.

### M3 — Swimlanes + filter
- Swimlane row (grouped by assignee / priority / label).
- Filter chips (assignee, label, priority, due date).
- Search.
- Hide done column toggle.

### M4 — Card detail + inline edit
- Card click → side panel veya modal.
- Inline title edit (double-click).
- Quick actions (assignee, due, label) Card hover'da.
- Bulk select (Shift+click) → bulk move/delete.

### M5 — A11y + keyboard + i18n
- Klavye: focus card, Cmd+arrow → taşı, Enter → detay, Space → seç.
- WAI-ARIA: `role="region"` per column, `role="list"`, `aria-label` board.
- Screen reader: "Card 'Fix bug' moved from To Do to In Progress, column 2 of 4".
- `messages` prop.

### M6 — Premium
- Virtualization (1 000+ card per column).
- Auto-archive done after N days.
- Linked cards (dependency).
- Time-on-column tracking (CFD chart entegrasyonu — Charts plan'a delegate).
- Subscriptions (real-time updates).

---

## Public API
```ts
type KanbanBoardProps<T> = {
  columns: KanbanColumn<T>[];
  cards: KanbanCard<T>[];
  swimlanes?: Swimlane[];
  onCardMove?: (card: KanbanCard<T>, from: ColumnId, to: ColumnId, index: number) => Promise<void>;
  onColumnReorder?: (order: ColumnId[]) => Promise<void>;
  onCardCreate?: (columnId: ColumnId, title: string) => Promise<KanbanCard<T>>;
  onCardUpdate?: (card: KanbanCard<T>) => Promise<void>;
  filters?: KanbanFilters;
  search?: string;
  bulkSelectable?: boolean;
  virtualize?: boolean;
  renderCard?: (card: KanbanCard<T>) => React.ReactNode;
  messages?: Partial<KanbanMessages>;
  onTelemetry?: (e: KanbanTelemetry) => void;
};
```

## Perf
- Core ≤ 15 kB.
- 1 000 card virtualized @ ≥ 58 fps.

## DoD
- [ ] NextJS + EJS paralel yeni dosyalar.
- [ ] axe-core 0 violations.
- [ ] Klavye-only ile tüm akış mümkün.
- [ ] Showcase: 3-col / swimlane / WIP / bulk / filter variant'ları.
