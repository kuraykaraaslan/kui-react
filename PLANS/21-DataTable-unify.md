# DataTable Ailesi — Unify + Geliştirme Planı (EJS Pariteli)

> NextJS: [Table.tsx](../modules/ui/Table.tsx) 140, [DataTable.tsx](../modules/ui/DataTable.tsx) 217, [AdvancedDataTable.tsx](../modules/ui/AdvancedDataTable.tsx) 192, [ServerDataTable.tsx](../modules/ui/ServerDataTable.tsx) 173.
> EJS: aynı isimlerle 166 / 327 / 180 / 94.

## Kuzey Yıldızı
TanStack Table v8 + AG Grid Community + Material React Table seviyesinde, **tek bir API** ile static / paginated / server-mode kullanılan birleşik tablo.

---

## 1. Unify stratejisi
Bugün 4 ayrı bileşen var; çoğu davranış kopya. Hedef:

```
modules/ui/Table/
├── index.tsx              ← named exports: Table (low-level), DataTable (rich)
├── types.ts               ← Column<T>, SortState, FilterState, PaginationState, RowSelectionState
├── core/
│   ├── useTable.ts        ← reducer (sort + filter + paginate + select)
│   ├── useServerTable.ts  ← async fetch + cursor/page state
│   └── columnHelpers.ts   ← createColumn, accessor, cell renderers
├── parts/
│   ├── HeaderCell.tsx     ← sort indicator, resize handle, filter trigger
│   ├── BodyRow.tsx
│   ├── FilterPopover.tsx
│   ├── Pagination.tsx     ← ui/Pagination wrap
│   ├── Toolbar.tsx        ← search + bulk actions + export
│   └── EmptyState.tsx
└── plugins/
    ├── columnResize.ts
    ├── columnReorder.ts
    ├── stickyHeader.ts
    ├── stickyCol.ts
    ├── virtualization.ts
    ├── export.ts          ← CSV / XLSX / JSON
    └── grouping.ts
```

**Migration plan:** `DataTable`, `AdvancedDataTable`, `ServerDataTable` artık ortak `<DataTable />` + `mode: 'static' | 'paginated' | 'server'` flag'ine bağlanır. Eski adlar bir sürüm boyunca re-export kalır, deprecation notice'lı.

### EJS unify paralel
```
modules/ui/Table/
├── Table.ejs               ← markup root
├── partials/_header-cell.ejs / _row.ejs / _toolbar.ejs / _pagination.ejs
└── scripts/
    ├── data-table.js       ← reducer (sort/filter/paginate)
    ├── server-table.js     ← fetch + state sync
    ├── column-resize.js
    ├── column-reorder.js
    ├── virtualization.js
    └── export.js
```

EJS tarafında bugün 4 ayrı dosyada toplam 767 satır; yeni yapıda root ≤120 satır, geri kalan partials/scripts'e dağılır.

---

## 2. Geliştirme milestone'ları

### M1 — Sıralama / arama / sayfalama (unified)
- Çoklu sütun sort (Shift+click).
- Global search + sütun bazlı filter (popover).
- Pagination: cursor veya offset.
- Empty / loading / error state'leri tek prop'tan.

### M2 — Yapısal özellikler
- Column resize (mouse + keyboard `Alt+←/→`).
- Column reorder (drag).
- Column show/hide menüsü.
- Column pinning (left/right sticky).
- Sticky header + horizontal scroll.

### M3 — Virtualization + büyük veri
- Row virtualization (TanStack Virtual). 100k satır @ 60fps.
- Variable row height desteği.
- Sticky group headers (grouping ile).
- `keepPreviousData` semantiği server modda.

### M4 — Seçim + bulk ops + export
- Row selection (single / multi / range).
- Sticky selection toolbar — "3 selected, Delete / Export / Tag".
- CSV / JSON / XLSX export — `xlsx` lazy import.
- Print-friendly görünüm.

### M5 — Gelişmiş
- Row grouping + aggregations (sum/avg/count).
- Expandable rows / sub-rows (tree-grid).
- Inline edit (cell editing) — `editable: boolean | (row) => boolean`.
- Editable cell types: text, number, select, date.
- Optimistic save + dirty highlight.

### M6 — A11y + i18n + perf
- ARIA grid pattern (`role="grid"`, `aria-rowindex`, `aria-colindex`).
- Roving tabindex, arrow nav.
- `messages` prop (TR/EN/AR).
- Reduced motion.
- Print stylesheet.

---

## Public API delta
```ts
type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  mode?: 'static' | 'paginated' | 'server';
  fetchPage?: (state: TableState) => Promise<{ rows: T[]; total: number; cursor?: string }>;
  selectable?: 'single' | 'multi' | false;
  selectedRowIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  // resize/reorder/pin
  enableColumnResize?: boolean;
  enableColumnReorder?: boolean;
  pinnedColumns?: { left?: string[]; right?: string[] };
  // virtualization
  virtualize?: boolean | { rowHeight?: number | ((row: T) => number); overscan?: number };
  // grouping & expand
  groupBy?: string[];
  expandable?: (row: T) => React.ReactNode;
  // editing
  editable?: boolean | ((row: T, col: Column<T>) => boolean);
  onCellEdit?: (row: T, col: Column<T>, value: unknown) => Promise<void>;
  // export
  exportFormats?: ('csv' | 'json' | 'xlsx')[];
  // toolbar
  toolbar?: 'search' | 'full' | 'none';
  // i18n + a11y
  messages?: Partial<DataTableMessages>;
  reducedMotion?: boolean;
  // telemetry
  onTelemetry?: (e: DataTableTelemetry) => void;
};
```

## Telemetri
`sort`, `filter`, `paginate`, `select`, `bulk-action`, `column-resize`, `column-reorder`, `export`, `cell-edit`, `virtualize-mount`.

## Perf bütçesi
- Ana yol JS (gzip) ≤ 18 kB.
- XLSX export lazy +60 kB.
- 100k row virtual scroll ≥ 55 fps.
- Sort/filter 10k rows ≤ 80 ms (Web Worker opsiyonel).

## DoD (milestone başına)
- [ ] NextJS + EJS aynı sprint merge.
- [ ] Eski 3 bileşen (`DataTable`/`AdvancedDataTable`/`ServerDataTable`) hâlâ çalışıyor (re-export).
- [ ] Showcase'te eski variant'lar yeni API'ye refactor edildi.
- [ ] Registry snapshot + build temiz.
