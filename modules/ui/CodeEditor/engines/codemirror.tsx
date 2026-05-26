'use client';
// modules/ui/CodeEditor/engines/codemirror.tsx
//
// CodeMirror engine — M1 fallback implementation.
//
// CodeMirror 6 (`@codemirror/state`, `@codemirror/view`, `@codemirror/lang-*`)
// is NOT yet a project dependency. This file ships a minimal textarea-based
// fallback that satisfies the M1 contract (line-number gutter, line
// highlight, readonly, placeholder, theme class, language data attr) so the
// rest of the API can be wired now.
//
// TODO M1+: once CodeMirror 6 is added as a dependency, swap the textarea
//           for a `await import('@codemirror/state' ...)` lazy-loaded EditorView
//           inside useLazyEngine, behind the same CodeEditorEngineProps shape.
//           This file's exported component name should not change so the
//           top-level CodeEditor doesn't need to be touched.
// TODO M2:  bracket-pair auto-close, comment toggle, multi-cursor (CM6
//           native), Tab indent, Cmd+F find.
// TODO M3:  diagnostics gutter markers + autocomplete via @codemirror/autocomplete.
// TODO M4:  minimap (custom) + code folding (@codemirror/language).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Gutter } from '../parts/Gutter';
import type { CodeEditorEngineProps } from '../types';

const themeRootClass: Record<CodeEditorEngineProps['theme'], string> = {
  light: 'kui-codeeditor-theme-light bg-surface-base text-text-primary border-border',
  dark: 'kui-codeeditor-theme-dark bg-surface-sunken text-text-primary border-border-strong',
  'high-contrast':
    'kui-codeeditor-theme-hc bg-surface-base text-text-primary border-border-focus',
};

export function CodeMirrorEngine({
  value,
  onChange,
  language,
  theme,
  readonly,
  placeholder,
  minHeight,
  showLineNumbers,
  id,
  name,
  className,
}: CodeEditorEngineProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [activeLine, setActiveLine] = useState(1);

  // Lines for the gutter — recomputed every render (cheap up to ~10k lines;
  // virtualise in CM6 swap).
  const lines = useMemo(() => {
    if (!value) return [''];
    return value.split('\n');
  }, [value]);

  const lineCount = Math.max(lines.length, 1);

  const updateActiveLine = useCallback((ta: HTMLTextAreaElement) => {
    const sel = ta.selectionStart ?? 0;
    const upto = ta.value.slice(0, sel);
    setActiveLine(upto.split('\n').length);
  }, []);

  // Keep the gutter active-line cursor in sync without forcing a render storm.
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const handler = () => updateActiveLine(ta);
    ta.addEventListener('keyup', handler);
    ta.addEventListener('click', handler);
    ta.addEventListener('focus', handler);
    return () => {
      ta.removeEventListener('keyup', handler);
      ta.removeEventListener('click', handler);
      ta.removeEventListener('focus', handler);
    };
  }, [updateActiveLine]);

  // Sync vertical scroll between gutter + textarea.
  const onScroll = useCallback(() => {
    const ta = taRef.current;
    const wrap = wrapRef.current;
    if (!ta || !wrap) return;
    const gutterEl = wrap.querySelector<HTMLElement>('[data-kui-codeeditor-gutter]');
    if (gutterEl) gutterEl.scrollTop = ta.scrollTop;
  }, []);

  return (
    <div
      ref={wrapRef}
      data-kui-codeeditor-engine="codemirror-fallback"
      data-language={language}
      data-theme={theme}
      data-readonly={readonly ? '' : undefined}
      className={cn(
        'relative flex w-full overflow-hidden rounded-md border font-mono text-sm',
        'focus-within:ring-2 focus-within:ring-border-focus',
        themeRootClass[theme],
        className
      )}
      style={{ minHeight }}
    >
      {showLineNumbers && (
        <Gutter
          lineCount={lineCount}
          activeLine={activeLine}
          minHeight={minHeight}
        />
      )}
      <textarea
        ref={taRef}
        id={id}
        name={name}
        value={value}
        readOnly={readonly}
        spellCheck={false}
        wrap="off"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onScroll={onScroll}
        // TODO M2: Tab key handler (indent / outdent), Cmd+/ comment toggle,
        //          Cmd+F find dialog, bracket auto-close.
        // TODO M5: ARIA live region announcing diagnostics + reduced motion
        //          aware cursor blink.
        aria-multiline="true"
        aria-readonly={readonly ? true : undefined}
        className={cn(
          'flex-1 min-w-0 resize-none bg-transparent px-3 py-2 leading-5',
          'font-mono text-sm tabular-nums caret-text-primary',
          'placeholder:text-text-disabled',
          'focus-visible:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          readonly && 'cursor-default'
        )}
        style={{ minHeight }}
      />
    </div>
  );
}
