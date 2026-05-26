// modules/app/FileUploadSection/types.ts
//
// Type definitions for the high-level FileUploadSection (zone + list +
// progress + retry + actions). M1 implements drop + paste + validation;
// remaining milestones are scaffolded as TODOs.

/** Lifecycle for a single file inside FileUploadSection. */
export type UploadStatus =
  | 'idle'
  | 'uploading'
  | 'paused'      // TODO M3: resumable pause
  | 'success'
  | 'error'
  | 'cancelled'; // TODO M3: user-cancelled

/** A single file row inside the section. */
export type FileItem = {
  /** Stable id (e.g. `${name}-${size}-${lastModified}`). */
  id: string;
  file: File;
  status: UploadStatus;
  /** 0..100 percent. */
  progress: number;
  /** Optional status / error message line. */
  message?: string;
  /** Validation error from MIME / size / count checks. */
  error?: string;
};

export type FileUploadSectionMessages = {
  dropHint: string;
  browseLabel: string;
  pasteHint: string;
  invalidSize: (limit: string) => string;
  invalidType: string;
  tooMany: (max: number) => string;
  emptyState: string;
  remove: string;
};

export const DEFAULT_FUS_MESSAGES: FileUploadSectionMessages = {
  dropHint: 'Drag & drop files here, or',
  browseLabel: 'browse',
  pasteHint: 'or paste from clipboard',
  invalidSize: (limit) => `File exceeds ${limit} limit`,
  invalidType: 'File type not allowed',
  tooMany: (max) => `Too many files — limit is ${max}`,
  emptyState: 'No files selected yet.',
  remove: 'Remove',
};

// TODO M3: UploadConfig — chunkSize, maxConcurrent, headers, retry policy.
// TODO M4: TusConfig, S3MultipartConfig.
// TODO M5: UploadTelemetry event union (select, validate-fail, upload-start,
//          progress, retry, complete, cancel, paste, crop-apply).

export type FileUploadSectionProps = {
  /** Controlled file list (optional). Uncontrolled if omitted. */
  files?: FileItem[];
  onFilesChange?: (files: FileItem[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  maxFiles?: number;
  disabled?: boolean;
  enablePaste?: boolean;
  /** Title shown above the drop zone. */
  title?: string;
  /** Hint shown beneath the drop zone copy. */
  hint?: string;
  className?: string;
  messages?: Partial<FileUploadSectionMessages>;

  // TODO M2: imageCrop?: boolean | { aspect?: number | 'free'; presets?: number[] };
  //          enableThumbnails?: boolean (default true for image/video).
  // TODO M3: upload?: { url: string; method?: 'POST' | 'PUT'; chunkSize?: number;
  //                     maxConcurrent?: number; headers?: Record<string,string>;
  //                     protocol?: 'multipart' | 'tus' | 's3-multipart'; };
  // TODO M4: enableCamera?: boolean; reorderable?: boolean;
  //          onTelemetry?: (e: UploadTelemetry) => void;
};
