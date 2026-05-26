'use client';
// TODO M3: conditional logic evaluator.
//
// Planned shape:
//   type Logic =
//     | { op: 'show'; target: string; when: { field: string; eq: unknown } }
//     | { op: 'hide'; target: string; when: { field: string; eq: unknown } }
//     | { op: 'skip-page'; pageId: string; when: { field: string; empty: true } };
//
// Implementation note: no `eval` / no `new Function`. Walk a small AST that
// the visual rule editor produces.
//
// For M1 every field is always visible.

import type { Field, FormValues } from '../types';

export function isFieldVisible(_field: Field, _values: FormValues): boolean {
  // TODO M3 — evaluate logic rules referencing other field values.
  return true;
}
