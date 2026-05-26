'use client';
// modules/app/FileUploadSection/parts/DropZone.tsx
//
// Drop zone + browse button + (optional) paste hint. Stateless visual shell.

import { useRef } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

export type DropZoneProps = {
  id: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  dragging: boolean;
  hint?: string;
  dropHint: string;
  browseLabel: string;
  pasteHint?: string;
  showPasteHint?: boolean;
  onFiles: (files: FileList | null) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (dt: DataTransfer) => void;
};

export function DropZone({
  id,
  accept,
  multiple,
  disabled,
  dragging,
  hint,
  dropHint,
  browseLabel,
  pasteHint,
  showPasteHint,
  onFiles,
  onDragOver,
  onDragLeave,
  onDrop,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-dashed border-border bg-surface-base transition-colors',
        'flex flex-col items-center justify-center gap-2 px-6 py-8 text-center',
        dragging && 'border-primary bg-primary-subtle',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) onDragOver();
      }}
      onDragLeave={() => onDragLeave()}
      onDrop={(e) => {
        e.preventDefault();
        if (!disabled) onDrop(e.dataTransfer);
      }}
    >
      <FontAwesomeIcon icon={faFolderOpen} className="w-8 h-8 text-text-disabled" aria-hidden="true" />
      <p className="text-sm text-text-secondary">
        {dropHint}{' '}
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="text-primary underline underline-offset-2 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded disabled:cursor-not-allowed"
        >
          {browseLabel}
        </button>
      </p>
      {showPasteHint && pasteHint && <p className="text-xs text-text-disabled">{pasteHint}</p>}
      {hint && <p className="text-xs text-text-disabled">{hint}</p>}
      <input
        ref={inputRef}
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}
