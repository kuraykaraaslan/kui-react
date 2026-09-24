'use client';
import { cn } from '@/libs/utils/cn';
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export type ScoreRule = {
  label: string;
  check: (value: string) => boolean;
  points: number;
  hint?: string;
};

type Tier = 'great' | 'ok' | 'poor';

const tierMap: Record<Tier, {
  bar: string; text: string; bg: string; border: string; dot: string; label: string;
}> = {
  great: { bar: 'bg-success', text: 'text-success-fg', bg: 'bg-success-subtle', border: 'border-success', dot: 'bg-success', label: 'Good'  },
  ok:    { bar: 'bg-warning', text: 'text-warning-fg', bg: 'bg-warning-subtle', border: 'border-warning', dot: 'bg-warning', label: 'Fair'  },
  poor:  { bar: 'bg-error',   text: 'text-error-fg',   bg: 'bg-error-subtle',   border: 'border-error',   dot: 'bg-error',   label: 'Poor'  },
};

export function ContentScoreBar({
  value,
  rules,
  label,
  className,
}: {
  value: string;
  rules: ScoreRule[];
  label?: string;
  className?: string;
}) {
  const { score, results } = useMemo(() => {
    const checked = rules.map((rule) => ({ rule, pass: rule.check(value) }));
    const earned = checked.reduce((sum, c) => (c.pass ? sum + c.rule.points : sum), 0);
    const total = rules.reduce((sum, rule) => sum + rule.points, 0);
    const results = checked.map(({ rule, pass }) => ({ label: rule.label, pass, hint: rule.hint }));
    return { score: total > 0 ? Math.round((earned / total) * 100) : 0, results };
  }, [value, rules]);

  const tier: Tier = score >= 70 ? 'great' : score >= 40 ? 'ok' : 'poor';
  const t = tierMap[tier];
  const passCount = results.filter((r) => r.pass).length;

  return (
    <div
      className={cn(
        'rounded-lg border p-3 space-y-2 transition-colors duration-300',
        t.bg, t.border,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn('inline-block h-1.5 w-1.5 rounded-full shrink-0', t.dot)} aria-hidden="true" />
        {label && (
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {label}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <span className={cn('text-xs font-medium', t.text)}>{t.label}</span>
          <span
            className={cn('text-sm font-bold tabular-nums leading-none', t.text)}
            aria-label={`${label ?? 'Content score'}: ${score}%`}
          >
            {score}%
          </span>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', t.bar)}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {results.map((r, i) => (
          <span
            key={i}
            title={r.hint}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-default select-none transition-colors',
              r.pass
                ? cn(t.bg, t.text, 'border', t.border)
                : 'bg-surface-sunken text-text-disabled border border-border'
            )}
          >
            {r.pass && <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" aria-hidden="true" />}
            {r.label}
          </span>
        ))}
      </div>

      <p className="text-xs text-text-secondary leading-none">
        {passCount} / {results.length} rules passed
      </p>
    </div>
  );
}
