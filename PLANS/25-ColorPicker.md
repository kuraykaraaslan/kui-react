# ColorPicker — Geliştirme Planı (EJS Pariteli)

> NextJS: [ColorPicker.tsx](../modules/ui/ColorPicker.tsx) 209. EJS: 284.

## Kuzey Yıldızı
Figma + Adobe Color + colorpicker.com seviyesi: HSL/HEX/RGBA/HWB/OKLCH paneller, EyeDropper API, palette presets, recent colors, gradient editor, WCAG contrast checker.

---

## Hedef yapı
```
modules/ui/ColorPicker/
├── index.tsx              ← named export
├── types.ts               ← ColorValue (hex/rgba/hsla/oklch)
├── color/
│   ├── convert.ts         ← format conversion (chroma.js inspired, no dep)
│   ├── contrast.ts        ← WCAG contrast ratio
│   └── parse.ts
├── parts/
│   ├── Swatch.tsx
│   ├── SaturationCanvas.tsx ← S × V 2D pad
│   ├── HueSlider.tsx
│   ├── AlphaSlider.tsx
│   ├── InputRow.tsx       ← HEX/RGBA/HSL switch
│   ├── PalettePanel.tsx   ← preset + recent colors
│   ├── ContrastBadge.tsx  ← "AA · 4.7:1 ✓"
│   ├── EyeDropper.tsx     ← native EyeDropper API
│   └── GradientEditor.tsx ← çok-stop linear/radial
└── hooks/
    ├── useColorState.ts
    ├── useEyeDropper.ts   ← `window.EyeDropper`
    └── useRecentColors.ts ← localStorage queue
```

### EJS paralel
- ColorPicker.ejs root + partials (_saturation/_hue/_alpha/_inputs/_palette).
- scripts: color-convert.js, color-state.js, eye-dropper.js, recent.js, contrast.js, gradient.js.

---

## Milestone'lar

### M1 — Format switching
- HEX (3/4/6/8 digit), RGBA, HSLA, HWB, OKLCH input.
- Click-to-cycle veya tab switcher.
- Validation + auto-clamp.
- Copy button per format.

### M2 — EyeDropper + palette
- Native `window.EyeDropper().open()` desteği (Chromium).
- Fallback: html2canvas snapshot + pixel pick.
- Preset palettes: Material, Tailwind, custom (`palettes` prop).
- Recent colors (localStorage, son 12).

### M3 — Gradient editor
- Linear / radial gradient.
- Drag-to-add stop.
- Stop konum + renk düzenle.
- Output: `linear-gradient(...)` CSS string.

### M4 — Contrast + a11y check
- Foreground/background combo girişi.
- WCAG ratio + AA/AAA badge.
- "Suggest accessible variant" — closest legal contrast.

### M5 — A11y + i18n
- Screen reader: "Red 245, Green 100, Blue 50, alpha 0.8".
- Klavye: arrow keys saturation canvas'ta, Home/End hue, shift+arrow büyük adım.
- `messages` prop.
- Reduced motion.

---

## Public API
```ts
type ColorPickerProps = {
  value: ColorValue;
  onChange: (v: ColorValue) => void;
  format?: 'hex' | 'rgba' | 'hsla' | 'hwb' | 'oklch';
  showAlpha?: boolean;
  palettes?: { name: string; colors: string[] }[];
  showEyeDropper?: boolean;
  showGradient?: boolean | { mode: 'linear' | 'radial' };
  contrastAgainst?: string;
  messages?: Partial<ColorPickerMessages>;
};
```

## Perf
- Core ≤ 10 kB.
- Gradient editor lazy +4 kB.

## DoD
- [ ] NextJS + EJS paralel.
- [ ] axe-core 0 violations.
- [ ] EyeDropper fallback Chromium/Safari/FF'te denendi.
- [ ] Showcase: format-switch / palette / eyedropper / gradient / contrast variant'ları.
