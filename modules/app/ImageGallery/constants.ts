'use client';
import type { GalleryAspect, GalleryColumns, GalleryGap } from './types';

export const columnClasses: Record<GalleryColumns, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
};

export const gapClasses: Record<GalleryGap, string> = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
};

export const aspectClasses: Record<GalleryAspect, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: '',
};
