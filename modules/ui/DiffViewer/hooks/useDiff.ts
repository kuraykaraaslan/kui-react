// modules/ui/DiffViewer/hooks/useDiff.ts
//
// M1 diff core — line-based Longest Common Subsequence (LCS) diff with
// hunk grouping + context windowing. Returns the same `Hunk[]` shape that
// `<UnifiedView>` and `<SplitView>` consume.
//
// The algorithm is O(N*M) memory + time for the LCS table — fine for the
// few-thousand-line inputs M1 targets. Larger payloads (10k+ lines) are
// the responsibility of M5's virtualization + Myers' linear-space variant.
//
// TODO M2: swap to Myers diff (better large-input performance, intra-line
//          word-level diff).
// TODO M5: memoize with WeakMap keyed by (oldText, newText) refs.

import { useMemo } from 'react';
import type { Change, Hunk } from '../types';

/** Split a string into lines, preserving empty trailing line semantics. */
function splitLines(s: string): string[] {
  if (s === '') return [];
  return s.split('\n');
}

/**
 * Classic LCS table — `lcs[i][j]` is the length of the longest common
 * subsequence of `old[0..i)` and `new[0..j)`. Building it forwards then
 * walking it backwards yields the edit script.
 */
function buildLcsTable(oldLines: string[], newLines: string[]): number[][] {
  const m = oldLines.length;
  const n = newLines.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }
  return lcs;
}

/**
 * Walk the LCS table back-to-front to produce a flat `Change[]` covering
 * the entire input — context, adds, and removes interleaved.
 */
function buildChanges(oldLines: string[], newLines: string[], lcs: number[][]): Change[] {
  const out: Change[] = [];
  let i = oldLines.length;
  let j = newLines.length;
  while (i > 0 && j > 0) {
    if (oldLines[i - 1] === newLines[j - 1]) {
      out.push({ type: 'context', oldLine: i, newLine: j, content: oldLines[i - 1] });
      i--;
      j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      out.push({ type: 'remove', oldLine: i, newLine: null, content: oldLines[i - 1] });
      i--;
    } else {
      out.push({ type: 'add', oldLine: null, newLine: j, content: newLines[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    out.push({ type: 'remove', oldLine: i, newLine: null, content: oldLines[i - 1] });
    i--;
  }
  while (j > 0) {
    out.push({ type: 'add', oldLine: null, newLine: j, content: newLines[j - 1] });
    j--;
  }
  out.reverse();
  return out;
}

/**
 * Group changes into hunks, keeping `context` unchanged lines on each side
 * of every block of add/remove. Unchanged runs longer than `2 * context`
 * become hunk boundaries — the surrounding context is split between the
 * neighbouring hunks.
 */
function groupIntoHunks(changes: Change[], context: number): Hunk[] {
  if (changes.length === 0) return [];

  // Find indices where a change (add/remove) occurs.
  const changeIdx: number[] = [];
  for (let i = 0; i < changes.length; i++) {
    if (changes[i].type !== 'context') changeIdx.push(i);
  }
  if (changeIdx.length === 0) return []; // identical inputs → no hunks

  // Cluster consecutive change indices that fall within `2 * context + 1`
  // unchanged lines of each other (keeps adjacent hunks merged).
  const clusters: Array<{ start: number; end: number }> = [];
  let curStart = changeIdx[0];
  let curEnd = changeIdx[0];
  for (let k = 1; k < changeIdx.length; k++) {
    const idx = changeIdx[k];
    if (idx - curEnd <= 2 * context + 1) {
      curEnd = idx;
    } else {
      clusters.push({ start: curStart, end: curEnd });
      curStart = idx;
      curEnd = idx;
    }
  }
  clusters.push({ start: curStart, end: curEnd });

  const hunks: Hunk[] = [];
  for (const c of clusters) {
    const from = Math.max(0, c.start - context);
    const to = Math.min(changes.length - 1, c.end + context);
    const slice = changes.slice(from, to + 1);

    // Compute @@ header coords from the first/last change with each side set.
    let oldStart = 0;
    let newStart = 0;
    for (const ch of slice) {
      if (ch.oldLine != null) { oldStart = ch.oldLine; break; }
    }
    for (const ch of slice) {
      if (ch.newLine != null) { newStart = ch.newLine; break; }
    }
    if (oldStart === 0 && slice.some((ch) => ch.type === 'add' && ch.newLine === 1)) {
      // Pure-add at start of file — old side is empty.
      oldStart = 0;
    }
    let oldLines = 0;
    let newLines = 0;
    for (const ch of slice) {
      if (ch.type === 'context') { oldLines++; newLines++; }
      else if (ch.type === 'remove') oldLines++;
      else if (ch.type === 'add') newLines++;
    }
    hunks.push({ oldStart, oldLines, newStart, newLines, changes: slice });
  }
  return hunks;
}

/**
 * React hook — recomputes the diff whenever the inputs change. Memoizes so
 * downstream components don't re-render when only props unrelated to the
 * text (e.g. `mode`) change.
 */
export function useDiff(oldText: string, newText: string, context: number): Hunk[] {
  return useMemo(() => {
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    if (oldLines.length === 0 && newLines.length === 0) return [];
    const lcs = buildLcsTable(oldLines, newLines);
    const changes = buildChanges(oldLines, newLines, lcs);
    return groupIntoHunks(changes, context);
  }, [oldText, newText, context]);
}
