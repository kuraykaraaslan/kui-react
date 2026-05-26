'use client';
// modules/app/FileUploadSection/hooks/useThumbnail.ts
//
// TODO M2: Lazy thumbnail decoder.
// - image/*  → `createImageBitmap()` → draw to off-screen canvas → toDataURL.
// - video/*  → <video src=URL.createObjectURL(file)> seek to 0.0 → drawImage.
// - pdf      → optional pdf.js (lazy import) → render first page.
// Returns { url, loading, error } so the UI can show a skeleton.
//
// Stub today — returns null url so consumers fall back to the icon placeholder.

import type { FileItem } from '../types';

export type ThumbnailState = {
  url: string | null;
  loading: boolean;
  error?: string;
};

export function useThumbnail(_item: FileItem): ThumbnailState {
  // TODO M2: decode + return data URL.
  return { url: null, loading: false };
}
