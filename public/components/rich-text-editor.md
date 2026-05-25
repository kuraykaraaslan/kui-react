# RichTextEditor

- **id:** `rich-text-editor`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/RichTextEditor.tsx`
- **status:** stable
- **since:** 2026-05

WYSIWYG editor for long-form prose. Built on Quill 2.x — single shared library on both the React and EJS sibling repos so output HTML is identical. Toolbar covers bold/italic/underline/strike/inline code, headings, blockquote, code block, lists, link, image (via Modal + FileInput), text align, clear formatting, undo/redo.

## Depends on

- `modal`
- `input`
- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: textbox, toolbar
- Keyboard:
  - `Ctrl/Cmd + B` — Bold selection
  - `Ctrl/Cmd + I` — Italic selection
  - `Ctrl/Cmd + U` — Underline selection
  - `Ctrl/Cmd + Z` — Undo
  - `Ctrl/Cmd + Shift + Z` — Redo

## Design tokens consumed

- `--surface-base`
- `--surface-sunken`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-focus`
- `--primary`
- `--error`

## Variants

### Empty

```tsx
const [body, setBody] = useState('');

<RichTextEditor
  id="article-body"
  label="Article body"
  hint="Use the toolbar to format your text."
  value={body}
  onChange={setBody}
  placeholder="Start writing your article…"
/>
```

### Pre-populated

```tsx
const initial = '<h1>Release notes</h1><p>...</p>';

<RichTextEditor
  id="release-notes"
  label="Release notes"
  defaultValue={initial}
  onChange={setBody}
/>
```

### Read-only

```tsx
<RichTextEditor
  id="archived"
  label="Archived document"
  hint="This document is read-only."
  defaultValue={savedHtml}
  readOnly
/>
```

## Full source

```tsx
import { RichTextEditor } from '@/modules/app/RichTextEditor';

const [body, setBody] = useState('');

<RichTextEditor
  id="article-body"
  label="Article body"
  hint="Use the toolbar to format your text."
  value={body}
  onChange={setBody}
  placeholder="Start writing your article…"
/>

// Pre-populated, uncontrolled:
<RichTextEditor
  id="release-notes"
  label="Release notes"
  defaultValue={initialHtml}
  onChange={setBody}
/>

// Read-only (toolbar hidden):
<RichTextEditor id="archived" defaultValue={savedHtml} readOnly />
```
