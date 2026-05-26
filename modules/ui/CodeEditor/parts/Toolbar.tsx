'use client';
// modules/ui/CodeEditor/parts/Toolbar.tsx
//
// CodeEditor toolbar — M2 STUB. Lives above the editor and surfaces
// language picker, theme switcher, format/save button, find/replace toggle.
//
// TODO M2: render language <Select>, theme <ButtonGroup>, format-on-save
//          <Toggle>, find <Button> (opens find-bar dialog), copy <Button>.

import { cn } from '@/libs/utils/cn';
import type { CodeEditorProps } from '../types';

type ToolbarProps = Pick<CodeEditorProps, 'language' | 'theme' | 'readonly'>;

export function Toolbar({ language, theme, readonly }: ToolbarProps) {
  // TODO M2: real toolbar UI.
  return (
    <div
      data-kui-codeeditor-toolbar
      className={cn(
        'flex items-center justify-between gap-2 border-b border-border bg-surface-raised px-3 py-1.5 text-xs text-text-secondary'
      )}
    >
      <span className="font-mono">{language}</span>
      <span className="font-mono opacity-60">
        {theme}
        {readonly ? ' · read-only' : ''}
      </span>
    </div>
  );
}
