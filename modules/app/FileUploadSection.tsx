// Re-export shim — implementation lives in ./FileUploadSection/index.tsx so
// the component can grow per-feature parts (M2+ thumbnail / crop, M3 chunked
// uploader, etc.) without bloating a single file.
export { FileUploadSection } from './FileUploadSection/index';
export type {
  FileItem,
  FileUploadSectionProps,
  FileUploadSectionMessages,
} from './FileUploadSection/types';
