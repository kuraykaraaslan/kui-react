'use client';
// modules/app/FileUploadSection/parts/CropDialog.tsx
//
// TODO M2: Image crop dialog with aspect-ratio presets (1:1, 4:5, 16:9, free),
// rotate (90° step), flip. Outputs a Blob (new file; original preserved).
//
// Stub component so the folder layout matches PLANS/28-FileUpload.md.

import type { FileItem } from '../types';

export type CropDialogProps = {
  item: FileItem;
  open: boolean;
  onClose: () => void;
  onApply: (cropped: Blob) => void;
  aspect?: number | 'free';
  presets?: number[];
};

export function CropDialog(_props: CropDialogProps) {
  // TODO M2: render Modal + canvas-based cropper UI.
  return null;
}
