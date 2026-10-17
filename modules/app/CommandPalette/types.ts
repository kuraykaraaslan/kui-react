// Public types for the CommandPalette (M1 scope).
// TODO M2: add `enabled`, `perform`, `scope`, async loaders (`group`, `order`, `hidden` landed).
// TODO M3: add `children: Command[] | (() => Promise<Command[]>)`.
// TODO M4: add `shortcut` registry helpers.
// TODO M5: add `onSearch` async result types.
// TODO M6: add `theme` variants + plugin API.

export type CommandItem = {
  /** Optional leading icon (FontAwesome React element recommended). */
  icon?: React.ReactNode;
  /** Human-readable label, used for fuzzy matching + highlighting. */
  label: string;
  /** Keyboard shortcut hint (e.g. "G D", "⌘N"). */
  shortcut?: string;
  /** Group header (the legacy name; `group` wins when both are set). */
  category?: string;
  /** Group header. Commands with neither `group` nor `category` fall under "Commands". */
  group?: string;
  /**
   * Position while the search is empty, like CSS `order`: missing counts as 0, ties keep
   * registration order. Groups rank by their lowest order. A typed query ranks by match score.
   */
  order?: number;
  /** Leave the command out (a module that is off, a permission the viewer lacks). */
  hidden?: boolean;
  /** Click handler invoked on select. */
  onClick?: () => void;
  /** Extra keywords boosted during fuzzy match. */
  keywords?: string[];
  /** Optional description shown after the label. */
  description?: string;
  /** Stable id (auto-derived from label if omitted). */
  id?: string;
};

export type CommandGroup = {
  /** The group's header (named `category` for backwards compatibility). */
  category: string;
  items: ScoredCommand[];
};

/** A command paired with its fuzzy score + highlight ranges. */
export type ScoredCommand = {
  item: CommandItem;
  score: number;
  /** Indices in `item.label` that matched the query (for <mark> highlighting). */
  matches: number[];
};

export type CommandPaletteProps = {
  /** Initial commands. Merged with the dynamic store registry. */
  items?: CommandItem[];
  /** Fires when the user selects a command. */
  onSelect?: (item: CommandItem) => void;
  /** Custom trigger element. Falls back to a default "Quick actions…" button. */
  trigger?: React.ReactNode;
  /** Search input placeholder. */
  placeholder?: string;
  /**
   * Fill the palette with the sample commands (`DEMO_COMMANDS`) when `items` is not given.
   * Off by default: a real host lists only the commands it passes or registers.
   */
  demo?: boolean;
  // TODO M2: shortcut, theme, showRecent, recentLimit, messages, onCommandRun.
};
