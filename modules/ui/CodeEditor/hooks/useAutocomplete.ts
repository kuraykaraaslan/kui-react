'use client';
// modules/ui/CodeEditor/hooks/useAutocomplete.ts
//
// Custom completion + hover provider hook — M3 STUB.
//
// TODO M3: bridge `getSuggestions(ctx)` to @codemirror/autocomplete's
//          CompletionSource OR monaco.languages.registerCompletionItemProvider.
//          Similarly bridge `getHover` to a hover tooltip widget / provider.

import type { CodeEditorProps } from '../types';

export function useAutocomplete(
  _getSuggestions: CodeEditorProps['getSuggestions'],
  _getHover: CodeEditorProps['getHover']
): void {
  // TODO M3: actual implementation.
}
