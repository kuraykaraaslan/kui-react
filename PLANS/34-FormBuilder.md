# FormBuilder — Yeni Bileşen Planı (EJS Pariteli)

> Mevcut **yok** — her iki repoda yeni bileşen.

## Kuzey Yıldızı
Typeform + Tally + JotForm + Google Forms seviyesi: drag-to-build, JSON-Schema export, conditional logic, multi-page, validation, accessible.

---

## Hedef yapı
```
modules/app/FormBuilder/
├── index.tsx              ← named exports: FormBuilder (editor) + FormRenderer (runtime)
├── types.ts               ← FormSchema, Field, FieldType, Logic
├── editor/
│   ├── FieldPalette.tsx   ← drag source (Text / Email / Select / Date / File / ...)
│   ├── Canvas.tsx         ← drop target + ordered list
│   ├── FieldRow.tsx       ← draggable card
│   ├── FieldSettings.tsx  ← right panel (label, required, validation, options)
│   ├── LogicEditor.tsx    ← "Show X if Y == Z"
│   ├── PagesPanel.tsx     ← multi-page tabs
│   └── PreviewToggle.tsx
├── renderer/
│   ├── FormRenderer.tsx   ← schema → live form
│   ├── FieldComponents/   ← Text / Email / Number / Select / Multiselect / Date / File / Signature / Rating
│   └── useFormState.ts    ← state + validation + logic eval
└── hooks/
    ├── useSchemaState.ts
    ├── useDragDrop.ts
    └── useLogicEval.ts
```

### EJS paralel
- FormBuilder.ejs (editor) + FormRenderer.ejs (runtime) + partials per field type.
- Scripts: schema-state.js, drag-drop.js, logic-eval.js, validation.js.

---

## Milestone'lar

### M1 — Field palette + canvas
- Drag from palette → drop on canvas.
- Reorder within canvas.
- Delete + duplicate.
- 12 temel alan tipi: text / email / number / textarea / select / multiselect / radio / checkbox / date / file / signature / rating.
- Field settings panel (label, placeholder, helper text, required, default value).

### M2 — Validation
- Built-in: required, min/max length, regex, email format, file size/type.
- Custom: `validate?: (value, allValues) => string | null`.
- Error display: inline + summary.
- Real-time + on-submit modes.

### M3 — Conditional logic
- "Show field X if field Y == value Z".
- "Skip page A if field B is empty".
- Logic editor: visual rule builder.
- Logic eval at runtime (safe — no eval, just AST).

### M4 — Multi-page + progress
- Page tabs (editor) + step indicator (renderer).
- Save & resume (localStorage by formId).
- Progress bar.
- Validation per page (block next).

### M5 — Schema I/O + integrations
- JSON Schema export/import.
- Webhook on submit.
- Email notification template.
- Spreadsheet export.
- Embed mode (iframe-friendly).

### M6 — A11y + i18n + cilası
- WAI-ARIA Form pattern (`aria-required`, `aria-invalid`, `aria-describedby`).
- Klavye: Tab nav, Shift+Tab back, Enter → next.
- Screen reader announce errors.
- `messages` prop.
- Theme/branding (color, font).

---

## Public API
```ts
type FormBuilderProps = {
  schema: FormSchema;
  onChange: (schema: FormSchema) => void;
  fieldTypes?: FieldType[];           // limit available types
  messages?: Partial<FormBuilderMessages>;
};

type FormRendererProps = {
  schema: FormSchema;
  values?: Record<string, unknown>;
  onChange?: (values: Record<string, unknown>) => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  saveResume?: { key: string };
  theme?: { primary?: string; font?: string };
  messages?: Partial<FormRendererMessages>;
};
```

## Perf
- Editor ≤ 30 kB, Renderer ≤ 15 kB (tree-shakeable).
- 100 field canvas @ 60 fps.

## DoD
- [ ] NextJS + EJS paralel yeni dosyalar.
- [ ] axe-core 0 violations runtime.
- [ ] Schema JSON round-trip stable.
- [ ] Showcase: builder + renderer + multi-page + logic variant'ları.
