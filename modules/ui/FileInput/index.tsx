'use client';
// modules/ui/FileInput/index.tsx
//
// FileInput — low-level drag-and-drop file picker primitive.
//
// Pixel-identical EJS sibling at modules/ui/FileInput/FileInput.ejs.
//
// M1 (this file): drag & drop, paste from clipboard, `accept` MIME pattern +
//                 extension validation, `maxSize` / `maxFiles` enforcement.
// TODO M2: image thumbnail decode + preview (delegate to FileUploadSection).
// TODO M3: chunked + resumable upload (delegate to FileUploadSection useUploader).
// TODO M4: camera input, tus.io adapter, S3 multipart direct upload.
// TODO M5: full a11y (aria-live progress announcements), reduced-motion,
//          messages prop richer i18n.

import { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faXmark } from '@fortawesome/free-solid-svg-icons';
import type {
  FileEntry,
  UploadState,
  FileInputMessages,
  FileInputProps,
} from './types';
import { DEFAULT_MESSAGES } from './types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Loose match of a File against an HTML `accept` attribute pattern.
 * Supports: extension (`.png`), exact MIME (`image/png`), wildcard (`image/*`),
 * comma-separated combinations. Returns true if `accept` is empty/undefined.
 */
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
  if (patterns.length === 0) return true;
  const name = file.name.toLowerCase();
  const mime = (file.type || '').toLowerCase();
  return patterns.some((p) => {
    if (p.startsWith('.')) return name.endsWith(p);
    if (p.endsWith('/*')) {
      const prefix = p.slice(0, -1); // 'image/'
      return mime.startsWith(prefix);
    }
    return mime === p;
  });
}

