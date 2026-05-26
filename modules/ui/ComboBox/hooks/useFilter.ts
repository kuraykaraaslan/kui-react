'use client';
// useFilter — shared local-text filter for ComboBox + MultiSelect.
// Pure: same input -> same output, no side effects.

import { useMemo } from 'react';
import type { ComboBoxOption } from '../types';

export function filterOptions(options: ComboBoxOption[], query: string): ComboBoxOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter((opt) => (
    opt.label.toLowerCase().includes(q)
    || (opt.description ? opt.description.toLowerCase().includes(q) : false)
  ));
}

export function useFilter(options: ComboBoxOption[], query: string): ComboBoxOption[] {
  return useMemo(() => filterOptions(options, query), [options, query]);
}
