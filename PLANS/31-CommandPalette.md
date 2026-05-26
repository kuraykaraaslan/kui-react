# CommandPalette (AppCommandBar) — Geliştirme Planı (EJS Pariteli)

> NextJS: [AppCommandBar.tsx](../modules/app/AppCommandBar.tsx) 141. EJS: [AppCommandBar.ejs](../../02_EJS_Components/modules/app/AppCommandBar.ejs) 227.  
> Mevcut: hardcoded `DEFAULT_COMMANDS`, basit search filter. Yeni özellikler ekleyerek **kbar / cmdk / Raycast** seviyesine getir.

## Kuzey Yıldızı
cmdk (Vercel) + kbar + Raycast + Spotlight seviyesi: nested commands, fuzzy search, recent commands, action history, shortcut training, theme, plugin API.

---

## Hedef yapı
```
modules/app/CommandPalette/
├── index.tsx              ← named exports: CommandPalette, useCommands, registerCommand
├── types.ts               ← Command, CommandGroup, Scope
├── parts/
│   ├── Input.tsx          ← search w/ live suggestions
│   ├── ResultList.tsx     ← grouped + virtualized
│   ├── ResultItem.tsx     ← icon + label + shortcut + description
│   ├── Breadcrumb.tsx     ← nested scope path
│   ├── EmptyState.tsx     ← "No commands found" + suggestions
│   └── Footer.tsx         ← shortcuts hint
└── hooks/
    ├── useCommandStore.ts ← global registry (subscribe/dispatch)
    ├── useFuzzySearch.ts  ← fuzzysort lazy
    ├── useShortcuts.ts    ← Cmd+K open, Esc close
    ├── useScope.ts        ← nested command tree navigation
    └── useRecent.ts       ← localStorage queue
```

### EJS paralel
- AppCommandBar.ejs root + partials (_input/_list/_item/_breadcrumb).
- Scripts: command-store.js, fuzzy.js, shortcuts.js, scope.js, recent.js.

---

## Milestone'lar

### M1 — Fuzzy search + grouping
- `fuzzysort` lazy + score sort.
- Group headers (Navigation, Actions, Recent, Search Results).
- Highlight matched chars.
- Empty state suggestions.

### M2 — Dynamic registration
- `useRegisterCommand(cmd)` hook — scoped (route-aware, mount/unmount).
- Async commands: `command.perform = async () => { ... }` + loading state.
- Conditional: `command.enabled?: () => boolean`.
- `command.scope?` (global / page / panel).

### M3 — Nested scopes
- Parent command → enter sub-list (`children: Command[]` veya async loader).
- Breadcrumb: "Navigation > Settings >".
- Esc → bir scope yukarı.
- Backspace boşken → scope çık.

### M4 — Shortcuts & training
- Her command'a `shortcut: string` (Cmd+K formatı).
- Global hotkey registry (`useShortcuts`).
- "Shortcut conflicts" uyarı.
- Shortcut training panel: kullanmadığın command'ları öne çıkar.
- "Most used" rozeti.

### M5 — Search API + AI suggest
- `onSearch?: (query) => Promise<Command[]>` — backend search.
- Async result tipleri: Document, Person, Settings, Page.
- AI suggest (opsiyonel): "Open onboarding flow" → en yakın eylem.
- Recent commands (son 10, localStorage).

### M6 — A11y + theme + plugin
- WAI-ARIA Combobox + Listbox pattern.
- Klavye: arrow nav, Enter, Esc, Tab in scope, type-ahead.
- `messages` prop.
- Theme variant: default / glass (blur backdrop) / neon.
- Plugin API: 3rd-party paketler `registerCommand(...)` ile entegre.

---

## Public API
```ts
type Command = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  description?: string;
  group?: string;
  scope?: 'global' | string;
  enabled?: () => boolean;
  perform?: () => void | Promise<void>;
  children?: Command[] | (() => Promise<Command[]>);
  keywords?: string[];
};

type CommandPaletteProps = {
  commands?: Command[];
  onSearch?: (q: string) => Promise<Command[]>;
  placeholder?: string;
  shortcut?: string;          // open hotkey, default 'mod+k'
  theme?: 'default' | 'glass' | 'neon';
  showRecent?: boolean;
  recentLimit?: number;
  messages?: Partial<CommandPaletteMessages>;
  onCommandRun?: (cmd: Command) => void;
};
```

## Perf
- Core ≤ 10 kB.
- fuzzysort lazy +5 kB.
- 1 000 command @ ≤ 16 ms search.

## DoD
- [ ] NextJS + EJS paralel.
- [ ] axe-core 0 violations.
- [ ] Showcase: static / dynamic / nested / async-search / theme variant'ları.
