'use client';
// Re-export shim — keeps `@/modules/ui/ComboBox` import path working.
// New code: import from `@/modules/ui/ComboBox/index` (or the bare folder).
export { ComboBox } from './ComboBox/index';
export type { ComboBoxOption, ComboBoxProps } from './ComboBox/index';
