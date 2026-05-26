'use client';
// modules/showcase/data/sections/ui-molecule-diff-viewer.showcase.tsx
//
// Showcase entries for the DiffViewer Molecule (M1). Sibling EJS showcase
// lives at src/data/sections/ui-molecule-diff-viewer.showcase.ts.

import { DiffViewer } from '@/modules/ui/DiffViewer';
import type { ShowcaseComponent } from '../showcase.types';

const SAMPLE_OLD = `function greet(name) {
  console.log("Hello, " + name);
}

greet("world");
`;

const SAMPLE_NEW = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("world");
greet("kui");
`;

const LONG_OLD = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };
  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
`;

const LONG_NEW = `import { useState, useCallback } from 'react';

export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []);
  const handleReset = () => setCount(initial);
  return (
    <div className="flex gap-2">
      <button onClick={handleClick}>
        Clicked {count} times
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
`;

export function buildMoleculeDiffViewerData(): ShowcaseComponent[] {
  return [
    {
      id: 'diff-viewer',
      title: 'DiffViewer',
      category: 'Molecule',
      abbr: 'Dv',
      description:
        'Line-based text diff viewer with unified (GitHub-style) and split (yan yana) modes. M1 ships a zero-dep LCS algorithm, hunk headers in `@@ -old,n +new,n @@` form, old/new line-number gutters, configurable context window, and optional collapsible unchanged regions. Pixel-identical EJS sibling at modules/ui/DiffViewer/DiffViewer.ejs.',
      filePath: 'modules/ui/DiffViewer/index.tsx',
      sourceCode: `'use client';
import { DiffViewer } from '@/modules/ui/DiffViewer';

// Unified (default) — GitHub-style single column.
<DiffViewer oldText={oldSrc} newText={newSrc} />

// Split — yan yana, scroll-synced.
<DiffViewer oldText={oldSrc} newText={newSrc} mode="split" />

// Custom context window + collapsible unchanged regions.
<DiffViewer
  oldText={oldSrc}
  newText={newSrc}
  context={2}
  collapsible
/>

// Language hint — applied as a data-language attribute today; the M2
// syntax-highlight engine will pick it up automatically.
<DiffViewer oldText={oldSrc} newText={newSrc} language="ts" />`,
      since: '2026-05',
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['region', 'separator'],
        keyboardInteractions: [
          { keys: 'Tab',   action: 'Move focus into the diff region' },
          { keys: 'Enter', action: 'Expand a collapsed unchanged run (when collapsible=true)' },
        ],
        notes: 'TODO M5: J/K next/prev change, N/P next/prev file, full roving tabindex + screen-reader line announcements.',
      },
      designTokens: [
        '--surface-base', '--surface-overlay', '--surface-sunken',
        '--text-primary', '--text-secondary', '--text-disabled',
        '--border', '--border-focus',
        '--success', '--success-subtle',
        '--error', '--error-subtle',
      ],
      variants: [
        {
          title: 'Unified (default)',
          layout: 'stack' as const,
          preview: <DiffViewer oldText={SAMPLE_OLD} newText={SAMPLE_NEW} />,
          code: `<DiffViewer oldText={oldSrc} newText={newSrc} />`,
        },
        {
          title: 'Split (yan yana)',
          layout: 'stack' as const,
          preview: <DiffViewer oldText={SAMPLE_OLD} newText={SAMPLE_NEW} mode="split" />,
          code: `<DiffViewer oldText={oldSrc} newText={newSrc} mode="split" />`,
        },
        {
          title: 'With context=1',
          layout: 'stack' as const,
          preview: <DiffViewer oldText={LONG_OLD} newText={LONG_NEW} context={1} />,
          code: `<DiffViewer oldText={oldSrc} newText={newSrc} context={1} />`,
        },
        {
          title: 'Collapsible unchanged context',
          layout: 'stack' as const,
          preview: <DiffViewer oldText={LONG_OLD} newText={LONG_NEW} context={3} collapsible />,
          code: `<DiffViewer
  oldText={oldSrc}
  newText={newSrc}
  context={3}
  collapsible
/>`,
        },
      ],
    },
  ];
}
