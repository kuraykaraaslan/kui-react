// Public types for the CommandPalette (M1 scope).
// TODO M2: add `enabled`, `perform`, `scope`, async loaders.
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
  /** Group / category header. */
  category: string;
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
  // TODO M2: shortcut, theme, showRecent, recentLimit, messages, onCommandRun.
};
