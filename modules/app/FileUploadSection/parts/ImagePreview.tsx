'use client';
// modules/app/FileUploadSection/parts/ImagePreview.tsx
//
// TODO M2: Lazy-decoded thumbnail for image/video files. For images use
// `createImageBitmap()` to draw onto a small <canvas>; for videos seek to
// 0.0 and capture the first frame. Falls back to <FontAwesomeIcon faImage>.
//
// This is a STUB so the file exists in the folder layout; the actual
// implementation lands in M2. Renders nothing today.

import type { FileItem } from '../types';

export type ImagePreviewProps = {
  item: FileItem;
  size?: number; // px square
};

export function ImagePreview(_props: ImagePreviewProps) {
  // TODO M2: decode + render thumbnail. For now, render nothing.
  return null;
}
