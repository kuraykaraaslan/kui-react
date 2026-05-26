'use client';
// modules/ui/CodeEditor/engines/monaco.tsx
//
// Monaco engine — M2 STUB.
//
// In M2 this will lazy-load `@monaco-editor/react` (~1 MB) only when the
// caller opts in via `engine="monaco"`. For M1 it transparently falls back
// to the CodeMirror engine so the API surface remains stable.
//
// TODO M2: import('@monaco-editor/react'), map theme to vs/vs-dark/hc-black,
//          register language workers, wire onChange + readOnly + minimap +
//          format-on-save (Prettier lazy).
// TODO M3: pass markers via monaco.editor.setModelMarkers; register
//          completion + hover providers; attach extraLibs via
//          monaco.languages.typescript.javascriptDefaults.addExtraLib.
// TODO M4: vim/emacs keymap (monaco-vim), collaborative cursor (Yjs).

import { CodeMirrorEngine } from './codemirror';
import type { CodeEditorEngineProps } from '../types';

export function MonacoEngine(props: CodeEditorEngineProps) {
  // TODO M2: replace this transparent fallback with the real Monaco mount.
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn(
      '[CodeEditor] engine="monaco" is not implemented yet — falling back to codemirror engine. See PLANS/36-CodeEditor.md M2.'
    );
  }
  return <CodeMirrorEngine {...props} />;
}
