// modules/ui/DiffViewer/types.ts
//
// Shared type definitions for the DiffViewer suite.
// Public surface intentionally re-exported from index.tsx (`DiffViewer`,
// `DiffViewerProps`, `Hunk`, `Change`, `DiffMode`).

/** Render mode — single-column GitHub-style or yan yana split. */
export type DiffMode = 'unified' | 'split';

/** Whether a Change row is unchanged context, added, removed, or a marker. */
export type ChangeType = 'context' | 'add' | 'remove';

/**
 * One displayed line inside a hunk. `oldLine`/`newLine` are 1-based numbers
 * (null when the side doesn't exist — e.g. an `add` has no `oldLine`).
 */
export type Change = {
  type: ChangeType;
  /** 1-based line number in the old text, or null when none. */
  oldLine: number | null;
  /** 1-based line number in the new text, or null when none. */
  newLine: number | null;
  /** Raw content of the line (no trailing newline). */
  content: string;
};

/**
 * A contiguous block of differences plus context lines. `oldStart`/`newStart`
 * are 1-based. `oldLines`/`newLines` count how many lines in each side the
 * hunk spans — matches the `@@ -oldStart,oldLines +newStart,newLines @@` form.
 */
export type Hunk = {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  changes: Change[];
};

// TODO M3: line-anchored review comment threads.
// export type CommentThread = {
//   id: string;
//   side: 'old' | 'new';
//   line: number;
//   comments: Array<{ id: string; author: string; body: string; createdAt: string }>;
//   resolved?: boolean;
// };

// TODO M2/M5: i18n message overrides.
// export type DiffViewerMessages = {
//   showMore: string;          // "Show N more lines"
//   noChanges: string;         // "No changes"
//   binaryDiffer: string;      // "Binary files differ"
//   addCommentLabel: string;   // (M3)
// };

/** Public props for `<DiffViewer>`. */
export type DiffViewerProps = {
  /** Original text. Defaults to an empty string. */
  oldText?: string;
  /** New text. Defaults to an empty string. */
  newText?: string;
  /** Display mode — single-column unified or yan yana split. Default 'unified'. */
  mode?: DiffMode;
  /** Number of unchanged context lines to keep around each change. Default 3. */
  context?: number;
  /** When true, hide unchanged regions beyond `context` behind a "Show N more" button. */
  collapsible?: boolean;
  /**
   * Syntax language hint — accepted today, applied in M2 when the syntax-
   * highlight engine lands. Stored as a `data-language` attribute so themes
   * can react to it.
   */
  language?: string;
  /** Extra className on the root wrapper. */
  className?: string;

  // TODO M2: highlightSyntax?: boolean; theme?: 'light'|'dark'|'github'|'solarized';
  // TODO M3: threads?: CommentThread[]; onAddComment?: (...) => Promise<void>;
  // TODO M4: oldImage?: string; newImage?: string; oldJson?: unknown; newJson?: unknown;
  //          imageMode?: 'slider' | 'swipe' | 'onion' | '2-up';
  // TODO M5: virtualize?: boolean; messages?: Partial<DiffViewerMessages>;
};
