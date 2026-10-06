// The field vocabulary every schema-driven form shares: a field's TYPE, its
// descriptor, and the two compound value shapes a descriptor can carry.
//
// SOURCE OF TRUTH: kui-react `modules/app/SchemaForm/types.ts` (OD-16). It was
// extracted from next-boilerplate's dynamic_page and moved here; next-boilerplate
// vendors this file back byte-for-byte (modules/common/ui/kui/schema-form/).
// Do not edit a vendored copy; change it in kui-react. The file is framework
// neutral on purpose: no React, no imports.
//
// Types such as 'media', 'remote-select', 'symbol', 'color-token', 'img', 'icon',
// 'link' and 'background' are app-bound: kui-react ships no renderer for them and
// a host supplies one through `fieldOverrides`.

export type FieldType =
  | 'text' | 'url' | 'textarea' | 'color' | 'boolean' | 'number'
  | 'select' | 'multi-select' | 'json' | 'img' | 'repeater'
  | 'icon' | 'rich-text' | 'datetime'
  // Date-only (no time-of-day component) — `<input type="date">`. `datetime`
  // above is date+time (`datetime-local`); a block or settings form that only
  // needs a calendar day used to have to overload `datetime` for that, which
  // asked the visitor for a time nobody would fill in correctly.
  | 'date'
  | 'link' | 'color-token' | 'background'
  // Picks a reusable symbol from the tenant's library (stores its symbolId).
  | 'symbol'
  // Library-backed image: browse/reuse the tenant media library (media_gallery),
  // upload into it, edit alt text and a focal point. Value is a string URL
  // (legacy) OR a MediaValue object — renderers resolve both via resolveMedia().
  // Falls back to plain URL/upload behaviour when media_gallery is disabled.
  | 'media'
  // Generic picker over a tenant API endpoint (any module): fetches `endpoint`,
  // lists items by `labelKey`, stores `valueKey`. Optionally offers an empty
  // ("all") option and a "Dynamic — from URL" option that stores ':slug'
  // (resolved at render by useDynamicValue). Reusable — not commerce-specific.
  | 'remote-select'

export type FieldOption = string | { label: string; value: string }

// Breakpoint-aware responsive prop: scalar OR per-device object
export type ResponsiveValue<T = unknown> = T | { mobile?: T; tablet?: T; desktop?: T }

// Value type for 'link' compound field
export interface LinkValue {
  label: string
  href: string
  target: '_self' | '_blank'
}

export interface FieldSchema {
  label: string
  type: FieldType
  value?: unknown
  options?: FieldOption[]
  placeholder?: string
  uploadFolder?: string
  accept?: string
  description?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  showIf?: Record<string, unknown | unknown[]>
  group?: string
  fields?: Record<string, FieldSchema>
  // When true, PropFieldRenderer shows M/T/D breakpoint tabs
  responsive?: boolean
  // ── 'remote-select' options ────────────────────────────────────────────────
  /** Tenant-relative API path the picker fetches, e.g. '/api/storefront/categories'. */
  endpoint?: string
  /** Key in the JSON response holding the array (e.g. 'categories'); omit if the response IS the array. */
  dataKey?: string
  /** Item field used as the option label (default 'name'). */
  labelKey?: string
  /** Item field stored as the value (default 'id'). */
  valueKey?: string
  /** Label for the empty/"all" option; omit to not offer one. */
  emptyLabel?: string
  /** When true, offers a "Dynamic — from URL" option that stores ':slug'. */
  allowDynamic?: boolean
}

/**
 * Whether a field's `showIf` condition holds against the current values.
 * Lives with FieldSchema because `showIf` is one of its fields: a descriptor and
 * the rule that reads it are the same piece of knowledge.
 */
export function shouldShow(field: FieldSchema, values: Record<string, unknown>): boolean {
  if (!field.showIf) return true
  return Object.entries(field.showIf).every(([k, v]) =>
    Array.isArray(v) ? v.includes(values[k]) : values[k] === v,
  )
}
