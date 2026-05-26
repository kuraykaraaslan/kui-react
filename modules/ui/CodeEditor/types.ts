// modules/ui/CodeEditor/types.ts
//
// CodeEditor — shared public + engine-internal types.
//
// Pixel-identical EJS sibling at modules/ui/CodeEditor/CodeEditor.ejs.
//
// M1 implements: engine flag (default codemirror — falls back to a textarea-
// based engine when CodeMirror 6 is not installed), language prop (data attr
// only in fallback), light/dark/high-contrast theme, readonly, placeholder.
//
// TODO M2: find/replace, multi-cursor, comment toggle, bracket matching,
//          format-on-save, toolbar (Toolbar.tsx + parts/Toolbar).
// TODO M3: diagnostics (markers), autocomplete (getSuggestions), hover,
//          extraLibs (TS type defs).
// TODO M4: minimap, code folding, vim/emacs keymap, snippet expansion,
//          collaborative cursor, split diff view.
// TODO M5: a11y mode (screen reader), reduced motion, messages prop (i18n).

export type Lang =
  | 'js'
  | 'ts'
  | 'json'
  | 'html'
  | 'css'
  | 'sql'
  | 'python'
  | 'yaml'
  | 'markdown'
  | 'plaintext';

export type CodeEditorEngine = 'codemirror' | 'monaco';

export type CodeEditorTheme = 'light' | 'dark' | 'high-contrast';

// TODO M3: full Marker shape — severity, source, code, fix actions.
export type Marker = {
  line: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  severity: 'error' | 'warning' | 'info' | 'hint';
  message: string;
};

// TODO M3: SuggestContext / Suggestion / HoverContext / Hover when wiring
//          custom completion + hover providers.
export type SuggestContext = {
  language: Lang;
  value: string;
  cursor: { line: number; column: number };
  triggerCharacter?: string;
};

export type Suggestion = {
  label: string;
  insertText?: string;
  detail?: string;
  documentation?: string;
};

export type HoverContext = {
  language: Lang;
  value: string;
  word: string;
  cursor: { line: number; column: number };
};

export type Hover = {
  contents: string;
};

export type CodeEditorMessages = {
  placeholder: string;
  loading: string;
  readOnlyLabel: string;
};

export type CodeEditorProps = {
  /** Editor value (controlled). */
  value: string;
  /** Change handler — receives the full updated source. */
  onChange?: (next: string) => void;

  /** Source language. Used for syntax highlighting + auto-indent hints. */
  language?: Lang;

  /** Visual theme. `light` | `dark` | `high-contrast`. */
  theme?: CodeEditorTheme;

  /** Engine implementation. Defaults to `codemirror` (lightweight). */
  engine?: CodeEditorEngine;

  /** Read-only mode — disables editing but keeps selection / copy. */
  readonly?: boolean;

  /** Placeholder text when the value is empty. */
  placeholder?: string;

  /** Visible label rendered above the editor. */
  label?: string;

  /** Helper text under the editor. */
  hint?: string;

  /** Error text — when present switches the border to error tones. */
  error?: string;

  /** Minimum height in px. Default 200. */
  minHeight?: number;

  /** Whether to show the line-number gutter. Default `true`. */
  showLineNumbers?: boolean;

  /** Stable id — used by the label/textarea for `htmlFor` + ARIA. */
  id?: string;

  /** Form name — when set, registers a hidden input synced to `value`. */
  name?: string;

  /** Wrapper class. */
  className?: string;

  // ── M2+ (declared so callers can opt-in early; engine ignores in M1) ──────
  // TODO M2:
  showToolbar?: boolean;
  formatOnSave?: boolean;
  // TODO M3:
  markers?: Marker[];
  getSuggestions?: (ctx: SuggestContext) => Suggestion[] | Promise<Suggestion[]>;
  getHover?: (ctx: HoverContext) => Hover | Promise<Hover>;
  extraLibs?: { path: string; content: string }[];
  // TODO M4:
  showMinimap?: boolean;
  keymap?: 'default' | 'vim' | 'emacs';
  // TODO M5:
  messages?: Partial<CodeEditorMessages>;
};

/** Shared shape every engine implementation accepts — keeps engines swap-
 * compatible behind the public CodeEditorProps surface. */
export type CodeEditorEngineProps = Required<
  Pick<
    CodeEditorProps,
    | 'value'
    | 'language'
    | 'theme'
    | 'readonly'
    | 'placeholder'
    | 'minHeight'
    | 'showLineNumbers'
  >
> & {
  id?: string;
  name?: string;
  className?: string;
  onChange?: (next: string) => void;
  // TODO M3: markers / getSuggestions / getHover / extraLibs forwarded here.
};
