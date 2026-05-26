'use client';
// Tiny inline fuzzy matcher (subsequence + bonus weighting).
// No external dependency — keeps the M1 core ≤ 10 kB.
// TODO M2: swap to `fuzzysort` lazy-loaded for >500 commands.

import { useMemo } from 'react';
import type { CommandItem, ScoredCommand } from '../types';

/**
 * Score a single string against the query.
 * - Returns `null` if no subsequence match.
 * - Otherwise returns `{ score, matches }`.
 *
 * Scoring rules (higher is better):
 *  • +100 prefix match
 *  • +30  word boundary (after space/dash/slash)
 *  • +10  consecutive char
 *  • -1   per char distance gap
 */
function scoreString(
  haystack: string,
  needle: string
): { score: number; matches: number[] } | null {
  if (!needle) return { score: 0, matches: [] };
  const hay = haystack.toLowerCase();
  const need = needle.toLowerCase();

  let score = 0;
  let lastMatch = -1;
  const matches: number[] = [];

  let h = 0;
  for (let n = 0; n < need.length; n++) {
    const ch = need[n];
    let found = -1;
    for (let i = h; i < hay.length; i++) {
      if (hay[i] === ch) {
        found = i;
        break;
      }
    }
    if (found === -1) return null;

    if (found === 0) score += 100;
    else if (hay[found - 1] === ' ' || hay[found - 1] === '-' || hay[found - 1] === '/' || hay[found - 1] === '_') {
      score += 30;
    }
    if (lastMatch !== -1 && found === lastMatch + 1) score += 10;
    if (lastMatch !== -1) score -= (found - lastMatch - 1);

    matches.push(found);
    lastMatch = found;
    h = found + 1;
  }
  return { score, matches };
}

/**
 * Score a command. Considers label primarily, with a small keyword boost.
 * Returns `null` when neither label nor any keyword matches.
 */
export function scoreCommand(item: CommandItem, query: string): ScoredCommand | null {
  if (!query.trim()) {
    return { item, score: 0, matches: [] };
  }

  const labelScore = scoreString(item.label, query);
  if (labelScore) {
    return { item, score: labelScore.score, matches: labelScore.matches };
  }

  // Keyword fallback: lower priority, no highlight on the label.
  if (item.keywords?.length) {
    for (const kw of item.keywords) {
      const s = scoreString(kw, query);
      if (s) return { item, score: s.score * 0.5, matches: [] };
    }
  }

  // Category fallback (matches the legacy filter behaviour).
  const catScore = scoreString(item.category, query);
  if (catScore) {
    return { item, score: catScore.score * 0.25, matches: [] };
  }

  return null;
}

/** React hook variant — memoised across re-renders. */
export function useFuzzySearch(items: CommandItem[], query: string): ScoredCommand[] {
  return useMemo(() => {
    if (!query.trim()) {
      return items.map<ScoredCommand>((item) => ({ item, score: 0, matches: [] }));
    }
    const out: ScoredCommand[] = [];
    for (const item of items) {
      const s = scoreCommand(item, query);
      if (s) out.push(s);
    }
    return out.sort((a, b) => b.score - a.score);
  }, [items, query]);
}

/**
 * Wrap matched indices in `<mark>`. Returns an array of React nodes
 * so callers can render safely without dangerouslySetInnerHTML.
 */
export function highlightMatches(label: string, matches: number[]): React.ReactNode[] {
  if (!matches.length) return [label];
  const set = new Set(matches);
  const out: React.ReactNode[] = [];
  let buf = '';
  for (let i = 0; i < label.length; i++) {
    if (set.has(i)) {
      if (buf) {
        out.push(buf);
        buf = '';
      }
      out.push(
        // eslint-disable-next-line react/no-array-index-key
        <mark key={`m-${i}`} className="bg-warning-subtle text-text-primary rounded-sm px-0.5">
          {label[i]}
        </mark>
      );
    } else {
      buf += label[i];
    }
  }
  if (buf) out.push(buf);
  return out;
}