export function FileInput({
  id,
  label,
  hint,
  multiple = false,
  accept,
  maxSizeBytes,
  maxFiles,
  allowedTypes,
  disabled,
  required,
  name,
  enablePaste = false,
  onFiles,
  onUpload,
  uploadLabel = 'Upload',
  className,
  messages,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [globalError, setGlobalError] = useState('');

  const isDisabled = disabled || uploadState === 'uploading';

  const msg: FileInputMessages = {
    ...DEFAULT_MESSAGES,
    ...messages,
  };

  const validate = useCallback(
    (file: File): string | undefined => {
      if (maxSizeBytes && file.size > maxSizeBytes) {
        return msg.invalidSize(formatBytes(maxSizeBytes));
      }
      if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return msg.invalidType;
      }
      if (accept && !matchesAccept(file, accept)) {
        return msg.invalidType;
      }
      return undefined;
    },
    [maxSizeBytes, allowedTypes, accept, msg]
  );

  const addFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files) return;
      const arr = Array.from(files);
      if (arr.length === 0) return;

      const newEntries: FileEntry[] = arr.map((file) => ({
        file,
        error: validate(file),
      }));

      setEntries((prev) => {
        const combined = multiple ? [...prev, ...newEntries] : newEntries;
        if (maxFiles && combined.length > maxFiles) {
          setGlobalError(msg.tooMany(maxFiles));
          return combined.slice(0, maxFiles);
        }
        setGlobalError('');
        return combined;
      });
      // Notify consumer with valid (non-error) files
      const valid = newEntries.filter((e) => !e.error).map((e) => e.file);
      if (valid.length > 0) onFiles?.(valid);
      setUploadState('idle');
    },
    [multiple, validate, maxFiles, msg, onFiles]
  );

  function removeEntry(i: number) {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
    if (inputRef.current) inputRef.current.value = '';
    setGlobalError('');
  }

  async function handleUpload() {
    if (!onUpload) return;
    const validFiles = entries.filter((e) => !e.error).map((e) => e.file);
    if (validFiles.length === 0) return;
    setUploadState('uploading');
    setErrorMsg('');
    try {
      await onUpload(validFiles);
      setUploadState('success');
      setEntries([]);
      if (inputRef.current) inputRef.current.value = '';
    } catch (e: unknown) {
      setUploadState('error');
      setErrorMsg(e instanceof Error ? e.message : msg.uploadFailed);
    }
  }

  // ── Paste-from-clipboard (M1) ───────────────────────────────────────────
  // Listens at document level whenever this root is focused-within. Picks
  // any file-typed clipboard items (typically images) and converts to File.
  useEffect(() => {
    if (!enablePaste || isDisabled) return;
    function onPaste(ev: ClipboardEvent) {
      // Only react when paste happens inside this component to avoid
      // hijacking pastes across the page.
      const root = rootRef.current;
      if (!root) return;
      const active = document.activeElement;
      const inside = active && (root === active || root.contains(active));
      if (!inside) return;

      const items = ev.clipboardData?.items;
      if (!items || items.length === 0) return;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.kind === 'file') {
          const f = it.getAsFile();
          if (f) {
            // Some browsers paste an unnamed image; assign a stable name.
            const named =
              f.name && f.name !== 'image.png'
                ? f
                : new File([f], `pasted-${Date.now()}.${(f.type.split('/')[1] || 'bin').replace('+xml', '')}`, {
                    type: f.type,
                    lastModified: Date.now(),
                  });
            files.push(named);
          }
        }
      }
      if (files.length > 0) {
        ev.preventDefault();
        addFiles(files);
      }
    }
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [enablePaste, isDisabled, addFiles]);

  const showError = globalError || (uploadState === 'error' ? errorMsg : '');

  return (
    <div ref={rootRef} className={cn('space-y-2', className)} tabIndex={enablePaste ? -1 : undefined}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}

      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed border-border bg-surface-base transition-colors',
          'flex flex-col items-center justify-center gap-2 px-6 py-8 text-center',
          dragging && 'border-primary bg-primary-subtle',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!isDisabled) addFiles(e.dataTransfer.files);
        }}
      >
        <FontAwesomeIcon icon={faFolderOpen} className="w-8 h-8 text-text-disabled" aria-hidden="true" />
        <p className="text-sm text-text-secondary">
          Drag &amp; drop files here, or{' '}
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => inputRef.current?.click()}
            className="text-primary underline underline-offset-2 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded disabled:cursor-not-allowed"
          >
            browse
          </button>
          {enablePaste && (
            <>
              {' '}or paste
            </>
          )}
        </p>
        {hint && <p className="text-xs text-text-disabled">{hint}</p>}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={isDisabled}
          required={required}
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {entries.length > 0 && (
        <ul className="space-y-1.5" aria-label="Selected files">
          {entries.map((entry, i) => (
            <li
              key={i}
              className={cn(
                'flex items-center gap-3 rounded-md border px-3 py-2 text-sm',
                entry.error
                  ? 'border-error bg-error-subtle text-error-fg'
                  : 'border-border bg-surface-raised text-text-primary'
              )}
            >
              <span className="flex-1 truncate min-w-0">
                <span className="font-medium">{entry.file.name}</span>
                <span className="ml-2 text-xs text-text-secondary">{formatBytes(entry.file.size)}</span>
              </span>
              {entry.error && <span className="text-xs text-error shrink-0">{entry.error}</span>}
              <button
                type="button"
                aria-label={`Remove ${entry.file.name}`}
                onClick={() => removeEntry(i)}
                className="shrink-0 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
              >
                <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {onUpload && entries.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploadState === 'uploading'}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium text-primary-fg bg-primary transition-colors',
              'hover:bg-primary-hover active:bg-primary-active',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {uploadState === 'uploading' ? 'Uploading…' : uploadLabel}
          </button>
        </div>
      )}

      {showError && (
        <p role="alert" className="text-sm text-error">
          {showError}
        </p>
      )}

      {uploadState === 'success' && !showError && (
        <p role="status" className="text-sm text-success-fg">
          {msg.uploadSuccess}
        </p>
      )}
    </div>
  );
}
