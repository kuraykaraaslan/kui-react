# CodeEditor — Yeni Bileşen Planı (EJS Pariteli)

> Mevcut **yok** — her iki repoda yeni bileşen. RichTextEditor (Quill-based) ve RulesetEditor'ün inline `<textarea>` script editor'ü ortak bir tabana ihtiyaç duyuyor.

## Kuzey Yıldızı
VSCode (Monaco) + CodeMirror 6 + Sublime seviyesi: syntax highlight, autocomplete, lint, multi-cursor, find/replace, accessible.

> İki implementasyon: **Monaco** (zengin, ağır) ve **CodeMirror 6** (hafif, fallback). Aynı API yüzeyi.

---

## Hedef yapı
```
modules/ui/CodeEditor/
├── index.tsx              ← named export, engine seçici
├── types.ts               ← Lang, Theme, EditorOptions, Marker
├── engines/
│   ├── monaco.tsx         ← @monaco-editor/react dynamic import
│   └── codemirror.tsx     ← codemirror-6 dynamic import
├── parts/
│   ├── Gutter.tsx         ← satır numarası + breakpoint dot
│   ├── Minimap.tsx        ← engine sağlamıyorsa fallback
│   └── Toolbar.tsx        ← language picker, theme, format
└── hooks/
    ├── useLazyEngine.ts   ← engine yükleme + cache
    ├── useDiagnostics.ts  ← lint markers
    └── useAutocomplete.ts ← custom suggest provider
```

### EJS paralel
- CodeEditor.ejs root + scripts (codemirror engine, monaco loader script).
- EJS'te varsayılan **CodeMirror 6** (Monaco runtime ağır), opt-in Monaco prop.
- Partials: _gutter.ejs, _toolbar.ejs.

---

## Milestone'lar

### M1 — Engine + lang
- Engine flag: `monaco` (default web) / `codemirror` (default EJS, hafif kullanım).
- Lang support: js, ts, json, html, css, sql, python, yaml, markdown.
- Theme: light / dark / high-contrast / custom (token map).
- `readonly` mode.
- `placeholder`.

### M2 — Edit experience
- Find / replace (Cmd+F, Cmd+H) + regex.
- Multi-cursor (Cmd+click) Monaco only; CodeMirror 6 native.
- Comment toggle (Cmd+/).
- Indent (Tab/Shift+Tab).
- Bracket matching + auto-pair.
- Format on save (Prettier — lazy).

### M3 — Diagnostics + autocomplete
- `markers: Marker[]` prop (lint/syntax errors).
- Custom suggest: `getSuggestions?: (ctx) => Suggestion[]`.
- Hover tooltip: `getHover?: (ctx) => Hover`.
- Custom language registration.
- TypeScript type defs ekleme: `extraLibs: { path, content }[]`.

### M4 — Premium
- Minimap.
- Code folding.
- Split view (diff yan yana — DiffViewer ile entegre).
- Snippet expansion (Tab).
- Vim / Emacs / VSCode keymap toggle (codemirror-vim lazy).
- Collaborative cursor (Yjs adapter, opsiyonel).

### M5 — A11y + i18n
- Screen reader mode (`accessibilitySupport`).
- Klavye-only mümkün.
- `messages` prop.
- Reduced motion (cursor blink off).

---

## Public API
```ts
type CodeEditorProps = {
  value: string;
  onChange: (v: string) => void;
  language?: Lang;
  theme?: 'light' | 'dark' | 'high-contrast' | EditorTheme;
  engine?: 'monaco' | 'codemirror';
  readonly?: boolean;
  placeholder?: string;
  markers?: Marker[];
  getSuggestions?: (ctx: SuggestContext) => Suggestion[];
  getHover?: (ctx: HoverContext) => Hover;
  extraLibs?: { path: string; content: string }[];
  showMinimap?: boolean;
  showLineNumbers?: boolean;
  keymap?: 'default' | 'vim' | 'emacs';
  formatOnSave?: boolean;
  messages?: Partial<CodeEditorMessages>;
};
```

## Perf
- Core (engine-less) ≤ 4 kB.
- CodeMirror 6 lazy ~70 kB gzipped.
- Monaco lazy ~1 MB (sadece istenirse).
- 10 000 satır syntax highlight @ 60 fps (Monaco), 50 fps (CodeMirror).

## Adoption planı
- **RulesetEditor** geliştirme planı M3 (Monaco editör) bu bileşeni kullansın — kod paylaşımı.
- **RichTextEditor** code block insert UX'i bu bileşeni embed etsin.
- **DiffViewer** (37) editör çiftleri bu bileşenden gelir.

## DoD
- [ ] NextJS + EJS paralel.
- [ ] axe-core 0 violations.
- [ ] Showcase: light/dark / js / json / sql / readonly / diagnostics / minimap / vim variant'ları.
