import { describe, it, expect } from 'vitest';
import { BUILTIN_KINDS } from '../templates';
import { BUILTIN_VIEWS } from '../views';
import { CORE_BOARD, CORE_CARD, CORE_FORMAT } from '../settings/core';
import { templateDefaults, validate } from '../settings/engine';

const ALL = [...BUILTIN_KINDS.map((k) => k.template), CORE_CARD, CORE_FORMAT, CORE_BOARD];

describe('every template', () => {
  it.each(ALL.map((t) => [t.id, t] as const))('%s is well formed', (_id, t) => {
    expect(t.version).toBeGreaterThanOrEqual(1);
    expect(t.migrations).toHaveLength(t.version - 1);
    t.migrations.forEach((m, i) => { expect(m.from).toBe(i + 1); expect(m.to).toBe(i + 2); });
    const groups = new Set(t.groups.map((g) => g.id));
    for (const [k, f] of Object.entries(t.fields)) {
      expect(k).toMatch(/^[a-zA-Z][a-zA-Z0-9_]*$/);
      expect(f.since).toBeGreaterThanOrEqual(1);
      expect(f.since).toBeLessThanOrEqual(t.version);
      if (f.group) expect(groups.has(f.group), `${t.id}.${k} group ${f.group}`).toBe(true);
    }
    expect(validate(t, templateDefaults(t)).issues).toEqual([]);
  });

  it('ids are unique', () => {
    expect(new Set(ALL.map((t) => t.id)).size).toBe(ALL.length);
  });
});

describe('every builtin kind', () => {
  it.each(BUILTIN_KINDS.map((k) => [k.type, k] as const))('%s has a view, a template id that matches and sane geometry', (type, k) => {
    expect(BUILTIN_VIEWS[type]).toBeDefined();
    expect(k.template.id).toBe(`builtin:${type}`);
    expect(k.template.namespace).toBe('');
    expect(k.defaultW).toBeGreaterThanOrEqual(1);
    expect(k.defaultW).toBeLessThanOrEqual(12);
    const keys = k.slots.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
    // a card default must be a real core:card value
    if (k.template.cardDefaults) expect(validate(CORE_CARD, k.template.cardDefaults).issues).toEqual([]);
    if (k.template.formatDefaults) expect(validate(CORE_FORMAT, k.template.formatDefaults).issues).toEqual([]);
  });
});
