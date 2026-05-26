'use client';
// modules/ui/Slider.tsx
//
// Thin re-export shim — the real implementation now lives in the
// directory-style module `./Slider/`. Existing imports such as
//   import { Slider } from '@/modules/ui/Slider';
// continue to resolve through this barrel.
//
// See PLANS/29-Slider-Carousel.md for the milestone roadmap.

export { Slider } from './Slider/index';
export type { SliderProps } from './Slider/index';
