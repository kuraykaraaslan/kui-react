// modules/ui/DiffViewer/hooks/useSyntaxHighlight.ts
//
// M2 stub — pass-through. The real implementation will lazy-load shiki or
// prismjs and tokenise the changed lines so the unified/split views can
// render colourised <span> trees inside the `<DiffLine>` content slot.

import type { Change } from '../types';

export type HighlightedChange = Change & {
  /** When syntax highlighting is enabled, holds tokenised HTML. M1: undefined. */
  highlightedHtml?: string;
};

/**
 * M1: returns the input unchanged. The real hook in M2 will accept a
 * `language` arg, lazy-import the highlighter, and return the same array
 * with `highlightedHtml` populated.
 */
export function useSyntaxHighlight(
  changes: Change[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _language?: string
): HighlightedChange[] {
  // TODO M2: lazy-load shiki, tokenise each change, return enriched array.
  return changes;
}
