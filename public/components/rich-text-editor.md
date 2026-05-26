# RichTextEditor

- **id:** `rich-text-editor`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/RichTextEditor/index.tsx`
- **status:** stable
- **since:** 2026-05

Quill 2.x WYSIWYG editor with token-tinted snow theme. Production features: controlled value, imperative ref API, onBlur, name+hidden-form-sync, drag-and-drop image upload with onImageUpload callback, paste sanitization (Word / GDocs cleanup), char + word counter with maxLength, autosave to localStorage, markdown shortcuts, color + highlight, sub/sup, indent/outdent, horizontal rule, tables, emoji picker, @-mentions, /-slash command menu, selection bubble menu, image resize/align overlay, fullscreen mode. Pixel-identical EJS sibling at modules/app/RichTextEditor.ejs.

## Depends on

- `modal`
- `input`
- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: textbox, toolbar, dialog, listbox
- Keyboard:
  - `Ctrl/Cmd + B` — Bold selection
  - `Ctrl/Cmd + I` — Italic selection
  - `Ctrl/Cmd + U` — Underline selection
  - `Ctrl/Cmd + Z` — Undo
  - `Ctrl/Cmd + Shift + Z` — Redo
  - `Tab / Shift+Tab` — Indent / outdent in lists
  - `@` — Open mention suggestions
  - `/` — Open slash-command menu (at line start)
  - `** ** / * * / ` `` — Markdown bold / italic / code
  - `# / ## / ###` — Markdown headings
  - `- / * / 1.` — Markdown bullet / numbered list
  - `> ` — Markdown blockquote

## Design tokens consumed

- `--surface-base`
- `--surface-sunken`
- `--surface-raised`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--error`

## Variants

### Empty + counter

```tsx
const [body, setBody] = useState('');
<RichTextEditor
  id="article-body"
  label="Article body"
  value={body}
  onChange={setBody}
  showCounter
  showWordCount
/>
```

### Pre-populated

```tsx
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
  defaultValue={savedHtml}
  readOnly
/>
```

### Max length (200 chars)

```tsx
<RichTextEditor
  id="short-summary"
  maxLength={200}
  showCounter
/>
```

### Mentions + slash commands

```tsx
<RichTextEditor
  id="comment"
  mentions={[
    { id: 'u1', label: 'Jane Doe', description: 'Designer' },
    { id: 'u2', label: 'John Smith', description: 'Engineer' },
  ]}
  slashItems={[
    { id: 'h1', label: 'Heading 1', action: (q) => q.format('header', 1, 'user') },
    { id: 'list', label: 'Bullet list', action: (q) => q.format('list', 'bullet', 'user') },
  ]}
/>
```

### Imperative ref API

```tsx
const ref = useRef<RichTextEditorHandle>(null);
<RichTextEditor ref={ref} id="reply" />
ref.current?.focus();
ref.current?.clear();
ref.current?.insertHTML('<p>Hi!</p>');
const text = ref.current?.getText();
```

### Form integration

```tsx
<form action="/api/post" method="post">
  <RichTextEditor id="post" name="body" defaultValue={savedHtml} />
  <button type="submit">Save</button>
</form>
```

### Autosave

```tsx
<RichTextEditor
  id="draft"
  autosaveKey="my-draft"
  placeholder="Survives page refresh…"
/>
```

## Full source

```tsx
import { useRef, useState } from 'react';
import { RichTextEditor, type RichTextEditorHandle } from '@/modules/app/RichTextEditor';

// Controlled with counter + maxLength:
const [body, setBody] = useState('');
<RichTextEditor
  id="article-body"
  label="Article body"
  value={body}
  onChange={setBody}
  maxLength={2000}
  showCounter
  showWordCount
/>

// Imperative handle:
const ref = useRef<RichTextEditorHandle>(null);
<RichTextEditor ref={ref} id="reply" />
ref.current?.focus();
ref.current?.insertHTML('<p>Hi!</p>');

// Form integration (hidden input synced to 'body'):
<form>
  <RichTextEditor id="post" name="body" defaultValue={savedHtml} />
  <button type="submit">Save</button>
</form>

// Image upload to CDN instead of base64:
<RichTextEditor
  id="cms"
  onImageUpload={async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    const { url } = await r.json();
    return url;
  }}
/>

// Autosave to localStorage:
<RichTextEditor id="draft" autosaveKey="my-draft" />

// Mentions + slash commands:
<RichTextEditor
  id="comment"
  mentions={[{ id: 'u1', label: 'Jane Doe', description: 'Designer' }]}
  slashItems={[{
    id: 'h1', label: 'Heading 1',
    action: (q) => q.format('header', 1, 'user'),
  }]}
/>
```
