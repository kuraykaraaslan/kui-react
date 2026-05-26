'use client';
// modules/app/FileUploadSection/index.tsx
//
// FileUploadSection — high-level upload organism. Composes DropZone +
// FileRow list. Handles validation, paste-from-clipboard, and the
// uncontrolled/controlled file-list contract.
//
// Pixel-identical EJS sibling at modules/app/FileUploadSection/FileUploadSection.ejs.
//
// M1 (this file): drop, paste, accept/maxSize/maxFiles validation, file list,
//                 remove, optional title/hint.
// TODO M2: image thumbnail decode (useThumbnail) + ImagePreview + CropDialog.
// TODO M3: chunked + resumable upload via useUploader; per-file progress bars + retry.
// TODO M4: camera input, tus.io, S3 multipart, drag-to-reorder.
// TODO M5: full a11y (aria-live progress + error announce), reduced-motion.

import { useId, useMemo, useRef, useState, useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import { DropZone } from './parts/DropZone';
import { FileRow } from './parts/FileRow';
import { usePaste } from './hooks/usePaste';
import type {
  FileItem,
  FileUploadSectionMessages,
  FileUploadSectionProps,
} from './types';
import { DEFAULT_FUS_MESSAGES } from './types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
  if (patterns.length === 0) return true;
  const name = file.name.toLowerCase();
  const mime = (file.type || '').toLowerCase();
  return patterns.some((p) => {
    if (p.startsWith('.')) return name.endsWith(p);
    if (p.endsWith('/*')) return mime.startsWith(p.slice(0, -1));
    return mime === p;
  });
}

function makeId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;
}

export function FileUploadSection({
  files,
  onFilesChange,
  accept,
  multiple = true,
  maxSizeBytes,
  maxFiles,
  disabled,
  enablePaste = false,
  title,
  hint,
  className,
  messages,
}: FileUploadSectionProps) {
  const autoId = useId();
  const inputId = `fus-${autoId}`;
  const rootRef = useRef<HTMLDivElement>(null);

  const [internalFiles, setInternalFiles] = useState<FileItem[]>([]);
  const isControlled = files !== undefined;
  const items = isControlled ? files! : internalFiles;

  const [dragging, setDragging] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const msg: FileUploadSectionMessages = useMemo(
    () => ({ ...DEFAULT_FUS_MESSAGES, ...messages }),
    [messages]
  );

  const setItems = useCallback(
    (next: FileItem[]) => {
      if (!isControlled) setInternalFiles(next);
      onFilesChange?.(next);
    },
    [isControlled, onFilesChange]
  );

  const validate = useCallback(
    (file: File): string | undefined => {
      if (maxSizeBytes && file.size > maxSizeBytes) {
        return msg.invalidSize(formatBytes(maxSizeBytes));
      }
      if (accept && !matchesAccept(file, accept)) {
        return msg.invalidType;
      }
      return undefined;
    },
    [maxSizeBytes, accept, msg]
  );

  const addFiles = useCallback(
    (incoming: FileList | File[] | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming);
      if (arr.length === 0) return;
      const newItems: FileItem[] = arr.map((file) => ({
        id: makeId(file),
        file,
        status: 'idle',
        progress: 0,
        error: validate(file),
      }));
      const combined = multiple ? [...items, ...newItems] : newItems;
      if (maxFiles && combined.length > maxFiles) {
        setGlobalError(msg.tooMany(maxFiles));
        setItems(combined.slice(0, maxFiles));
        return;
      }
      setGlobalError('');
      setItems(combined);
    },
    [items, multiple, maxFiles, validate, msg, setItems]
  );

  function removeItem(id: string) {
    setItems(items.filter((it) => it.id !== id));
    setGlobalError('');
  }

  usePaste(rootRef, enablePaste && !disabled, addFiles);

  return (
    <section
      ref={rootRef}
      className={cn('space-y-3', className)}
      // tabIndex so focus can live inside the root for paste capture.
      tabIndex={enablePaste ? -1 : undefined}
      aria-label={title || 'File upload'}
    >
      {title && <h3 className="text-sm font-medium text-text-primary">{title}</h3>}

      <DropZone
        id={inputId}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        dragging={dragging}
        hint={hint}
        dropHint={msg.dropHint}
        browseLabel={msg.browseLabel}
        pasteHint={msg.pasteHint}
        showPasteHint={enablePaste}
        onFiles={addFiles}
        onDragOver={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={(dt) => {
          setDragging(false);
          addFiles(dt.files);
        }}
      />

      {items.length === 0 ? (
        <p className="text-xs text-text-disabled">{msg.emptyState}</p>
      ) : (
        <ul className="space-y-1.5" aria-label="Selected files">
          {items.map((item) => (
            <FileRow
              key={item.id}
              item={item}
              removeLabel={msg.remove}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </ul>
      )}

      {globalError && (
        <p role="alert" className="text-sm text-error">
          {globalError}
        </p>
      )}

      {/* TODO M3: render upload action bar (Upload all / Pause / Cancel)
          when an `upload` config prop is provided. */}
    </section>
  );
}

export type { FileItem, FileUploadSectionProps, FileUploadSectionMessages } from './types';
