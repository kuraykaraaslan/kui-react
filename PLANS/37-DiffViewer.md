# DiffViewer — Yeni Bileşen Planı (EJS Pariteli)

> Mevcut **yok** — her iki repoda yeni bileşen.

## Kuzey Yıldızı
GitHub PR + GitLab MR + Phabricator + Beyond Compare seviyesi: text diff (unified + split), JSON diff, image diff, syntax highlight, line comments, accessible.

---

## Hedef yapı
```
modules/ui/DiffViewer/
├── index.tsx              ← named export
├── types.ts               ← DiffMode, Hunk, Change, CommentThread
├── parts/
│   ├── UnifiedView.tsx    ← tek kolon, eski/yeni alternates
│   ├── SplitView.tsx      ← yan yana
│   ├── DiffLine.tsx       ← +/- highlight, intra-line diff
│   ├── HunkHeader.tsx     ← "@@ -3,5 +3,7 @@"
│   ├── LineComment.tsx    ← code review yorumu
│   ├── ImageDiff.tsx      ← slider / swipe / onion / 2-up
│   └── JsonDiff.tsx       ← tree diff
└── hooks/
    ├── useDiff.ts         ← diff-match-patch / fast-diff
    ├── useSyntaxHighlight.ts ← shiki/prismjs lazy
    └── useScrollSync.ts   ← split view scroll sync
```

### EJS paralel
- DiffViewer.ejs root + partials (_unified/_split/_line/_image/_json).
- Scripts: diff.js (diff-match-patch), syntax.js (prism lazy), scroll-sync.js, image-diff.js.

---

## Milestone'lar

### M1 — Text diff core
- Algoritma: diff-match-patch veya fast-diff.
- Unified view (GitHub-style).
- Split view (yan yana).
- Intra-line diff (word-level highlight).
- Hunk header + ellipsis collapse.
- Line numbers (eski + yeni).

### M2 — Syntax highlight + lang
- shiki veya prismjs lazy.
- `language: Lang` prop.
- Token-aware highlight ('add'/'remove' line üstüne).
- Theme: light / dark / GitHub / Solarized.

### M3 — Code review (comments)
- Tıkla bir satıra → comment thread.
- `threads: CommentThread[]` + `onAddComment`.
- Reply, resolve, react.
- Suggestion mode ("Suggested change" yes/no).

### M4 — JSON / image / binary diff
- JSON tree diff: added/removed/changed keys highlight.
- Image diff: slider, swipe, onion-skin, 2-up modes.
- Binary diff: "Binary files differ" + size delta.
- Large diff truncate ("Load more").

### M5 — A11y + nav + perf
- Klavye: J/K (next/prev change), N/P (next/prev file), enter (expand collapsed).
- Screen reader: "Line 14 removed, Line 15 added".
- Roving tabindex.
- Reduced motion.
- Virtualization (10 000 line diff @ 50 fps).
- `messages` prop.

---

## Public API
```ts
type DiffViewerProps = {
  oldText?: string;
  newText?: string;
  oldImage?: string;
  newImage?: string;
  oldJson?: unknown;
  newJson?: unknown;
  mode?: 'unified' | 'split';
  language?: Lang;
  threads?: CommentThread[];
  onAddComment?: (line: number, side: 'old' | 'new', body: string) => Promise<void>;
  onResolveThread?: (id: string) => Promise<void>;
  context?: number;           // # of unchanged lines around hunks
  collapsible?: boolean;
  highlightSyntax?: boolean;
  virtualize?: boolean;
  imageMode?: 'slider' | 'swipe' | 'onion' | '2-up';
  messages?: Partial<DiffViewerMessages>;
};
```

## Perf
- Core ≤ 12 kB.
- diff-match-patch lazy +14 kB.
- shiki theme lazy +30 kB.
- 10 000 line diff < 200 ms compute, virtual render < 50 ms.

## DoD
- [ ] NextJS + EJS paralel.
- [ ] axe-core 0 violations.
- [ ] Showcase: unified text / split text / JSON / image-slider variants.
- [ ] CodeEditor (36) ile ortak syntax theme paylaşımı.
