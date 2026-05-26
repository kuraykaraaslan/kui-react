// modules/ui/ColorPicker/color/convert.ts
//
// Zero-dependency color conversions for M1.
//
// Supported pairs:
//   HEX  <-> RGBA  (3/4/6/8 digit)
//   RGBA <-> HSLA
//   RGBA <-> HWB
//   RGBA <-> OKLCH  (via linear sRGB ↔ OkLab matrices, Björn Ottosson)
//
// Conversions are deliberately compact — no chroma.js / culori dependency.
// All accepted alpha values are 0..1; H is 0..360; S/L/W/B are 0..100; L (ok)
// is 0..1 and C is 0..~0.4.

import type { HSLA, HWB, OKLCH, RGBA } from '../types';

// ─── Generic helpers ────────────────────────────────────────────────────────

export function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}

export function round(n: number, digits = 0): number {
  const m = Math.pow(10, digits);
  return Math.round(n * m) / m;
}

// ─── HEX ↔ RGBA ─────────────────────────────────────────────────────────────

/** Parse a HEX string of length 3/4/6/8 (with or without #) into RGBA. */
export function hexToRgba(input: string): RGBA | null {
  if (!input) return null;
  let s = input.trim();
  if (!s) return null;
  if (s[0] !== '#') s = '#' + s;

  // #RGB → #RRGGBB
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  }
  // #RGBA → #RRGGBBAA
  else if (/^#[0-9a-fA-F]{4}$/.test(s)) {
    s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3] + s[4] + s[4];
  }

  if (/^#[0-9a-fA-F]{6}$/.test(s)) {
    return {
      r: parseInt(s.slice(1, 3), 16),
      g: parseInt(s.slice(3, 5), 16),
      b: parseInt(s.slice(5, 7), 16),
      a: 1,
    };
  }
  if (/^#[0-9a-fA-F]{8}$/.test(s)) {
    return {
      r: parseInt(s.slice(1, 3), 16),
      g: parseInt(s.slice(3, 5), 16),
      b: parseInt(s.slice(5, 7), 16),
      a: parseInt(s.slice(7, 9), 16) / 255,
    };
  }
  return null;
}

function toHex2(n: number): string {
  const v = clamp(Math.round(n), 0, 255).toString(16);
  return v.length === 1 ? '0' + v : v;
}

/** Format RGBA as #RRGGBB (alpha === 1) or #RRGGBBAA (alpha < 1). */
export function rgbaToHex(c: RGBA): string {
  const r = toHex2(c.r);
  const g = toHex2(c.g);
  const b = toHex2(c.b);
  if (c.a >= 1) return ('#' + r + g + b).toLowerCase();
  const a = toHex2(c.a * 255);
  return ('#' + r + g + b + a).toLowerCase();
}

// ─── RGBA ↔ HSLA ────────────────────────────────────────────────────────────

export function rgbaToHsla(c: RGBA): HSLA {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100, a: c.a };
}

export function hslaToRgba(c: HSLA): RGBA {
  const h = ((c.h % 360) + 360) % 360;
  const s = clamp(c.s, 0, 100) / 100;
  const l = clamp(c.l, 0, 100) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const aSL = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - aSL * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
    a: clamp(c.a, 0, 1),
  };
}

// ─── RGBA ↔ HWB ─────────────────────────────────────────────────────────────

export function rgbaToHwb(c: RGBA): HWB {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, w: min * 100, b: (1 - max) * 100, a: c.a };
}

export function hwbToRgba(c: HWB): RGBA {
  let w = clamp(c.w, 0, 100) / 100;
  let bk = clamp(c.b, 0, 100) / 100;
  if (w + bk >= 1) {
    const gray = w / (w + bk);
    const v = Math.round(gray * 255);
    return { r: v, g: v, b: v, a: clamp(c.a, 0, 1) };
  }
  // Convert HWB to RGB via HSV (HWB → HSV: V = 1 - black, S = 1 - white/V).
  const v = 1 - bk;
  const s = v === 0 ? 0 : 1 - w / v;
  return hsvToRgba({ h: c.h, s: s * 100, v: v * 100, a: c.a });
}

type HSVA = { h: number; s: number; v: number; a: number };
function hsvToRgba(c: HSVA): RGBA {
  const h = ((c.h % 360) + 360) % 360 / 60;
  const s = clamp(c.s, 0, 100) / 100;
  const v = clamp(c.v, 0, 100) / 100;
  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: clamp(c.a, 0, 1),
  };
}

// ─── RGBA ↔ OKLCH (via OkLab + linear sRGB) ────────────────────────────────
//
// Matrices from Björn Ottosson's OkLab paper.
// https://bottosson.github.io/posts/oklab/

function srgbToLinear(v: number): number {
  const x = v / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function linearToSrgb(v: number): number {
  const x = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return clamp(x * 255, 0, 255);
}

export function rgbaToOklch(c: RGBA): OKLCH {
  const r = srgbToLinear(c.r);
  const g = srgbToLinear(c.g);
  const b = srgbToLinear(c.b);

  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const chroma = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { l: L, c: chroma, h, a: c.a };
}

export function oklchToRgba(c: OKLCH): RGBA {
  const L = c.l;
  const hRad = (c.h * Math.PI) / 180;
  const A = c.c * Math.cos(hRad);
  const B = c.c * Math.sin(hRad);

  const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
  const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
  const s_ = L - 0.0894841775 * A - 1.2914855480 * B;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  const r =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const b = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;

  return {
    r: Math.round(linearToSrgb(r)),
    g: Math.round(linearToSrgb(g)),
    b: Math.round(linearToSrgb(b)),
    a: clamp(c.a, 0, 1),
  };
}

// ─── String formatters ─────────────────────────────────────────────────────

export function formatHex(c: RGBA): string {
  return rgbaToHex(c);
}

export function formatRgba(c: RGBA): string {
  const r = clamp(Math.round(c.r), 0, 255);
  const g = clamp(Math.round(c.g), 0, 255);
  const b = clamp(Math.round(c.b), 0, 255);
  const a = clamp(c.a, 0, 1);
  return a >= 1
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${round(a, 3)})`;
}

export function formatHsla(c: RGBA): string {
  const h = rgbaToHsla(c);
  const hue = round(h.h, 1);
  const s = round(h.s, 1);
  const l = round(h.l, 1);
  const a = clamp(h.a, 0, 1);
  return a >= 1
    ? `hsl(${hue}, ${s}%, ${l}%)`
    : `hsla(${hue}, ${s}%, ${l}%, ${round(a, 3)})`;
}

export function formatHwb(c: RGBA): string {
  const w = rgbaToHwb(c);
  const hue = round(w.h, 1);
  const wh = round(w.w, 1);
  const bk = round(w.b, 1);
  const a = clamp(w.a, 0, 1);
  return a >= 1
    ? `hwb(${hue} ${wh}% ${bk}%)`
    : `hwb(${hue} ${wh}% ${bk}% / ${round(a, 3)})`;
}

export function formatOklch(c: RGBA): string {
  const o = rgbaToOklch(c);
  const L = round(o.l, 4);
  const ch = round(o.c, 4);
  const hue = round(o.h, 2);
  const a = clamp(o.a, 0, 1);
  return a >= 1
    ? `oklch(${L} ${ch} ${hue})`
    : `oklch(${L} ${ch} ${hue} / ${round(a, 3)})`;
}
