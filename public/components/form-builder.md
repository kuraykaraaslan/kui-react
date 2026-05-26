# FormBuilder

- **id:** `form-builder`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FormBuilder/index.tsx`
- **status:** beta
- **since:** 2026-05

Typeform / JotForm-style drag-to-build form designer. M1 ships the field palette (text / email / number / textarea / select / radio / checkbox / date / file — multiselect / signature / rating are palette stubs), a draggable canvas with reorder + duplicate + delete, a right-hand settings panel (label, name, placeholder, helper text, required, default value, options), JSON schema export / import, and a paired FormRenderer with required + email-format validation. Future milestones: full validation engine + custom validators (M2), conditional logic editor + runtime AST eval (M3), multi-page + save & resume (M4), schema I/O + webhooks + signature / rating (M5), full WAI-ARIA / keyboard parity + i18n + theming (M6). Pixel-identical EJS sibling at modules/app/FormBuilder/FormBuilder.ejs.

## Depends on

- `button`
- `input`
- `checkbox`
- `select`
- `textarea`

## Accessibility

- WCAG: AA
- ARIA patterns: application, list, listitem, radiogroup, alert
- Keyboard:
  - `Tab` — Move focus across palette / canvas / settings
  - `Enter / Space` — Activate palette item to append a field
  - `Drag (mouse)` — Drag from palette → drop into canvas; reorder by dragging the grip handle

Builder root is role="application" with aria-label. Canvas list is role="list"; each draggable card is role="listitem" with aria-current when selected. FormRenderer adds aria-required + aria-invalid + aria-describedby per field, and surfaces validation messages with role="alert". Full keyboard reorder + LiveRegion announcements land in M6.

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-strong`
- `--border-focus`
- `--primary`
- `--primary-hover`
- `--primary-active`
- `--primary-fg`
- `--error`
- `--error-subtle`

## Variants

### Builder (drag + edit)

```tsx
const [schema, setSchema] = useState<FormSchema>(seed);
<FormBuilder schema={schema} onChange={setSchema} />
```

### Builder + live FormRenderer

```tsx
const [schema, setSchema] = useState<FormSchema>(seed);
<>
  <FormBuilder schema={schema} onChange={setSchema} />
  <FormRenderer schema={schema} onSubmit={async (values) => persist(values)} />
</>
```

### Standalone renderer (required + email validation)

```tsx
<FormRenderer
  schema={STARTER_SCHEMA}
  onSubmit={async (values) => persist(values)}
/>
```

## Full source

```tsx
import { useState } from 'react';
import { FormBuilder, FormRenderer, type FormSchema } from '@/modules/app/FormBuilder';

const seed: FormSchema = {
  id: 'contact',
  title: 'Contact form',
  fields: [
    { id: 'f1', type: 'text',  name: 'name',  label: 'Your name', required: true },
    { id: 'f2', type: 'email', name: 'email', label: 'Email',     required: true },
  ],
};

function ContactBuilder() {
  const [schema, setSchema] = useState<FormSchema>(seed);
  return (
    <>
      <FormBuilder schema={schema} onChange={setSchema} />
      <FormRenderer schema={schema} onSubmit={async (values) => console.log(values)} />
    </>
  );
}
```
