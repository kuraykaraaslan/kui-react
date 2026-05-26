'use client';
// modules/app/FileUploadSection/hooks/useUploader.ts
//
// TODO M3: Chunked + resumable upload engine.
// - Slices each File via Blob.slice(start, end) using configurable chunkSize.
// - Concurrent uploads (maxConcurrent, default 3).
// - Retry with exponential backoff (default 3 attempts).
// - Persist resumable state to localStorage so a refresh / tab close can
//   pick up where we left off.
// - Emits per-file + total progress.
//
// TODO M4: optional tus.io / S3-multipart adapters loaded lazily.
//
// Stub today — exposing a typed contract so callers can wire it up later
// without re-architecting.

import type { FileItem } from '../types';

export type UploaderConfig = {
  url: string;
  method?: 'POST' | 'PUT';
  chunkSize?: number;
  maxConcurrent?: number;
  headers?: Record<string, string>;
};

export type UploaderApi = {
  start: () => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  cancel: (id: string) => void;
  retry: (id: string) => void;
};

export function useUploader(
  _items: FileItem[],
  _onItemsChange: (items: FileItem[]) => void,
  _config?: UploaderConfig
): UploaderApi {
  // TODO M3: implement chunked uploader.
  return {
    start: () => {
      /* TODO M3 */
    },
    pause: () => {
      /* TODO M3 */
    },
    resume: () => {
      /* TODO M3 */
    },
    cancel: () => {
      /* TODO M3 */
    },
    retry: () => {
      /* TODO M3 */
    },
  };
}
