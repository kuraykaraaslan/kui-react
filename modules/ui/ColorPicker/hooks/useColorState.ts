// modules/ui/ColorPicker/hooks/useColorState.ts
//
// Single-source-of-truth color state: parses incoming string → RGBA, exposes
// formatters for the active format, and emits onChange with a re-formatted
// string when the user mutates any field.

import { useCallback, useMemo, useState } from 'react';
import {
  formatHex,
  formatHsla,
  formatHwb,
  formatOklch,
  formatRgba,
} from '../color/convert';
import { parseColor } from '../color/parse';
import type { ColorFormat, RGBA } from '../types';

const BLACK: RGBA = { r: 0, g: 0, b: 0, a: 1 };

export function formatRgbaAs(c: RGBA, format: ColorFormat): string {
  switch (format) {
    case 'hex':   return formatHex(c);
    case 'rgba':  return formatRgba(c);
    case 'hsla':  return formatHsla(c);
    case 'hwb':   return formatHwb(c);
    case 'oklch': return formatOklch(c);
  }
}

type Args = {
  /** Initial string value (any supported format). Null/empty → no color. */
  value: string | null | undefined;
  /** Active output format. */
  format: ColorFormat;
};

export function useColorState({ value, format }: Args) {
  const initialRgba = useMemo(() => {
    if (!value) return BLACK;
    return parseColor(value) ?? BLACK;
  }, [value]);

  const [rgba, setRgba] = useState<RGBA>(initialRgba);

  // When the controlled `value` prop changes externally, sync.
  const syncFromString = useCallback((next: string | null | undefined) => {
    if (!next) {
      setRgba(BLACK);
      return;
    }
    const parsed = parseColor(next);
    if (parsed) setRgba(parsed);
  }, []);

  const formatted = useMemo(() => formatRgbaAs(rgba, format), [rgba, format]);

  return {
    rgba,
    setRgba,
    syncFromString,
    formatted,
  };
}

// TODO M2: extract eyedropper state hook (useEyeDropper).
// TODO M2: extract recent-colors hook (useRecentColors backed by localStorage).
