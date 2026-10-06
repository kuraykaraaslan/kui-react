'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';

export const MINI_W = 180;
export const MINI_H = 120;
/** above this many blocks the mini map shows by itself */
export const MINI_MANY = 30;
export const MINI_KEY = 'kui-ruleset-minimap';
const MINI_PAD = 40;

export type MiniPref = boolean | null;
export type MiniBox = { x: number; y: number; w: number; h: number };
export type MiniMapping = { x0: number; y0: number; s: number; ox: number; oy: number };

const listeners = new Set<() => void>();
/** the stored words: 'on', 'off' or nothing (automatic) */
let memory: string | null = null;

function readStored(): string | null {
  try { return window.localStorage.getItem(MINI_KEY); } catch { return memory; }
}

/** the saved choice: true (on), false (off) or null (automatic) */
export function readMiniPref(): MiniPref {
  const v = readStored();
  return v === 'on' ? true : v === 'off' ? false : null;
}

export function writeMiniPref(on: boolean) {
  memory = on ? 'on' : 'off';
  try { window.localStorage.setItem(MINI_KEY, memory); } catch { /* storage may be blocked: the choice lasts until reload */ }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => { listeners.delete(cb); window.removeEventListener('storage', cb); };
}

/**
 * Does the mini map show? The button decides when it was used; else it shows for a big flow (more than 30
 * blocks) or when blocks leave the view. `size` is the canvas in pixels; an unmeasured canvas never counts
 * as "blocks left the view".
 */
export function miniVisible(pref: MiniPref, boxes: MiniBox[], view: { x: number; y: number; k: number }, size: { w: number; h: number }): boolean {
  if (!boxes.length) return false;
  if (pref !== null) return pref;
  if (boxes.length > MINI_MANY) return true;
  if (size.w <= 0 || size.h <= 0) return false;
  return boxes.some((b) => b.x * view.k + view.x < 0 || b.y * view.k + view.y < 0
    || (b.x + b.w) * view.k + view.x > size.w || (b.y + b.h) * view.k + view.y > size.h);
}

/** how the world maps onto the 180 x 120 map: all blocks with a margin, centred, one scale */
export function miniMapping(boxes: MiniBox[]): MiniMapping | null {
  if (!boxes.length) return null;
  const x0 = Math.min(...boxes.map((b) => b.x)) - MINI_PAD, y0 = Math.min(...boxes.map((b) => b.y)) - MINI_PAD;
  const x1 = Math.max(...boxes.map((b) => b.x + b.w)) + MINI_PAD, y1 = Math.max(...boxes.map((b) => b.y + b.h)) + MINI_PAD;
  const s = Math.min(MINI_W / (x1 - x0), MINI_H / (y1 - y0));
  return { x0, y0, s, ox: (MINI_W - (x1 - x0) * s) / 2, oy: (MINI_H - (y1 - y0) * s) / 2 };
}

/** the visible part of the canvas as a rectangle on the map */
export function miniViewport(m: MiniMapping, view: { x: number; y: number; k: number }, size: { w: number; h: number }) {
  return {
    x: m.ox + (-view.x / view.k - m.x0) * m.s,
    y: m.oy + (-view.y / view.k - m.y0) * m.s,
    w: (size.w / view.k) * m.s,
    h: (size.h / view.k) * m.s,
  };
}

/** a point of the map (pixels inside it) as a world point */
export function miniToWorld(m: MiniMapping, x: number, y: number) {
  return { x: (x - m.ox) / m.s + m.x0, y: (y - m.oy) / m.s + m.y0 };
}

/**
 * The mini map: whether it shows, how the world maps onto it, and the toggle that is kept in localStorage.
 * `containerRef` is the canvas, measured for the "blocks left the view" rule.
 */
export function useMiniMap({ containerRef, boxes, view }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  boxes: MiniBox[];
  view: { x: number; y: number; k: number };
}) {
  /* the choice lives in localStorage; the server render and the first client render are "automatic" */
  const stored = useSyncExternalStore(subscribe, readStored, () => null);
  const pref: MiniPref = stored === 'on' ? true : stored === 'off' ? false : null;
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); setSize((s) => (s.w === r.width && s.h === r.height ? s : { w: r.width, h: r.height })); };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const visible = miniVisible(pref, boxes, view, size);
  const mapping = visible ? miniMapping(boxes) : null;

  function toggle() {
    writeMiniPref(!visible);
  }

  return { visible, mapping, size, toggle };
}
