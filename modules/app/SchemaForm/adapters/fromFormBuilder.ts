import type { Field, FormSchema } from '../../FormBuilder/types';
import type { FieldSchema } from '../types';

function convert(f: Field): FieldSchema {
  const out: FieldSchema = { label: f.label, type: 'text' };
  if (f.placeholder) out.placeholder = f.placeholder;
  if (f.helperText) out.description = f.helperText;
  if (f.required) out.required = true;
  if (f.defaultValue !== undefined && f.defaultValue !== null) out.value = f.defaultValue;
  if (f.options) out.options = f.options.map((o) => ({ label: o.label, value: o.value }));
  switch (f.type) {
    case 'number': out.type = 'number'; break;
    case 'textarea': out.type = 'textarea'; break;
    case 'select':
    case 'radio': out.type = 'select'; break;
    case 'multiselect': out.type = 'multi-select'; break;
    case 'checkbox': out.type = 'boolean'; break;
    case 'date': out.type = 'date'; break;
    case 'rating': out.type = 'number'; out.min = 1; out.max = 5; out.step = 1; break;
    // File uploads are app-bound: a host renders them through fieldOverrides.media.
    case 'file': out.type = 'media'; break;
    // text, email, signature (no renderer yet) stay text.
    default: break;
  }
  return out;
}

/** FormBuilder `FormSchema` to a `FieldSchema` map keyed by `field.name` (a later duplicate name wins). Field order is kept. */
export function fromFormBuilder(schema: FormSchema): Record<string, FieldSchema> {
  const out: Record<string, FieldSchema> = {};
  for (const f of schema.fields) out[f.name] = convert(f);
  return out;
}
