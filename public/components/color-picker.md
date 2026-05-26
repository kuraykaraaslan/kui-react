# ColorPicker

- **id:** `color-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ColorPicker/index.tsx`
- **status:** stable
- **since:** 2026-05

Color selection control with a 32-swatch preset palette plus optional hex input and native browser color picker for unlimited colors. M1 adds a HEX / RGBA / HSLA / HWB / OKLCH format-switcher with per-format input + copy. Pixel-identical EJS sibling at modules/ui/ColorPicker/ColorPicker.ejs. Used by RichTextEditor for text + highlight colors.

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

### Format switcher — HEX / RGBA / HSLA / HWB / OKLCH (M1)

```tsx
<ColorPicker
  label="Theme color"
  value={c}
  onChange={setC}
  showFormatSwitcher
  defaultFormat="hex"
  showHexInput={false}
  showNativePicker
/>

// onChange receives the value formatted in the active format:
//   '#3b82f6'                              (HEX)
//   'rgb(59, 130, 246)'                    (RGBA)
//   'hsl(217.2, 91.2%, 59.8%)'             (HSLA)
//   'hwb(217.2 23.1% 3.5%)'                (HWB)
//   'oklch(0.6228 0.1808 257.84)'          (OKLCH)
//
// Each tab has its own validated text input + a Copy button (faCopy → faCheck).
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

// M1 — HEX / RGBA / HSLA / HWB / OKLCH format-switcher:
<ColorPicker
  label="Theme color"
  value={color}
  onChange={setColor}
  showFormatSwitcher
  defaultFormat="hex"
  showHexInput={false}
  showNativePicker
/>
```
