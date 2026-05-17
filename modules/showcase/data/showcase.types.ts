export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

export type ShowcaseVariant = {
  title: string;
  preview: React.ReactNode;
  code: string;
  layout?: 'side' | 'stack';
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

export type ShowcaseComponent = {
  id: string;
  title: string;
  category: 'Atom' | 'Molecule' | 'Organism' | 'App' | 'Domain';
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
};
