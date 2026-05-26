// modules/ui/ColorPicker/color/parse.ts
//
// String → RGBA parser. Supports HEX, rgb()/rgba(), hsl()/hsla(),
// hwb() and oklch() in their modern CSS Color 4 syntax. Used by the
// InputRow's per-format validation + auto-clamp logic (M1).

import {
  clamp,
  hexToRgba,
  hslaToRgba,
  hwbToRgba,
  oklchToRgba,
} from './convert';
import type { HSLA, HWB, OKLCH, RGBA } from '../types';

const NUM = '(-?\\d*\\.?\\d+)';
const PERCENT = '(-?\\d*\\.?\\d+)\\s*%?';
const ALPHA = '(?:[,/]\\s*(-?\\d*\\.?\\d+)\\s*%?)?';

/** Convert "0.5" or "50%" → 0..1 with clamping. */
function parseAlphaToken(raw: string | undefined): number {
  if (raw == null) return 1;
  const s = raw.trim();
  if (s.endsWith('%')) return clamp(parseFloat(s) / 100, 0, 1);
  // legacy comma form often passes through without %; treat large >1 as %
  const v = parseFloat(s);
  if (v > 1 && v <= 100) return clamp(v / 100, 0, 1);
  return clamp(v, 0, 1);
}

function parseRgbString(input: string): RGBA | null {
  // rgb( r g b [/ a]) or rgb(r, g, b[, a])
  const m = input.match(
    new RegExp(
      '^rgba?\\(\\s*' + PERCENT + '[\\s,]+' + PERCENT + '[\\s,]+' + PERCENT + '\\s*' + ALPHA + '\\s*\\)$',
      'i'
    )
  );
  if (!m) return null;
  const toByte = (raw: string) =>
    raw.endsWith('%') ? clamp((parseFloat(raw) / 100) * 255, 0, 255) : clamp(parseFloat(raw), 0, 255);
  // Reconstruct raw % suffix for each channel by re-scanning groups.
  const groups = Array.from(input.matchAll(/(-?\d*\.?\d+\s*%?)/g)).map((g) => g[1]);
  if (groups.length < 3) return null;
  return {
    r: toByte(groups[0]),
    g: toByte(groups[1]),
    b: toByte(groups[2]),
    a: parseAlphaToken(m[4]),
  };
}

function parseHslString(input: string): RGBA | null {
  const m = input.match(
    new RegExp(
      '^hsla?\\(\\s*' + NUM + '(?:deg)?[\\s,]+' + PERCENT + '[\\s,]+' + PERCENT + '\\s*' + ALPHA + '\\s*\\)$',
      'i'
    )
  );
  if (!m) return null;
  const hsla: HSLA = {
    h: parseFloat(m[1]),
    s: clamp(parseFloat(m[2]), 0, 100),
    l: clamp(parseFloat(m[3]), 0, 100),
    a: parseAlphaToken(m[4]),
  };
  return hslaToRgba(hsla);
}

function parseHwbString(input: string): RGBA | null {
  const m = input.match(
    new RegExp(
      '^hwb\\(\\s*' + NUM + '(?:deg)?\\s+' + PERCENT + '\\s+' + PERCENT + '\\s*' + ALPHA + '\\s*\\)$',
      'i'
    )
  );
  if (!m) return null;
  const hwb: HWB = {
    h: parseFloat(m[1]),
    w: clamp(parseFloat(m[2]), 0, 100),
    b: clamp(parseFloat(m[3]), 0, 100),
    a: parseAlphaToken(m[4]),
  };
  return hwbToRgba(hwb);
}

function parseOklchString(input: string): RGBA | null {
  const m = input.match(
    new RegExp(
      '^oklch\\(\\s*' + PERCENT + '\\s+' + NUM + '\\s+' + NUM + '(?:deg)?\\s*' + ALPHA + '\\s*\\)$',
      'i'
    )
  );
  if (!m) return null;
  const lRaw = m[1];
  const L = lRaw.endsWith('%') ? clamp(parseFloat(lRaw) / 100, 0, 1) : clamp(parseFloat(lRaw), 0, 1);
  const oklch: OKLCH = {
    l: L,
    c: clamp(parseFloat(m[2]), 0, 0.5),
    h: parseFloat(m[3]),
    a: parseAlphaToken(m[4]),
  };
  return oklchToRgba(oklch);
}

/**
 * Best-effort parse: tries every supported format. Returns null on failure.
 */
export function parseColor(input: string): RGBA | null {
  if (!input) return null;
  const s = input.trim();
  if (!s) return null;

  if (s[0] === '#' || /^[0-9a-fA-F]{3,8}$/.test(s)) {
    const hex = hexToRgba(s);
    if (hex) return hex;
  }
  if (/^rgba?\(/i.test(s)) return parseRgbString(s);
  if (/^hsla?\(/i.test(s)) return parseHslString(s);
  if (/^hwb\(/i.test(s)) return parseHwbString(s);
  if (/^oklch\(/i.test(s)) return parseOklchString(s);
  return null;
}
