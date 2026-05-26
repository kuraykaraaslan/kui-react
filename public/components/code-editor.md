# CodeEditor

- **id:** `code-editor`
- **layer:** ui
- **category:** App
- **filePath:** `modules/ui/CodeEditor/index.tsx`
- **status:** stable
- **since:** 2026-05

Engine-agnostic code editor primitive. M1 ships a lightweight CodeMirror-style fallback engine (textarea + line-number gutter + active-line + theme + readonly + placeholder) so the public API is stable today. Future milestones: Monaco (VSCode) lazy engine, find/replace, multi-cursor, diagnostics (markers), custom autocomplete + hover, minimap, code folding, vim/emacs keymap. Pixel-identical EJS sibling at modules/ui/CodeEditor/CodeEditor.ejs. Used by RulesetEditor M3 + RichTextEditor code-block insert (planned).

## Accessibility

- WCAG: AA
- ARIA patterns: textbox
- Keyboard:
  - `Tab` — Move focus into / out of the editor
  - `Arrow keys` — Move caret + sync active line gutter
  - `Ctrl/Cmd + Z` — Browser-native undo (M1 textarea fallback)

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-strong`
- `--border-focus`
- `--error`

## Variants

### JavaScript readonly

```tsx
<CodeEditor
  id="example"
  label="example.js"
  language="js"
  theme="light"
  value={source}
  readonly
  showLineNumbers
/>
```

### Markdown editable

```tsx
const [src, setSrc] = useState('# Hello');
<CodeEditor
  id="readme"
  name="readme"
  label="README.md"
  language="markdown"
  theme="dark"
  value={src}
  onChange={setSrc}
  placeholder="Start typing markdown…"
/>
```

## Full source

```tsx
import { CodeEditor } from '@/modules/ui/CodeEditor';

// Read-only snippet:
<CodeEditor
  id="example"
  language="js"
  theme="light"
  value={source}
  readonly
/>

// Editable markdown (controlled):
const [src, setSrc] = useState('');
<CodeEditor
  id="readme"
  name="readme"
  label="README.md"
  language="markdown"
  theme="dark"
  value={src}
  onChange={setSrc}
  placeholder="Start typing markdown…"
/>

// Opt-in Monaco engine (lazy — M2):
<CodeEditor engine="monaco" language="ts" value={code} onChange={setCode} />
```
