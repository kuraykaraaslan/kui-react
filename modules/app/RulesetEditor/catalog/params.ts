import type { BlockDecl, ParamIssue, ParamSpec, WhenCondition } from './types';

export type ParamValues = Record<string, unknown>;

function sameValue(a: unknown, b: unknown): boolean {
  // loose on purpose: a stored 1 matches an option written as "1"
  return a == b;
}

/** Is a field shown for these values? The compared value falls back to the default of the other param. */
export function isVisible(spec: Pick<ParamSpec, 'when'>, values: ParamValues, schema?: Record<string, ParamSpec>): boolean {
  const when: WhenCondition | undefined = spec.when;
  if (!when || when.param == null) return true;
  const current = values[when.param] ?? schema?.[when.param]?.default;
  if (Array.isArray(when.not)) return !when.not.some((v) => sameValue(v, current));
  if (when.value === undefined) return true;
  return Array.isArray(when.value) ? when.value.some((v) => sameValue(v, current)) : sameValue(when.value, current);
}

function cloneValue<T>(value: T): T {
  return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}

/** Param values of a new node: every declared default, copied. Params stored in `script` are not included. */
export function defaultParams(decl: Pick<BlockDecl, 'params'>): ParamValues {
  const out: ParamValues = {};
  for (const [key, spec] of Object.entries(decl.params ?? {})) {
    if (spec.store === 'script') continue;
    if (spec.default !== undefined) out[key] = cloneValue(spec.default);
  }
  return out;
}

/** The label of a param: its own, else the key with underscores turned into spaces, capitalised. */
export function paramLabel(key: string, spec: Pick<ParamSpec, 'label'>): string {
  if (spec.label) return spec.label;
  const text = key.replace(/_ms$/, '').replace(/_/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The text of one enum option: option_labels, then empty_label for the empty value, then the raw value. */
export function optionLabel(spec: Pick<ParamSpec, 'option_labels' | 'empty_label'>, option: unknown): string {
  const key = String(option);
  if (spec.option_labels && key in spec.option_labels) return spec.option_labels[key];
  if (option === '' && spec.empty_label) return spec.empty_label;
  return key;
}

function isEmpty(value: unknown): boolean {
  return value == null || value === '';
}

/** Required params that are shown and empty (the browser check of the roltek-automation-1 editor). */
export function missingRequired(decl: Pick<BlockDecl, 'params'>, values: ParamValues): string[] {
  const params = decl.params ?? {};
  return Object.entries(params)
    .filter(([key, spec]) => spec.required && isVisible(spec, values, params) && isEmpty(values[key]))
    .map(([key]) => key);
}

function safeRegExp(pattern: string): RegExp {
  try { return new RegExp(pattern); } catch { return /^/; }
}

/** Full check of the params of one node against the schema; hidden fields are skipped. */
/** the English words of a param issue: `label` is the field's name, `limit` the number the rule names (min, max, length) */
export function paramIssueMessage(code: ParamIssue['code'], label: string, limit?: number): string {
  switch (code) {
    case 'required': return `${label} is required.`;
    case 'number': return `${label} must be a number.`;
    case 'int': return `${label} must be a whole number.`;
    case 'min': return `${label} must be at least ${limit}.`;
    case 'max': return `${label} must be at most ${limit}.`;
    case 'enum': return `${label} is not one of the allowed values.`;
    case 'max_len': return `${label} is longer than ${limit} characters.`;
    case 'pattern': return `${label} has an invalid format.`;
  }
}

/** `text` gives the words of an issue (default English, see `paramIssueMessage`); a host that translates passes its own */
export function validateParams(decl: Pick<BlockDecl, 'params'>, values: ParamValues, text: typeof paramIssueMessage = paramIssueMessage): ParamIssue[] {
  const params = decl.params ?? {};
  const issues: ParamIssue[] = [];
  const add = (param: string, code: ParamIssue['code'], label: string, limit?: number) => issues.push({ param, code, message: text(code, label, limit) });
  for (const [key, spec] of Object.entries(params)) {
    if (!isVisible(spec, values, params)) continue;
    const value = values[key];
    const label = paramLabel(key, spec);
    if (isEmpty(value)) {
      if (spec.required) add(key, 'required', label);
      continue;
    }
    if (spec.type === 'number') {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(n)) { add(key, 'number', label); continue; }
      if (spec.int && !Number.isInteger(n)) add(key, 'int', label);
      if (spec.min != null && n < spec.min) add(key, 'min', label, spec.min);
      if (spec.max != null && n > spec.max) add(key, 'max', label, spec.max);
    } else if (spec.type === 'enum' && spec.options && !spec.options.some((o) => sameValue(o, value))) {
      add(key, 'enum', label);
    } else if (typeof value === 'string') {
      if (spec.max_len != null && value.length > spec.max_len) add(key, 'max_len', label, spec.max_len);
      if (spec.pattern && !safeRegExp(spec.pattern).test(value)) add(key, 'pattern', label);
    }
  }
  return issues;
}
