# ContentScoreBar

- **id:** `content-score-bar`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/ContentScoreBar.tsx`
- **status:** stable
- **since:** 2025-03

Kural tabanlı içerik kalite skoru. Good ≥70 / Fair ≥40 / Poor <40 tier sistemi. Her kural chip olarak gösterilir, geçen/kalan sayım altında.

## Design tokens consumed

- `--border`
- `--error`
- `--error-subtle`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-sunken`
- `--text-disabled`
- `--text-secondary`
- `--warning`
- `--warning-subtle`

## Variants

### Live evaluation

```tsx
const rules = [
  { label: 'Min 20 chars', check: (v) => v.length >= 20, points: 20 },
  { label: 'Has keyword',  check: (v) => /react/i.test(v), points: 20, hint: 'Include "React"' },
  // ...
];
<ContentScoreBar value={content} rules={rules} label="Quality score" />
```

### All tiers

```tsx
// Good tier  (score ≥ 70)
<ContentScoreBar value="" rules={allPassRules} label="Good (100%)" />

// Fair tier  (40 ≤ score < 70)
<ContentScoreBar value="" rules={halfPassRules} label="Fair (60%)" />

// Poor tier  (score < 40)
<ContentScoreBar value="" rules={onePassRules}  label="Poor (20%)" />
```

### Password strength

```tsx
const rules = [
  { label: 'Min 8 chars',  check: (v) => v.length >= 8,          points: 25 },
  { label: 'Uppercase',    check: (v) => /[A-Z]/.test(v),        points: 25 },
  { label: 'Number',       check: (v) => /\d/.test(v),            points: 25 },
  { label: 'Special char', check: (v) => /[^A-Za-z0-9]/.test(v), points: 25 },
];
<ContentScoreBar value={password} rules={rules} label="Password strength" />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useMemo } from 'react';

const tierMap = {
  great: { bar: 'bg-success', text: 'text-success-fg', bg: 'bg-success-subtle', border: 'border-success', label: 'Good' },
  ok:    { bar: 'bg-warning', text: 'text-warning-fg', bg: 'bg-warning-subtle', border: 'border-warning', label: 'Fair' },
  poor:  { bar: 'bg-error',   text: 'text-error-fg',   bg: 'bg-error-subtle',   border: 'border-error',   label: 'Poor' },
};

export function ContentScoreBar({ value, rules, label, className }) {
  const { score, results } = useMemo(() => {
    let earned = 0, total = 0;
    const results = rules.map((rule) => { const pass = rule.check(value); if (pass) earned += rule.points; total += rule.points; return { label: rule.label, pass, hint: rule.hint }; });
    return { score: total > 0 ? Math.round((earned / total) * 100) : 0, results };
  }, [value, rules]);
  const tier = score >= 70 ? 'great' : score >= 40 ? 'ok' : 'poor';
  const t = tierMap[tier];
  return (
    <div className={cn('rounded-lg border p-3 space-y-2', t.bg, t.border, className)}>
      <div className="flex items-center gap-2">
        {label && <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <span className={cn('text-xs font-medium', t.text)}>{t.label}</span>
          <span className={cn('text-sm font-bold tabular-nums', t.text)}>{score}%</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', t.bar)} style={{ width: `${score}%` }} />
      </div>
      <div className="flex flex-wrap gap-1">
        {results.map((r, i) => <span key={i} title={r.hint} className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', r.pass ? cn(t.bg, t.text, 'border', t.border) : 'bg-surface-sunken text-text-disabled border border-border')}>{r.pass && <span aria-hidden="true">✓</span>}{r.label}</span>)}
      </div>
      <p className="text-xs text-text-secondary">{results.filter(r => r.pass).length} / {results.length} rules passed</p>
    </div>
  );
}
```
