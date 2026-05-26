# MultiSelect + ComboBox — Geliştirme Planı (EJS Pariteli)

> NextJS: [MultiSelect.tsx](../modules/ui/MultiSelect.tsx) 211, [ComboBox.tsx](../modules/ui/ComboBox.tsx) 320.  
> EJS: 278 / 275.

## Kuzey Yıldızı
Headless UI Combobox + Downshift + react-select seviyesinde, async load, virtualization, paste-multiple, accessible (WAI-ARIA Combobox pattern).

> ComboBox 320 satır — refactor (split) + enhancement. MultiSelect 211 satır — enhancement.

---

## Split (NextJS — yalnız ComboBox)
```
modules/ui/ComboBox/
├── index.tsx           ← ≤120 satır
├── types.ts
├── parts/
│   ├── Trigger.tsx     ← search input + chip strip + clear
│   ├── Listbox.tsx     ← virtualized options
│   ├── Chip.tsx
│   └── GroupHeader.tsx
└── hooks/
    ├── useFilter.ts    ← debounce + fuzzy match (fuse.js opsiyonel)
    ├── useAsync.ts     ← onSearch + AbortController + cache
    ├── useKeyboard.ts  ← arrow / Enter / Esc / Home / End / Type-ahead
    └── usePosition.ts  ← floating-ui veya manual collision
```

MultiSelect ile **shared listbox + filter hook'ları** — `MultiSelect` `ComboBox`'tan implementation paylaşır, sadece selection cardinality değişir.

### EJS paralel
- ComboBox.ejs root + partials (_trigger/_listbox/_chip) + scripts (filter.js, async.js, keyboard.js).
- MultiSelect aynı partial'ları include eder.

---

## Milestone'lar

### M1 — Async + virtualization
- `onSearch?: (q) => Promise<Option[]>` — debounced (300 ms), AbortController.
- Pagination cursor (`onLoadMore`).
- Virtualization (1000+ option).
- Loading skeleton.

### M2 — Multi-value UX
- Chip strip with overflow ("+3 more").
- Backspace → son chip sil.
- `maxItems` + uyarı.
- Paste-multiple: virgül/yeni satır ile bölme (`pasteSeparator`).
- Drag-to-reorder chip'leri.

### M3 — Grouping + custom render
- `groupBy: (opt) => string` veya `groups: GroupDef[]`.
- Sticky group header.
- Custom option renderer (`renderOption`, `renderSelected`).
- "Create new" item (`creatable`).

### M4 — A11y AAA + i18n
- WAI-ARIA Combobox pattern (aria-autocomplete, aria-controls, aria-activedescendant).
- Screen reader anonsu: "John Doe, option 3 of 12, selected".
- Klavye: Type-ahead, Home/End, Ctrl+A.
- `messages` prop.

### M5 — Premium
- Async create with confirmation (yeni tag eklerken backend onayı).
- Free solo mode (input olarak da kullanılabilir).
- Hierarchical (cascading select).
- Disable individual options + reason tooltip.

---

## Public API
```ts
type ComboBoxProps<T> = {
  value: T | null;
  onChange: (v: T | null) => void;
  options?: Option<T>[];
  onSearch?: (q: string) => Promise<Option<T>[]>;
  onLoadMore?: () => Promise<Option<T>[]>;
  groupBy?: (opt: Option<T>) => string;
  renderOption?: (opt: Option<T>) => React.ReactNode;
  creatable?: boolean | { onCreate: (input: string) => Promise<Option<T>> };
  freeSolo?: boolean;
  virtualize?: boolean;
  debounceMs?: number;
  cacheKey?: string;
  messages?: Partial<ComboBoxMessages>;
};

type MultiSelectProps<T> = Omit<ComboBoxProps<T>, 'value' | 'onChange'> & {
  values: T[];
  onChange: (v: T[]) => void;
  maxItems?: number;
  pasteSeparator?: string | RegExp;
  reorderable?: boolean;
};
```

## Perf
- Core ≤ 12 kB.
- Virtualization ≥ 58 fps @ 10k options.
- Async debounce 300 ms, cache 5 dk.

## DoD
- [ ] NextJS + EJS paralel merge.
- [ ] axe-core 0 violations (WAI-ARIA Combobox APG kontrol listesi).
- [ ] Showcase: sync / async / virtualized / grouped / creatable / multi variant'ları.
