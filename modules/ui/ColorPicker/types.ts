// modules/ui/ColorPicker/types.ts
//
// Type definitions shared across the ColorPicker suite.

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/** Supported color string formats for the format-switcher (M1). */
export type ColorFormat = 'hex' | 'rgba' | 'hsla' | 'hwb' | 'oklch';

/** Internal canonical color representation (RGBA in 0..255 + alpha 0..1). */
export type RGBA = {
  r: number; // 0..255
  g: number; // 0..255
  b: number; // 0..255
  a: number; // 0..1
};

/** HSLA representation. */
export type HSLA = {
  h: number; // 0..360
  s: number; // 0..100
  l: number; // 0..100
  a: number; // 0..1
};

/** HWB representation. */
export type HWB = {
  h: number; // 0..360
  w: number; // 0..100 (white)
  b: number; // 0..100 (black)
  a: number; // 0..1
};

/** OKLCH representation. */
export type OKLCH = {
  l: number; // 0..1 (lightness)
  c: number; // 0..~0.4 (chroma)
  h: number; // 0..360 (hue)
  a: number; // 0..1 (alpha)
};

/**
 * Stable color value passed in/out of the picker. The string form keeps the
 * existing top-level <ColorPicker> API (hex string) backwards compatible while
 * also allowing rgba()/hsla()/hwb()/oklch() formatted strings.
 */
export type ColorValue = string | null;

// TODO M2: extend ColorValue with `{ value: string; format: ColorFormat }` so
//          consumers can know which format the picker emitted.

/** Optional localized message overrides (M5 stub). */
export type ColorPickerMessages = {
  pickAColor: string;
  noColor: string;
  hexColor: string;
  nativeColorPicker: string;
  copy: string;
  copied: string;
};

/** Public props for <ColorPicker>. Backwards compatible with the original
 *  flat-file component; new fields are additive. */
export type ColorPickerProps = {
  id?: string;
  label?: string;
  value?: ColorValue;
  onChange: (color: ColorValue) => void;
  swatches?: string[];
  showHexInput?: boolean;
  showNativePicker?: boolean;
  showNoColor?: boolean;
  align?: 'left' | 'right';
  triggerLabel?: string;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
  /** Compact toolbar mode (used by RichTextEditor). */
  iconOnly?: boolean;
  /** FontAwesome icon shown inside the trigger (only used with iconOnly). */
  icon?: IconDefinition;

  // --- M1 additions ---------------------------------------------------------
  /** Show the HEX/RGBA/HSLA/HWB/OKLCH format-switcher tab row + copy button. */
  showFormatSwitcher?: boolean;
  /** Default format selected when the picker first opens. */
  defaultFormat?: ColorFormat;

  // TODO M2: palettes?: { name: string; colors: string[] }[];
  // TODO M2: showEyeDropper?: boolean;
  // TODO M3: showGradient?: boolean | { mode: 'linear' | 'radial' };
  // TODO M4: contrastAgainst?: string;
  // TODO M5: messages?: Partial<ColorPickerMessages>;
};
