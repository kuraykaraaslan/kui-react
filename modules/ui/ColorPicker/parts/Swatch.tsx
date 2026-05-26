'use client';
// modules/ui/ColorPicker/parts/Swatch.tsx
//
// Single 6x6 color tile used inside the preset grid. Pixel-identical to the
// original inline button so existing screenshots / EJS DOM remain consistent.

import { cn } from '@/libs/utils/cn';

type SwatchProps = {
  color: string;
  selected?: boolean;
  onSelect: (color: string) => void;
};

export function Swatch({ color, selected, onSelect }: SwatchProps) {
  return (
    <button
      type="button"
      aria-label={`Color ${color}`}
      title={color}
      onClick={() => onSelect(color)}
      className={cn(
        'w-6 h-6 rounded-sm border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        selected && 'ring-2 ring-border-focus'
      )}
      style={{ background: color }}
    />
  );
}
