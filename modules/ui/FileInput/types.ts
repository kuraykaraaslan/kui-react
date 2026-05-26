// modules/ui/FileInput/types.ts
//
// Type definitions shared across the FileInput suite.

/** A single selected file entry with optional validation error. */
export type FileEntry = {
  file: File;
  error?: string;
};

/** Upload state for the optional `onUpload` action button. */
export type UploadState = 'idle' | 'uploading' | 'success' | 'error';

/** User-facing messages for validation and status. Allows i18n overrides. */
export type FileInputMessages = {
  /** Shown when a file exceeds `maxSizeBytes`. Receives the limit (formatted). */
  invalidSize: (limit: string) => string;
  /** Shown when a file type is not in `allowedTypes` or does not match `accept`. */
  invalidType: string;
  /** Shown when more files are selected than `maxFiles`. */
  tooMany: (max: number) => string;
  /** Default upload failure message. */
  uploadFailed: string;
  /** Default upload success message. */
  uploadSuccess: string;
};

// TODO M2: ThumbnailKind, CropAspect, PreviewSource types.
// TODO M3: UploadStatus (chunked: 'queued' | 'uploading' | 'paused' | 'success' | 'error' | 'cancelled'),
//          ChunkProgress, ResumableUploadState.
// TODO M4: TusOptions, S3MultipartOptions, CameraInputMode.
// TODO M5: UploadTelemetry event union.

export type FileInputProps = {
  id: string;
  label?: string;
  hint?: string;
  multiple?: boolean;
  accept?: string;
  maxSizeBytes?: number;
  /** Optional cap on total selected count. */
  maxFiles?: number;
  /** Explicit MIME whitelist (overrides loose `accept` pattern matching). */
  allowedTypes?: string[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  /** When true, listens for paste-from-clipboard (image bytes). M1. */
  enablePaste?: boolean;
  /** Optional callback fired with the validated File[] (no internal upload). */
  onFiles?: (files: File[]) => void;
  /** Optional upload action; when set, renders an upload button. */
  onUpload?: (files: File[]) => Promise<void>;
  uploadLabel?: string;
  className?: string;
  /** i18n / copy overrides for validation + status messages. */
  messages?: Partial<FileInputMessages>;
  // TODO M2: enableCamera?: boolean; imageCrop?: boolean | CropOptions;
  // TODO M4: enableTus?: TusOptions; enableS3Multipart?: S3MultipartOptions;
};

export const DEFAULT_MESSAGES: FileInputMessages = {
  invalidSize: (limit) => `File exceeds ${limit} limit`,
  invalidType: 'File type not allowed',
  tooMany: (max) => `Too many files — limit is ${max}`,
  uploadFailed: 'Upload failed. Please try again.',
  uploadSuccess: 'Files uploaded successfully.',
};
