import { describe, it, expect } from 'vitest';
import { encodePropsState, decodePropsState } from './propsEditorState';
import type { ControlDef } from '../data/showcase.types';

const controls: ControlDef[] = [
  { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary'], default: 'primary' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
  { key: 'label', label: 'Label', type: 'text', default: 'Click me' },
  { key: 'size', label: 'Size', type: 'number', min: 1, max: 10, step: 1, default: 4 },
];

const defaults = { variant: 'primary', disabled: false, label: 'Click me', size: 4 };

describe('propsEditorState', () => {
  it('encodes nothing when every value is still its default', () => {
    expect(encodePropsState(controls, defaults)).toBeNull();
  });

  it('round-trips changed values, including non-ASCII text', () => {
    const values = { ...defaults, variant: 'secondary', label: 'Gönder 🚀', size: 7 };
    const encoded = encodePropsState(controls, values);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/); // URL-safe: no +, /, =
    expect(decodePropsState(controls, encoded)).toEqual(values);
  });

  it('only encodes the values that differ from defaults', () => {
    const encoded = encodePropsState(controls, { ...defaults, disabled: true })!;
    expect(JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')))).toEqual({ disabled: true });
  });

  it('returns null for missing, malformed, or non-object input', () => {
    expect(decodePropsState(controls, null)).toBeNull();
    expect(decodePropsState(controls, '')).toBeNull();
    expect(decodePropsState(controls, '!!!not-base64!!!')).toBeNull();
    expect(decodePropsState(controls, btoa('not json'))).toBeNull();
    expect(decodePropsState(controls, btoa('[1,2,3]'))).toBeNull();
    expect(decodePropsState(controls, btoa('"a string"'))).toBeNull();
  });

  it('drops unknown keys', () => {
    const encoded = btoa(JSON.stringify({ evil: 'x', disabled: true }));
    expect(decodePropsState(controls, encoded)).toEqual({ ...defaults, disabled: true });
  });

  it('rejects a select value that is not a listed option, keeping the default', () => {
    const encoded = btoa(JSON.stringify({ variant: 'danger', disabled: true }));
    expect(decodePropsState(controls, encoded)).toEqual({ ...defaults, disabled: true });
  });

  it('rejects wrongly-typed values', () => {
    const encoded = btoa(JSON.stringify({ disabled: 'yes', label: 42, size: '9' }));
    expect(decodePropsState(controls, encoded)).toBeNull();
  });

  it('clamps numbers to the control min/max and rejects non-finite ones', () => {
    expect(decodePropsState(controls, btoa(JSON.stringify({ size: 999 })))).toEqual({ ...defaults, size: 10 });
    expect(decodePropsState(controls, btoa(JSON.stringify({ size: -5 })))).toEqual({ ...defaults, size: 1 });
    expect(decodePropsState(controls, btoa('{"size":1e999}'))).toBeNull();
  });

  it('does not treat inherited Object properties as keys', () => {
    const encoded = btoa('{"__proto__":{"disabled":true}}');
    expect(decodePropsState(controls, encoded)).toBeNull();
  });
});
