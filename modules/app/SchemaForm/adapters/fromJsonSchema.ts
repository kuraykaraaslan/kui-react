import type { FieldOption, FieldSchema } from '../types';

/** The JSON Schema subset understood here. Anything else degrades to a `json` field. */
export interface JsonSchemaSubset {
  type?: string;
  title?: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  format?: string;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  minLength?: number;
  maxLength?: number;
  properties?: Record<string, JsonSchemaSubset>;
  required?: string[];
  items?: JsonSchemaSubset;
  [k: string]: unknown;
}

const titleCase = (k: string) => k.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, (c) => c.toUpperCase());

const isStringEnum = (e: unknown[] | undefined): e is string[] => Array.isArray(e) && e.length > 0 && e.every((v) => typeof v === 'string');

function fieldFor(key: string, s: JsonSchemaSubset, required: boolean): FieldSchema {
  const base: Pick<FieldSchema, 'label' | 'description' | 'required' | 'value'> = { label: s.title ?? titleCase(key) };
  if (s.description) base.description = s.description;
  if (required) base.required = true;
  if (s.default !== undefined) base.value = s.default;
  const json = (): FieldSchema => ({ ...base, type: 'json' });

  if (s.enum) {
    if (!isStringEnum(s.enum)) return json();
    const options: FieldOption[] = s.enum;
    return { ...base, type: 'select', options };
  }
  switch (s.type) {
    case 'string': {
      const f = s.format;
      const type = f === 'uri' || f === 'url' ? 'url' : f === 'date' ? 'date' : f === 'date-time' ? 'datetime'
        : f === 'color' ? 'color' : f === 'textarea' || f === 'multiline' ? 'textarea' : 'text';
      return { ...base, type };
    }
    case 'integer':
    case 'number': {
      const out: FieldSchema = { ...base, type: 'number' };
      if (s.minimum !== undefined) out.min = s.minimum;
      if (s.maximum !== undefined) out.max = s.maximum;
      if (s.multipleOf !== undefined) out.step = s.multipleOf;
      else if (s.type === 'integer') out.step = 1;
      return out;
    }
    case 'boolean':
      return { ...base, type: 'boolean' };
    case 'array': {
      const it = s.items;
      if (it && isStringEnum(it.enum)) return { ...base, type: 'multi-select', options: it.enum };
      if (it && it.type === 'object' && it.properties) return { ...base, type: 'repeater', fields: fromJsonSchema(it) };
      return json();
    }
    default:
      return json(); // object, oneOf/anyOf/$ref, unknown types
  }
}

/**
 * JSON Schema (subset) to a `FieldSchema` map: type, enum, minimum/maximum,
 * multipleOf, required, default, description, title, and the string formats
 * uri/url, date, date-time, color. Nested objects, composition and `$ref` become
 * `json` fields. Pure: does not mutate the input.
 */
export function fromJsonSchema(schema: JsonSchemaSubset): Record<string, FieldSchema> {
  const required = new Set(Array.isArray(schema.required) ? schema.required : []);
  const out: Record<string, FieldSchema> = {};
  for (const [key, prop] of Object.entries(schema.properties ?? {})) {
    out[key] = fieldFor(key, prop ?? {}, required.has(key));
  }
  return out;
}
