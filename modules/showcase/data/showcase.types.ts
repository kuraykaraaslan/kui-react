export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

export type ShowcaseVariant = {
  title: string;
  preview: React.ReactNode;
  /** Source snippet for the right-hand "Code" pane. When null/undefined/empty the code pane is omitted and the preview takes the full width. */
  code?: string | null;
  layout?: 'side' | 'stack';
  /** Extra Tailwind classes appended to the outer preview area (height, padding, alignment). Conflicts are resolved by tailwind-merge. */
  previewClassName?: string;
  /** Extra Tailwind classes appended to the inner wrapper around `preview` (e.g. `h-full` for fill-the-pane content). */
  previewInnerClassName?: string;
};

export type ControlDef =
  | { key: string; label: string; type: 'select'; options: readonly string[]; default: string }
  | { key: string; label: string; type: 'boolean'; default: boolean }
  | { key: string; label: string; type: 'text'; default: string }
  | { key: string; label: string; type: 'number'; min?: number; max?: number; step?: number; default: number };

export type PlaygroundDef = {
  controls: ControlDef[];
  render: (props: Record<string, unknown>) => React.ReactNode;
  generateCode?: (props: Record<string, unknown>) => string;
};

export type WcagLevel = 'A' | 'AA' | 'AAA';

export type KeyboardInteraction = {
  keys: string;
  action: string;
};

export type A11yMetadata = {
  wcagLevel?: WcagLevel;
  ariaPatterns?: string[];
  keyboardInteractions?: KeyboardInteraction[];
  notes?: string;
};

/**
 * External library metadata. Set on showcase entries that wrap a third-party
 * npm package (e.g. `kui-viewer`). The ShowcaseDetail header renders a small
 * info popover with these links so users can jump to the upstream sources.
 */
export type ExternalLibraryLinks = {
  /** Display label for the package, defaults to the showcase title. */
  packageName?: string;
  /** Published version (semver) — shown next to the package name. */
  version?: string;
  /** Generic homepage / project URL (often the README on GitHub). */
  homepage?: string;
  /** Standalone marketing / documentation site, distinct from `homepage`. */
  website?: string;
  /** npm registry page (https://www.npmjs.com/package/...). */
  npm?: string;
  /** GitHub repository URL. */
  github?: string;
};

export type ShowcaseComponent = {
  id: string;
  title: string;
  category: 'Atom' | 'Molecule' | 'Organism' | 'App' | 'Domain' | 'Library';
  abbr: string;
  description: string;
  filePath: string;
  sourceCode: string;
  variants: ShowcaseVariant[];
  status?: ComponentStatus;
  since?: string;
  playground?: PlaygroundDef;

  // Optional AI-discoverability metadata. All optional so existing entries
  // remain backward compatible. Surfaced via /api/registry and llms.txt.
  whenToUse?: string;
  whenNotToUse?: string;
  composes?: string[];        // component IDs this depends on
  relatedTo?: string[];       // sibling component IDs
  a11y?: A11yMetadata;
  designTokens?: string[];    // CSS variable names consumed
  dependencies?: string[];    // npm packages required at runtime

  /**
   * Remote-library links. When set, the showcase detail header renders an
   * info popover with clickable shortcuts to the upstream homepage, npm
   * page, and GitHub repository. Use this for entries that wrap a
   * third-party package rather than first-party code in this repo.
   */
  external?: ExternalLibraryLinks;
};
