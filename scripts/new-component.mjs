#!/usr/bin/env node
// npm run new:component <layer> <Name> — scaffolds a new component,
// registered in the showcase and covered by a test file, replacing the
// five-step manual procedure in AGENTS.md's "Adding a new component to
// the showcase" section. Per docs/dev/phase-7-showcase-and-dx.md 7.6.
//
// <layer> is one of: ui, app, domains/<vertical> (vertical must already
// have a NAV_GROUPS entry — see VERTICAL_LABELS below).
//
// Writes:
//   modules/<layer>/<Name>.tsx                          — the component
//   modules/<layer>/<Name>.test.tsx                      — a render test
//   modules/showcase/data/sections/new-<id>.showcase.tsx — showcase entry
// Edits:
//   modules/showcase/data/showcase.data.tsx  — adds the import + spread
//   modules/showcase/data/showcase.menu.ts   — adds a NAV_GROUPS entry
//
// Does NOT run `npm run registry:snapshot` — prints a reminder instead,
// since the snapshot should reflect a component you've actually looked
// at, not the bare scaffold.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

const [, , layerArg, nameArg, ...rest] = process.argv;
const categoryFlagIdx = rest.indexOf('--category');
const categoryArg = categoryFlagIdx !== -1 ? rest[categoryFlagIdx + 1] : undefined;

if (!layerArg || !nameArg) {
  console.error('Usage: npm run new:component <ui|app|domains/<vertical>> <Name> [--category Atom|Molecule|Organism]');
  console.error('Example: npm run new:component ui Callout');
  console.error('Example: npm run new:component domains/commerce PriceTag');
  process.exit(1);
}

if (!/^[A-Z][A-Za-z0-9]*$/.test(nameArg)) {
  console.error(`Name must be PascalCase (e.g. "Callout"), got: ${nameArg}`);
  process.exit(1);
}

// Vertical folder name -> exact NAV_GROUPS label already in showcase.menu.ts.
// Only verticals that already have a group can receive a scaffolded entry —
// a brand-new vertical needs its own showcase.menu.ts group added by hand
// first (AGENTS.md "Adding a new theme", step 3).
const VERTICAL_LABELS = {
  common: 'Domain — Common',
  reviews: 'Domain — Reviews',
  event: 'Domain — Event',
  blog: 'Domain — Blog',
  landing: 'Domain — Landing',
  'api-doc': 'Domain — API Doc',
  jobs: 'Domain — Jobs',
  fintech: 'Domain — Fintech',
  commerce: 'Domain — Commerce',
  media: 'Domain — Media',
  forum: 'Domain — Forum',
  'real-estate': 'Domain — Real Estate',
  food: 'Domain — Food',
  travel: 'Domain — Travel',
  ai: 'Domain — AI',
  social: 'Domain — Social',
  iot: 'Domain — IoT',
  nft: 'Domain — NFT',
};

let layer = layerArg;
let vertical = null;
if (layerArg.startsWith('domains/')) {
  vertical = layerArg.slice('domains/'.length);
  if (!VERTICAL_LABELS[vertical]) {
    console.error(`Unknown vertical "${vertical}". Known: ${Object.keys(VERTICAL_LABELS).join(', ')}`);
    console.error('A brand-new vertical needs its own showcase.menu.ts group added by hand first.');
    process.exit(1);
  }
  layer = 'domains';
} else if (layer !== 'ui' && layer !== 'app') {
  console.error(`<layer> must be "ui", "app", or "domains/<vertical>", got: ${layerArg}`);
  process.exit(1);
}

const category = categoryArg ?? (layer === 'ui' ? 'Atom' : layer === 'app' ? 'App' : 'Domain');
if (!['Atom', 'Molecule', 'Organism', 'App', 'Domain'].includes(category)) {
  console.error(`--category must be one of Atom, Molecule, Organism (got: ${category})`);
  process.exit(1);
}

const id = nameArg
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();

const abbr = (nameArg.match(/[A-Z]/g) ?? [nameArg[0]]).slice(0, 2).join('');

const componentDir = vertical ? path.join('modules/domains', vertical) : path.join('modules', layer);
const componentRelPath = path.join(componentDir, `${nameArg}.tsx`);
const componentAbsPath = path.join(REPO_ROOT, componentRelPath);
const testRelPath = path.join(componentDir, `${nameArg}.test.tsx`);
const testAbsPath = path.join(REPO_ROOT, testRelPath);
const showcaseRelPath = path.join('modules/showcase/data/sections', `new-${id}.showcase.tsx`);
const showcaseAbsPath = path.join(REPO_ROOT, showcaseRelPath);

for (const p of [componentAbsPath, testAbsPath, showcaseAbsPath]) {
  if (existsSync(p)) {
    console.error(`Refusing to overwrite existing file: ${path.relative(REPO_ROOT, p)}`);
    process.exit(1);
  }
}

// ── modules/<layer>/<Name>.tsx — AGENTS.md's "Component Pattern Template" ──
const componentSource = `'use client';
import { cn } from '@/libs/utils/cn';

type ${nameArg}Variant = 'primary' | 'secondary';

const variantClasses: Record<${nameArg}Variant, string> = {
  primary:   'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
};

type ${nameArg}Props = {
  variant?: ${nameArg}Variant;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function ${nameArg}({
  variant = 'primary',
  children,
  className,
  ...rest
}: ${nameArg}Props) {
  return (
    <div
      className={cn(
        'rounded-md px-4 py-2 font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
`;

mkdirSync(componentDir, { recursive: true });
writeFileSync(componentAbsPath, componentSource);

