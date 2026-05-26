'use client';
// modules/ui/ColorPicker/parts/SaturationCanvas.tsx
//
// TODO M2: SV picker pad (saturation × value) driven by the active hue.
// Currently a stub so the public surface is reserved.

type SaturationCanvasProps = {
  hue?: number;
  saturation?: number;
  value?: number;
  onChange?: (sat: number, val: number) => void;
};

export function SaturationCanvas(_props: SaturationCanvasProps) {
  // TODO M2
  return null;
}
