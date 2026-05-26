'use client';
// modules/ui/CodeEditor/index.tsx
//
// CodeEditor — engine-agnostic code editor primitive. Default engine is
// CodeMirror 6 (lightweight). Monaco (VSCode) is opt-in via `engine="monaco"`
// and lazy-loaded on demand (M2).
//
// Pixel-identical EJS sibling at modules/ui/CodeEditor/CodeEditor.ejs.
//
// Adoption (planned):
//   - RulesetEditor M3 reuses this for its inline script editor.
//   - RichTextEditor "Insert code block" uses this in an embedded mode.
//   - DiffViewer (37) builds left/right panes on top of this.
//
// TODO M2: surface Toolbar (parts/Toolbar) when `showToolbar` is true.
// TODO M3: wire `markers`, `getSuggestions`, `getHover`, `extraLibs`.
// TODO M4: minimap, vim/emacs keymap, code folding.
// TODO M5: ARIA live region for diagnostics + reduced-motion cursor.

import { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils/cn';
import { useLazyEngine } from './hooks/useLazyEngine';
import { useDiagnostics } from './hooks/useDiagnostics';
import { useAutocomplete } from './hooks/useAutocomplete';
import type { CodeEditorProps } from './types';

export function CodeEditor({
  value,
  onChange,
  language = 'plaintext',
  theme = 'light',
  engine = 'codemirror',
  readonly = false,
  placeholder = '',
  label,
  hint,
  error,
  minHeight = 200,
  showLineNumbers = true,
  id,
  name,
  className,
  // M2+ (forwarded later — currently consumed only to keep type happy)
  showToolbar: _showToolbar,
  formatOnSave: _formatOnSave,
  markers,
  getSuggestions,
  getHover,
  extraLibs: _extraLibs,
  showMinimap: _showMinimap,
  keymap: _keymap,
  messages: _messages,
}: CodeEditorProps) {
  const Engine = useLazyEngine(engine);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  // TODO M3: pipe markers + suggestions/hover into the active engine ref.
  useDiagnostics(markers);
  useAutocomplete(getSuggestions, getHover);

  // Keep the hidden form input in sync — supports drop-in <form> usage.
  useEffect(() => {
    if (hiddenInputRef.current) hiddenInputRef.current.value = value ?? '';
  }, [value]);

  return (
    <div
      data-kui-codeeditor
      data-engine={engine}
      data-language={language}
      data-theme={theme}
      className={cn('w-full', className)}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-primary mb-1"
        >
          {label}
        </label>
      )}

      {/* TODO M2: <Toolbar /> goes here when showToolbar is true. */}

      <Engine
        value={value}
        onChange={onChange}
        language={language}
        theme={theme}
        readonly={readonly}
        placeholder={placeholder}
        minHeight={minHeight}
        showLineNumbers={showLineNumbers}
        id={id}
        // The hidden input below carries the form name — engine's textarea
        // stays unnamed so the controlled value wins on submit.
        className={cn(error && 'border-error focus-within:ring-error')}
      />

      {name && (
        <input
          ref={hiddenInputRef}
          type="hidden"
          name={name}
          defaultValue={value ?? ''}
        />
      )}

      {(hint || error) && (
        <p
          className={cn(
            'mt-1 text-xs',
            error ? 'text-error' : 'text-text-secondary'
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export type {
  CodeEditorProps,
  CodeEditorEngine,
  CodeEditorTheme,
  Lang,
  Marker,
  Suggestion,
  SuggestContext,
  Hover,
  HoverContext,
  CodeEditorMessages,
} from './types';
