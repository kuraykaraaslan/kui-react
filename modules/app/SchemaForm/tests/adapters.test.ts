import { describe, it, expect } from 'vitest';
import { fromJsonSchema } from '../adapters/fromJsonSchema';
import { fromFormBuilder } from '../adapters/fromFormBuilder';
import { zodFromSchema } from '../zod-from-schema';

describe('fromJsonSchema', () => {
  const input = {
    type: 'object',
    required: ['host', 'mode'],
    properties: {
      host: { type: 'string', description: 'Broker host', default: 'localhost' },
      homepage: { type: 'string', format: 'uri' },
      mode: { type: 'string', enum: ['fast', 'slow'], title: 'Run mode' },
      retries: { type: 'integer', minimum: 0, maximum: 5 },
      gain: { type: 'number', multipleOf: 0.5 },
      enabled: { type: 'boolean' },
      when: { type: 'string', format: 'date-time' },
      channels: { type: 'array', items: { type: 'string', enum: ['a', 'b'] } },
      rows: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' } } } },
      blob: { type: 'object', properties: { x: { type: 'string' } } },
      mixed: { enum: [1, 2] },
    },
  };
  const out = fromJsonSchema(input);

  it('maps scalar types, constraints and metadata', () => {
    expect(out.host).toEqual({ label: 'Host', type: 'text', description: 'Broker host', required: true, value: 'localhost' });
    expect(out.homepage.type).toBe('url');
    expect(out.mode).toEqual({ label: 'Run mode', type: 'select', required: true, options: ['fast', 'slow'] });
    expect(out.retries).toMatchObject({ type: 'number', min: 0, max: 5, step: 1 });
    expect(out.gain.step).toBe(0.5);
    expect(out.enabled.type).toBe('boolean');
    expect(out.when.type).toBe('datetime');
  });

  it('maps arrays and falls back to json for the unsupported', () => {
    expect(out.channels).toMatchObject({ type: 'multi-select', options: ['a', 'b'] });
    expect(out.rows.type).toBe('repeater');
    expect(out.rows.fields?.id.type).toBe('text');
    expect(out.blob.type).toBe('json');
    expect(out.mixed.type).toBe('json');
  });

  it('feeds zodFromSchema and does not mutate the input', () => {
    const before = JSON.stringify(input);
    expect(zodFromSchema(out).safeParse({ retries: 9 }).success).toBe(false);
    expect(zodFromSchema(out).safeParse({ retries: 2, mode: 'fast' }).success).toBe(true);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('handles a schema without properties', () => {
    expect(fromJsonSchema({ type: 'object' })).toEqual({});
  });
});

describe('fromFormBuilder', () => {
  const out = fromFormBuilder({
    id: 'f',
    fields: [
      { id: '1', type: 'email', name: 'email', label: 'Email', required: true, placeholder: 'a@b.c' },
      { id: '2', type: 'radio', name: 'plan', label: 'Plan', options: [{ label: 'Free', value: 'free' }] },
      { id: '3', type: 'checkbox', name: 'agree', label: 'Agree', defaultValue: true, helperText: 'Required by law' },
      { id: '4', type: 'rating', name: 'stars', label: 'Stars' },
      { id: '5', type: 'file', name: 'doc', label: 'Doc' },
      { id: '6', type: 'multiselect', name: 'tags', label: 'Tags', options: [{ label: 'A', value: 'a' }] },
    ],
  });

  it('keys by name in order and maps types', () => {
    expect(Object.keys(out)).toEqual(['email', 'plan', 'agree', 'stars', 'doc', 'tags']);
    expect(out.email).toEqual({ label: 'Email', type: 'text', required: true, placeholder: 'a@b.c' });
    expect(out.plan).toMatchObject({ type: 'select', options: [{ label: 'Free', value: 'free' }] });
    expect(out.agree).toMatchObject({ type: 'boolean', value: true, description: 'Required by law' });
    expect(out.stars).toMatchObject({ type: 'number', min: 1, max: 5 });
    expect(out.doc.type).toBe('media');
    expect(out.tags.type).toBe('multi-select');
  });
});
