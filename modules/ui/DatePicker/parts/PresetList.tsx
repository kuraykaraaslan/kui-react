'use client';
// modules/ui/DatePicker/parts/PresetList.tsx
//
// STUB — M1 ships an empty preset column placeholder so the popover layout
// is forward-compatible with the M2 preset feature.
//
// TODO M2: render the actual list of Today / Yesterday / Last 7 / Last 30 /
// This week / This month / This year / Custom presets, wire onApply, and
// keyboard-navigate via roving tabindex.

import { cn } from '@/libs/utils/cn';

type PresetListProps = {
  className?: string;
};

export function PresetList({ className }: PresetListProps) {
  // TODO M2: see file header.
  return (
    <div
      className={cn('hidden', className)}
      aria-hidden="true"
      data-preset-list-placeholder
    />
  );
}
