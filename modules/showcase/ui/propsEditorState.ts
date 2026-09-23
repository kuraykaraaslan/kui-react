import type { ControlDef } from '../data/showcase.types';

export const PROPS_PARAM = 'p';

type Values = Record<string, unknown>;

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

/** Only values that differ from their control's default are encoded, so an untouched editor produces no param at all. */
export function encodePropsState(controls: ControlDef[], values: Values): string | null {
  const diff: Values = {};
  for (const c of controls) {
    if (values[c.key] !== c.default) diff[c.key] = values[c.key];
  }
  return Object.keys(diff).length === 0 ? null : toBase64Url(JSON.stringify(diff));
}

function coerce(control: ControlDef, raw: unknown): unknown {
  switch (control.type) {
    case 'select':
      return typeof raw === 'string' && control.options.includes(raw) ? raw : undefined;
    case 'boolean':
      return typeof raw === 'boolean' ? raw : undefined;
    case 'text':
      return typeof raw === 'string' ? raw : undefined;
    case 'number': {
      if (typeof raw !== 'number' || !Number.isFinite(raw)) return undefined;
      const min = control.min ?? 0;
      const max = control.max ?? 100;
      return Math.min(max, Math.max(min, raw));
    }
  }
}

/**
 * URL input is untrusted: unknown keys are dropped and every value is
 * validated against its control (select values must be a listed option,
 * numbers are clamped to min/max), so a hand-edited or stale link can't
 * push an impossible value into a component's props.
 */
export function decodePropsState(controls: ControlDef[], encoded: string | null): Values | null {
  if (!encoded) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(fromBase64Url(encoded));
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

  const values: Values = Object.fromEntries(controls.map((c) => [c.key, c.default]));
  let changed = false;
  for (const c of controls) {
    if (!Object.hasOwn(parsed, c.key)) continue;
    const v = coerce(c, (parsed as Values)[c.key]);
    if (v !== undefined) {
      values[c.key] = v;
      changed = true;
    }
  }
  return changed ? values : null;
}
