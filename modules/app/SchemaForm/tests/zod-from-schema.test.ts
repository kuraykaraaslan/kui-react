import { describe, it, expect } from 'vitest';
import { zodFromSchema } from '../zod-from-schema';
import { shouldShow, type FieldSchema } from '../types';

const schema: Record<string, FieldSchema> = {
  title: { label: 'Title', type: 'text' },
  count: { label: 'Count', type: 'number', min: 1, max: 10 },
  showIcon: { label: 'Show icon', type: 'boolean' },
  mode: { label: 'Mode', type: 'select', options: ['compact', 'full'] },
  icon: { label: 'Icon', type: 'icon', showIf: { showIcon: true } },
};

describe('zodFromSchema', () => {
  it('accepts a well-formed settings object', () => {
    expect(zodFromSchema(schema).safeParse({ title: 'Sales', count: 5, mode: 'compact' }).success).toBe(true);
  });

  it('enforces the numeric bounds the field declares', () => {
    expect(zodFromSchema(schema).safeParse({ count: 0 }).success).toBe(false);
    expect(zodFromSchema(schema).safeParse({ count: 11 }).success).toBe(false);
  });

  it('confines a select to its options', () => {
    expect(zodFromSchema(schema).safeParse({ mode: 'weird' }).success).toBe(false);
  });

  it('strips unknown keys instead of failing', () => {
    // A widget whose schema lost a field must not make every board carrying it
    // unsaveable — the stale key is dropped, the rest is kept.
    expect(zodFromSchema(schema).parse({ title: 'Sales', legacyColour: 'red' })).toEqual({ title: 'Sales' });
  });

  it('treats every field as optional — a widget may be unconfigured', () => {
    expect(zodFromSchema(schema).safeParse({}).success).toBe(true);
  });
});

describe('shouldShow', () => {
  it('hides a field whose condition does not hold', () => {
    expect(shouldShow(schema.icon, { showIcon: false })).toBe(false);
    expect(shouldShow(schema.icon, { showIcon: true })).toBe(true);
    expect(shouldShow(schema.title, {})).toBe(true);
  });

  it('accepts an array condition as "one of"', () => {
    const field: FieldSchema = { label: 'x', type: 'text', showIf: { mode: ['compact', 'full'] } };
    expect(shouldShow(field, { mode: 'full' })).toBe(true);
    expect(shouldShow(field, { mode: 'other' })).toBe(false);
  });
});
