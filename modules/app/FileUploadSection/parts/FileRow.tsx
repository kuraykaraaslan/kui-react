'use client';
// modules/app/FileUploadSection/parts/FileRow.tsx
//
// A single row inside the selected-files list. Shows file name + size,
// validation error (if any), and a remove button.
//
// TODO M2: render a small thumbnail (ImagePreview part) for image/video files.
// TODO M3: render a progress bar (0..100%) + retry button for chunked uploads.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faImage } from '@fortawesome/free-solid-svg-icons';
import type { FileItem } from '../types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type FileRowProps = {
  item: FileItem;
  removeLabel: string;
  onRemove: () => void;
};

export function FileRow({ item, removeLabel, onRemove }: FileRowProps) {
  const isImage = item.file.type.startsWith('image/');
  return (
    <li
      className={cn(
        'flex items-center gap-3 rounded-md border px-3 py-2 text-sm',
        item.error
          ? 'border-error bg-error-subtle text-error-fg'
          : 'border-border bg-surface-raised text-text-primary'
      )}
    >
      {/* TODO M2: replace with <ImagePreview file={item.file} /> when enableThumbnails */}
      {isImage && (
        <FontAwesomeIcon icon={faImage} className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
      )}
      <span className="flex-1 truncate min-w-0">
        <span className="font-medium">{item.file.name}</span>
        <span className="ml-2 text-xs text-text-secondary">{formatBytes(item.file.size)}</span>
        {/* TODO M3: progress bar:
            {item.status === 'uploading' && (
              <div className="w-full mt-1 h-1 rounded-full bg-surface-sunken overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
              </div>
            )} */}
      </span>
      {item.error && <span className="text-xs text-error shrink-0">{item.error}</span>}
      <button
        type="button"
        aria-label={`${removeLabel} ${item.file.name}`}
        onClick={onRemove}
        className="shrink-0 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
      >
        <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
      </button>
    </li>
  );
}
