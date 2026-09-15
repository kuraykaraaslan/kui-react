// registry.test.ts — consistency checks over the committed registry
// snapshot. Runs in seconds against public/registry/components.json rather
// than rebuilding the live registry (which still needs a browser until
// phase 6.2, docs/dev/phase-6-architecture-refactors.md). Catches the class
// of AGENTS.md-convention violation that used to only be caught by manually
// reading the sidebar: a showcase entry with 1 variant, a dead composes[]
// reference, a filePath that no longer exists, a duplicated id/abbr.
//
// If this test fails right after `npm run registry:snapshot`, the snapshot
// itself is out of date — regenerate it (see docs/dev/phase-1-ci-and-gates.md
// section 1.2) before assuming the source data is wrong.

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Registry, RegistryComponent } from './registry.types';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const SNAPSHOT_PATH = path.join(REPO_ROOT, 'public/registry/components.json');

const registry: Registry = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8'));
const components = registry.components;
const byId = new Map(components.map((c) => [c.id, c]));

function describeComponent(c: RegistryComponent): string {
  return `${c.id} (${c.filePath})`;
}

describe('registry snapshot consistency', () => {
  it('has at least one component and one theme', () => {
    expect(components.length).toBeGreaterThan(0);
    expect(registry.themes.length).toBeGreaterThan(0);
  });

  it('every component id is globally unique', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const c of components) {
      if (seen.has(c.id)) {
        dupes.push(`"${c.id}" used by both ${seen.get(c.id)} and ${c.filePath}`);
      } else {
        seen.set(c.id, c.filePath);
      }
    }
    expect(dupes, dupes.join('\n')).toEqual([]);
  });

  // These two are real, large, pre-existing gaps (found by actually running
  // this test, not estimated) — 101 components reusing an abbreviation
  // already used by an earlier one, 29 with only 1 variant instead of the
  // AGENTS.md-required 2. Neither is a quick mechanical fix: a new abbr
  // needs picking without creating a fresh collision, and a second variant
  // needs someone to design a meaningfully different demo state, not
  // generate one. Ratcheted like docs/dev/phase-1-ci-and-gates.md section
  // 1.6's debt-ratchet: ✓ blocks *new* debt of this shape (the baseline
  // can only go down), ✗ doesn't block the PR that adds these tests on
  // fixing 130 pre-existing components in one sitting.
  //
  // Lower a baseline for real, then update the number here in the same PR.
  const ABBR_COLLISION_BASELINE = 101;
  const LOW_VARIANT_BASELINE = 29;

  it('component abbr collisions do not exceed the tracked baseline', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const c of components) {
      if (seen.has(c.abbr)) {
        dupes.push(`"${c.abbr}" used by both ${seen.get(c.abbr)} and ${describeComponent(c)}`);
      } else {
        seen.set(c.abbr, describeComponent(c));
      }
    }
    expect(
      dupes.length,
      `${dupes.length} abbr collisions (baseline ${ABBR_COLLISION_BASELINE}):\n${dupes.join('\n')}`,
    ).toBeLessThanOrEqual(ABBR_COLLISION_BASELINE);
  });

  it('every filePath exists on disk', () => {
    const missing = components
      .filter((c) => !existsSync(path.join(REPO_ROOT, c.filePath)))
      .map(describeComponent);
    expect(missing, missing.join('\n')).toEqual([]);
  });

  it('components with fewer than 2 variants do not exceed the tracked baseline (AGENTS.md rule)', () => {
    const tooFew = components
      .filter((c) => c.layer !== 'library' && c.layer !== 'theme')
      .filter((c) => c.variants.length < 2)
      .map((c) => `${describeComponent(c)} — ${c.variants.length} variant(s)`);
    expect(
      tooFew.length,
      `${tooFew.length} components with <2 variants (baseline ${LOW_VARIANT_BASELINE}):\n${tooFew.join('\n')}`,
    ).toBeLessThanOrEqual(LOW_VARIANT_BASELINE);
  });

  it('every composes[] id resolves to a real component', () => {
    const dangling: string[] = [];
    for (const c of components) {
      for (const dep of c.composes ?? []) {
        if (!byId.has(dep)) {
          dangling.push(`${describeComponent(c)} composes "${dep}", which does not exist`);
        }
      }
    }
    expect(dangling, dangling.join('\n')).toEqual([]);
  });

  it('every relatedTo[] id resolves to a real component', () => {
    const dangling: string[] = [];
    for (const c of components) {
      for (const rel of c.relatedTo ?? []) {
        if (!byId.has(rel)) {
          dangling.push(`${describeComponent(c)} relatedTo "${rel}", which does not exist`);
        }
      }
    }
    expect(dangling, dangling.join('\n')).toEqual([]);
  });

  it('every theme route has a matching app/theme/<vertical>/page.tsx', () => {
    const missing = registry.themes
      .filter((t) => {
        const vertical = t.route.replace(/^\/theme\//, '').replace(/\/$/, '');
        return !existsSync(path.join(REPO_ROOT, 'app/theme', vertical, 'page.tsx'));
      })
      .map((t) => `${t.id} — route ${t.route}`);
    expect(missing, missing.join('\n')).toEqual([]);
  });
});
