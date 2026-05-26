# ColorPicker

- **id:** `color-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ColorPicker.tsx`
- **status:** stable
- **since:** 2026-05

Color selection control with a 32-swatch preset palette plus optional hex input and native browser color picker for unlimited colors. Pixel-identical EJS sibling at modules/ui/ColorPicker.ejs. Used by RichTextEditor for text + highlight colors.

## Depends on

- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: button, dialog
- Keyboard:
  - `Enter / Space` — Open / close the picker
  - `Tab` — Move between swatches
  - `Enter (in hex)` — Commit hex value
  - `Escape` — Close picker

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-focus`

## Variants

### Default

```tsx
const [c, setC] = useState<string | null>('#3b82f6');
<ColorPicker label="Brand color" value={c} onChange={setC} showNoColor />
```

### Compact (swatches only)

```tsx
<ColorPicker
  value={c}
  onChange={setC}
  showHexInput={false}
  showNativePicker={false}
/>
```

### Hex + native picker only (no swatches)

```tsx
<ColorPicker
  label="Background"
  value={c}
  onChange={setC}
  swatches={[]}
  showHexInput
  showNativePicker
  showNoColor
/>
```

## Full source

```tsx
'use client';
import { ColorPicker } from '@/modules/ui/ColorPicker';

const [color, setColor] = useState<string | null>('#3b82f6');

<ColorPicker
  label="Brand color"
  value={color}
  onChange={setColor}
  showNoColor
/>

// Compact (swatches only):
<ColorPicker
  value={color}
  onChange={setColor}
  showHexInput={false}
  showNativePicker={false}
/>

// Custom palette + hex / native only:
<ColorPicker
  value={color}
  onChange={setColor}
  swatches={['#ff0000', '#00ff00', '#0000ff']}
  showHexInput
  showNativePicker
/>
```
