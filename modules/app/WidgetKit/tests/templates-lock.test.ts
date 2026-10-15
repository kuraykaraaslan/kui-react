import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { BUILTIN_KINDS } from '../templates';
import { CORE_BOARD, CORE_CARD, CORE_FORMAT } from '../settings/core';
import { migrate, templateDefaults } from '../settings/engine';
import type { SettingsTemplate, TemplateField } from '../settings/types';

/**
 * The versioning guard (next-boilerplate phase 21, D-21.6).
 *
 * `templates.lock.json` records every field of every template at its version: type, default, options,
 * sub-fields. A recorded field may not change or disappear while the version stays the same: change it
 * by bumping the version and appending a migration step (the lock then gains the new version). Adding a
 * field, an option or presentation (labels, groups, `advanced`) needs no bump.
 *
 * `fixtures/<template id>/v<N>.json` are stored settings written by version N with the expected result
 * at the current version. Inputs are append-only: an old placement must keep migrating forever.
 *
 * Regenerate after an intended bump: `UPDATE_TEMPLATE_LOCK=1 npx vitest run modules/app/WidgetKit/tests/templates-lock.test.ts`.
 */
const DIR = resolve(import.meta.dirname);
const LOCK = resolve(DIR, 'templates.lock.json');
const FIXTURES = resolve(DIR, 'fixtures');
const UPDATE = process.env.UPDATE_TEMPLATE_LOCK === '1';

const ALL: SettingsTemplate[] = [CORE_CARD, CORE_FORMAT, CORE_BOARD, ...BUILTIN_KINDS.map((k) => k.template)];

type LockedField = { type: string; value?: unknown; options?: string[]; fields?: Record<string, LockedField> };
type Lock = Record<string, Record<string, LockedField>>; // `${id}@${version}` → fields

const optionValues = (f: TemplateField | NonNullable<TemplateField['fields']>[string]) =>
  f.options?.map((o) => (typeof o === 'string' ? o : o.value));

function lockField(f: TemplateField | NonNullable<TemplateField['fields']>[string]): LockedField {
  const out: LockedField = { type: f.type };
  if (f.value !== undefined) out.value = f.value;
  const opts = optionValues(f);
  if (opts?.length) out.options = opts;
  if (f.fields) out.fields = Object.fromEntries(Object.entries(f.fields).map(([k, sub]) => [k, lockField(sub)]));
  return out;
}

const lockOf = (t: SettingsTemplate) => Object.fromEntries(Object.entries(t.fields).map(([k, f]) => [k, lockField(f)]));

/** Problems with `now` against what was locked for the same id@version (additions are fine). */
function breaking(locked: Record<string, LockedField>, now: Record<string, LockedField>, path = ''): string[] {
  const out: string[] = [];
  for (const [k, was] of Object.entries(locked)) {
    const is = now[k];
    const p = `${path}${k}`;
    if (!is) { out.push(`${p} was removed`); continue; }
    if (is.type !== was.type) out.push(`${p} changed type ${was.type} → ${is.type}`);
    if (JSON.stringify(is.value) !== JSON.stringify(was.value)) out.push(`${p} changed its default`);
    for (const o of was.options ?? []) if (!(is.options ?? []).includes(o)) out.push(`${p} lost the option "${o}"`);
    if (was.fields) out.push(...breaking(was.fields, is.fields ?? {}, `${p}.`));
  }
  return out;
}

const readLock = (): Lock => (existsSync(LOCK) ? JSON.parse(readFileSync(LOCK, 'utf8')) : {});

if (UPDATE) {
  const lock = readLock();
  for (const t of ALL) lock[`${t.id}@${t.version}`] = lockOf(t);
  writeFileSync(LOCK, `${JSON.stringify(lock, null, 2)}\n`);
  for (const t of ALL) {
    const dir = resolve(FIXTURES, t.id.replace(':', '__'));
    const file = resolve(dir, `v${t.version}.json`);
    if (existsSync(file)) continue; // inputs are append-only
    mkdirSync(dir, { recursive: true });
    const input = { ...templateDefaults(t) };
    writeFileSync(file, `${JSON.stringify({ input, expected: migrate(t, input, t.version).values }, null, 2)}\n`);
  }
}

describe('template lock (a field change without a version bump fails)', () => {
  const lock = readLock();
  it.each(ALL.map((t) => [`${t.id}@${t.version}`, t] as const))('%s matches its lock', (key, t) => {
    expect(lock[key], `${key} is not locked yet: run with UPDATE_TEMPLATE_LOCK=1 and commit the lock`).toBeDefined();
    const problems = breaking(lock[key], lockOf(t));
    expect(problems, `${key}: bump the version and add a migration step instead:\n${problems.join('\n')}`).toEqual([]);
  });

  it('every older locked version still has its migration step (steps are never deleted)', () => {
    for (const key of Object.keys(lock)) {
      const [id, v] = key.split('@');
      const t = ALL.find((x) => x.id === id);
      if (!t) continue; // a retired template keeps its stub elsewhere
      const n = Number(v);
      expect(n, `${key} is newer than the code`).toBeLessThanOrEqual(t.version);
      for (let i = n; i < t.version; i++) expect(t.migrations[i - 1], `${id} has no step ${i} → ${i + 1}`).toBeDefined();
    }
  });
});

describe('golden fixtures (old settings keep migrating)', () => {
  const dirs = existsSync(FIXTURES) ? readdirSync(FIXTURES) : [];
  it('every template has at least its current version as a fixture', () => {
    for (const t of ALL) expect(dirs, `${t.id}: run with UPDATE_TEMPLATE_LOCK=1`).toContain(t.id.replace(':', '__'));
  });
  for (const d of dirs) {
    const t = ALL.find((x) => x.id.replace(':', '__') === d);
    for (const f of readdirSync(resolve(FIXTURES, d)).filter((n) => /^v\d+\.json$/.test(n))) {
      it(`${d}/${f} migrates to the expected current settings`, () => {
        expect(t, `${d}: no template`).toBeDefined();
        const { input, expected } = JSON.parse(readFileSync(resolve(FIXTURES, d, f), 'utf8'));
        const from = Number(f.slice(1, -5));
        const res = migrate(t!, input, from);
        expect(res.values).toEqual(expected);
        expect(migrate(t!, res.values, t!.version).values).toBe(res.values); // idempotent at the fixed point
      });
    }
  }
});
