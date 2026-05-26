'use client';
// modules/ui/ColorPicker.tsx
//
// Thin re-export shim — the real implementation now lives in the
// directory-style module `./ColorPicker/`. Existing imports such as
//   import { ColorPicker } from '@/modules/ui/ColorPicker';
// continue to resolve through this barrel.
//
// See PLANS/25-ColorPicker.md for the milestone roadmap.

export { ColorPicker, DEFAULT_COLOR_SWATCHES } from './ColorPicker/index';
export type { ColorPickerProps, ColorFormat, ColorValue } from './ColorPicker/index';
