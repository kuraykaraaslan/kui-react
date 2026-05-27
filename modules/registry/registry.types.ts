// Type definitions for the machine-readable component registry consumed by
// AI tools, code generators, and copy-paste workflows.
//
// The registry is built at runtime from showcase data + the sidebar menu —
// see `modules/registry/registry.ts`. It is exposed at `/api/registry` and a
// static snapshot lives at `public/registry/components.json`.

import type { ComponentStatus, A11yMetadata, ExternalLibraryLinks } from '@/modules/showcase/data/showcase.types';

export type RegistryLayer = 'ui' | 'app' | 'domain' | 'theme' | 'library';

export type RegistryCategory =
  | 'Atom'
  | 'Molecule'
  | 'Organism'
  | 'App'
  | 'Domain'
  | 'Theme'
  | 'Library';

export type RegistryVariant = {
  title: string;
  code: string;
};

export type RegistryComponent = {
  /** Stable identifier — matches the showcase menu id and is URL-safe. */
  id: string;
  /** Display name; matches the file export name when there is exactly one. */
  name: string;
  /** Module-layer bucket. */
  layer: RegistryLayer;
  /** Atomic-design category as used in the sidebar. */
  category: RegistryCategory;
  /** Repo-relative source path. */
  filePath: string;
  /** Two-letter sidebar abbreviation. */
  abbr: string;
  /** Short human description (from showcase entry). */
  description: string;
  /** Inlined source code string (verbatim from showcase entry). */
  source: string;
  /** Compact, copy-paste-friendly variant snippets. */
  variants: RegistryVariant[];
  /** Status badge: stable | beta | deprecated. */
  status: ComponentStatus;
  /** YYYY-MM the component was first added. */
  since?: string;
  /** Optional 1–2 sentence guidance. */
  whenToUse?: string;
  /** Optional anti-pattern guidance. */
  whenNotToUse?: string;
  /** Component IDs this composes from. */
  composes?: string[];
  /** Sibling components a caller may also want. */
  relatedTo?: string[];
  /** Components/themes that import this one (inverse index). */
  usedBy?: string[];
  /** Accessibility metadata. */
  a11y?: A11yMetadata;
  /** CSS-variable design tokens consumed. */
  designTokens?: string[];
  /** npm packages required at runtime (excluding React + Next + this lib). */
  dependencies?: string[];
  /** Upstream links when this entry wraps a third-party npm package. */
  external?: ExternalLibraryLinks;
};

export type RegistryTheme = {
  id: string;
  title: string;
  route: string;
  consumesDomain: string;
  since?: string;
  status: ComponentStatus;
};

export type RegistryToken = {
  name: string;       // CSS variable e.g. '--primary'
  light: string;      // value in light mode
  dark?: string;      // value in dark mode if overridden
  purpose: string;
};

export type Registry = {
  $schema: string;
  /** Library name, currently 'kui-react'. */
  name: string;
  /** Library version from package.json. */
  version: string;
  /** Registry schema version (bumped on breaking shape changes). */
  registryVersion: string;
  generatedAt: string;
  description: string;
  /** Plain-English explainer of where each layer lives. */
  layers: Record<RegistryLayer, string>;
  /** Conventions a code generator should follow when emitting components. */
  conventions: {
    icons: string;
    styling: string;
    types: string;
    accessibility: string;
    fileNaming: string;
    pathAlias: string;
  };
  /** Design tokens defined in app/globals.css. */
  designTokens: RegistryToken[];
  components: RegistryComponent[];
  themes: RegistryTheme[];
};