// ── modules/<layer>/<Name>.test.tsx ──
const testSource = `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${nameArg} } from './${nameArg}';

describe('${nameArg}', () => {
  it('renders its children', () => {
    render(<${nameArg}>Hello</${nameArg}>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies the variant class', () => {
    render(<${nameArg} variant="secondary">Hello</${nameArg}>);
    expect(screen.getByText('Hello').className).toContain('bg-secondary');
  });
});
`;
writeFileSync(testAbsPath, testSource);

// ── modules/showcase/data/sections/new-<id>.showcase.tsx ──
// Embeds the source verbatim (readFileSync'd at scaffold time, then
// baked in as a literal — this codebase's showcase files hand-embed
// sourceCode as a string rather than fs.readFileSync at module-load
// time, since these files are 'use client' and fs isn't available in
// the browser bundle). Escape backticks/${ so the literal doesn't break.
const escapedSource = componentSource.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const showcaseImportPath = vertical ? `@/modules/domains/${vertical}/${nameArg}` : `@/modules/${layer}/${nameArg}`;
const buildFnName = `build${nameArg}ScaffoldData`;

const showcaseSource = `'use client';
import { ${nameArg} } from '${showcaseImportPath}';
import type { ShowcaseComponent } from '../showcase.types';

// Scaffolded by scripts/new-component.mjs — fill in a real description
// and at least one more variant before shipping (AGENTS.md's showcase
// convention wants >= 2).
export function ${buildFnName}(): ShowcaseComponent[] {
  return [
    {
      id: '${id}',
      title: '${nameArg}',
      category: '${category}',
      abbr: '${abbr}',
      description: 'TODO: describe ${nameArg}.',
      filePath: '${componentRelPath.replace(/\\/g, '/')}',
      sourceCode: \`${escapedSource}\`,
      variants: [
        {
          title: 'Default',
          preview: <${nameArg}>Hello</${nameArg}>,
          code: \`<${nameArg}>Hello</${nameArg}>\`,
        },
        {
          title: 'Secondary',
          preview: <${nameArg} variant="secondary">Hello</${nameArg}>,
          code: \`<${nameArg} variant="secondary">Hello</${nameArg}>\`,
        },
      ],
    },
  ];
}
`;
writeFileSync(showcaseAbsPath, showcaseSource);

// ── modules/showcase/data/showcase.data.tsx — add import + spread ──
const dataPath = path.join(REPO_ROOT, 'modules/showcase/data/showcase.data.tsx');
let dataSource = readFileSync(dataPath, 'utf8');
const importLine = `import { ${buildFnName} } from './sections/new-${id}.showcase';\n`;
const lastImportMatch = [...dataSource.matchAll(/^import .*;\n/gm)].pop();
if (!lastImportMatch) {
  console.error('Could not find an import line in showcase.data.tsx to anchor the new import after.');
  process.exit(1);
}
const importInsertAt = lastImportMatch.index + lastImportMatch[0].length;
dataSource = dataSource.slice(0, importInsertAt) + importLine + dataSource.slice(importInsertAt);

const spreadLine = `    ...${buildFnName}(),\n`;
const returnArrayMatch = dataSource.match(/return \[\n/);
if (!returnArrayMatch) {
  console.error('Could not find "return [" in showcase.data.tsx to anchor the new spread after.');
  process.exit(1);
}
const spreadInsertAt = returnArrayMatch.index + returnArrayMatch[0].length;
dataSource = dataSource.slice(0, spreadInsertAt) + spreadLine + dataSource.slice(spreadInsertAt);
writeFileSync(dataPath, dataSource);

// ── modules/showcase/data/showcase.menu.ts — add a NAV_GROUPS entry ──
const menuPath = path.join(REPO_ROOT, 'modules/showcase/data/showcase.menu.ts');
let menuSource = readFileSync(menuPath, 'utf8');
const groupLabel = layer === 'ui' ? (category === 'Molecule' ? 'Molecules' : category === 'Organism' ? 'Organisms' : 'Atoms')
  : layer === 'app' ? 'App Concepts'
  : VERTICAL_LABELS[vertical];

const groupHeaderRe = new RegExp(`label: '${groupLabel.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}'[\\s\\S]*?items: \\[\\n`);
const groupMatch = menuSource.match(groupHeaderRe);
if (!groupMatch) {
  console.error(`Could not find the "${groupLabel}" NAV_GROUPS entry in showcase.menu.ts.`);
  console.error('Add the component to the menu by hand.');
} else {
  const menuInsertAt = groupMatch.index + groupMatch[0].length;
  const menuLine = `      { id: '${id}', title: '${nameArg}', category: '${category}', abbr: '${abbr}', since: '${new Date().toISOString().slice(0, 7)}' },\n`;
  menuSource = menuSource.slice(0, menuInsertAt) + menuLine + menuSource.slice(menuInsertAt);
  writeFileSync(menuPath, menuSource);
}

console.log(`Scaffolded ${nameArg}:`);
console.log(`  ${componentRelPath}`);
console.log(`  ${testRelPath}`);
console.log(`  ${showcaseRelPath}`);
console.log(`  + import/spread in modules/showcase/data/showcase.data.tsx`);
if (groupMatch) console.log(`  + nav entry in modules/showcase/data/showcase.menu.ts ("${groupLabel}")`);
console.log('');
console.log('Next steps:');
console.log(`  1. Fill in the real description and a second meaningful variant in ${showcaseRelPath}.`);
console.log(`  2. Build the actual component (the scaffold is AGENTS.md's generic template).`);
console.log('  3. Run `npm run registry:snapshot` once you\'re happy with it.');
