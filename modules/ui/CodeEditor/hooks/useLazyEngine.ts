'use client';
// modules/ui/CodeEditor/hooks/useLazyEngine.ts
//
// Engine selection + lazy-load hook.
//
// M1: synchronously returns the matching engine component (both engines are
//     already in the bundle — no dynamic import needed yet). The hook exists
//     so M2's swap to `await import('@codemirror/state')` / `await import(
//     '@monaco-editor/react')` is a one-file change.
//
// TODO M1+: replace direct imports with `React.lazy()` + Suspense once the
//           real engines land — cache the resolved component per engine kind
//           in a module-level Map so navigating between editors on the same
//           page doesn't re-fetch the chunk.

import { CodeMirrorEngine } from '../engines/codemirror';
import { MonacoEngine } from '../engines/monaco';
import type { CodeEditorEngine, CodeEditorEngineProps } from '../types';

type EngineComponent = (props: CodeEditorEngineProps) => React.ReactElement;

/**
 * Module-level engine registry — one stable component per engine kind, so the
 * editor never remounts just because its parent re-rendered.
 */
export const ENGINES: Record<CodeEditorEngine, EngineComponent> = {
  // TODO M2: lazy import('@monaco-editor/react') here.
  monaco: MonacoEngine as EngineComponent,
  // TODO M1+: lazy import('@codemirror/state') here.
  codemirror: CodeMirrorEngine as EngineComponent,
};

export function useLazyEngine(engine: CodeEditorEngine): EngineComponent {
  return ENGINES[engine] ?? ENGINES.codemirror;
}
