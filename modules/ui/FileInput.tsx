// Re-export shim — the implementation moved to ./FileInput/index.tsx
// so the component can grow per-feature parts (M2+ thumbnail, M3 chunked
// upload, etc.) without bloating a single file. Existing imports keep
// working unchanged.
export { FileInput } from './FileInput/index';
export type { FileInputProps, FileInputMessages, FileEntry, UploadState } from './FileInput/types';
