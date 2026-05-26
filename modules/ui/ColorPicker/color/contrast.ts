// modules/ui/ColorPicker/color/contrast.ts
//
// WCAG contrast helpers. M1 ships only `relativeLuminance` + `contrastRatio`
// stubs so M4 (ContrastBadge) has a place to plug in.
//
// TODO M4: expose AA/AAA classifier + "suggest accessible variant" helper.

import type { RGBA } from '../types';

function chan(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(c: RGBA): number {
  return 0.2126 * chan(c.r) + 0.7152 * chan(c.g) + 0.0722 * chan(c.b);
}

export function contrastRatio(a: RGBA, b: RGBA): number {
  const lA = relativeLuminance(a);
  const lB = relativeLuminance(b);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}
