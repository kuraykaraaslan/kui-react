'use client';
/* In-memory mock store for the rulesets pages: rulesets, their versions and
   the recently deleted list. Shared between the list and the editor route
   (client navigation keeps it; a full reload starts from the sample data). */
import { useSyncExternalStore } from 'react';
import type { RuleChain } from '@/modules/domains/iot/types';
import {
  addVersion, applyImport, cloneChain, restoreDeleted, restoreVersion, summarizeChange,
  type ApplyImportResult, type ConflictChoice, type DeletedRuleset, type ImportItem, type RulesetVersion,
} from '@/modules/domains/iot/ruleset/transfer';
import { RULE_CHAINS } from '../iot.data';
import { CURRENT_USER, initialDeletedRulesets } from './rulesets.data';

export type RulesetStoreState = {
  chains: RuleChain[];
  versions: Record<string, RulesetVersion[]>;
  deleted: DeletedRuleset[];
};

/** three sample versions per ruleset: fewer nodes → one more → current */
function seedVersions(chain: RuleChain): RulesetVersion[] {
  const created = new Date(chain.createdAt ?? Date.now());
  const updated = new Date(chain.updatedAt ?? created);
  const mid = new Date((created.getTime() + updated.getTime()) / 2);
  const partial = (drop: number): RuleChain => {
    const nodes = chain.nodes.slice(0, Math.max(1, chain.nodes.length - drop));
    const ids = new Set(nodes.map((n) => n.nodeId));
    return { ...chain, nodes, edges: chain.edges.filter((e) => ids.has(e.sourceNodeId) && ids.has(e.targetNodeId)) };
  };
  let v = addVersion([], partial(2), { now: created, by: 'mike.t' });
  v = addVersion(v, partial(1), { now: mid, by: 'mike.t' });
  return addVersion(v, chain, { now: updated, by: CURRENT_USER });
}

const initial: RulesetStoreState = {
  chains: RULE_CHAINS.map(cloneChain),
  versions: Object.fromEntries(RULE_CHAINS.map((c) => [c.chainId, seedVersions(c)])),
  deleted: initialDeletedRulesets(),
};

let state = initial;
const listeners = new Set<() => void>();

function setState(next: RulesetStoreState) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useRulesetStore(): RulesetStoreState {
  return useSyncExternalStore(subscribe, () => state, () => initial);
}

function withVersion(s: RulesetStoreState, chain: RuleChain, summary?: string) {
  return { ...s.versions, [chain.chainId]: addVersion(s.versions[chain.chainId] ?? [], chain, { by: CURRENT_USER, summary }) };
}

export const rulesetStore = {
  get: () => state,

  create(chain: RuleChain, summary = 'Created') {
    setState({ ...state, chains: [...state.chains, chain], versions: withVersion(state, chain, summary) });
  },

  /** save a changed ruleset as a new version */
  save(chain: RuleChain) {
    const prev = state.chains.find((c) => c.chainId === chain.chainId) ?? null;
    const next = { ...chain, updatedAt: new Date() };
    setState({
      ...state,
      chains: state.chains.map((c) => (c.chainId === chain.chainId ? next : c)),
      versions: withVersion(state, next, summarizeChange(prev, next)),
    });
  },

  toggleActive(chainId: string) {
    setState({ ...state, chains: state.chains.map((c) => (c.chainId === chainId ? { ...c, active: !c.active, updatedAt: new Date() } : c)) });
  },

  remove(chainId: string) {
    const chain = state.chains.find((c) => c.chainId === chainId);
    if (!chain) return;
    setState({
      ...state,
      chains: state.chains.filter((c) => c.chainId !== chainId),
      deleted: [{ chain, deletedAt: new Date().toISOString() }, ...state.deleted],
    });
  },

  restoreDeleted(entry: DeletedRuleset): RuleChain {
    const chain = restoreDeleted(state.chains, entry);
    setState({
      chains: [...state.chains, chain],
      deleted: state.deleted.filter((d) => d !== entry),
      versions: withVersion(state, chain, 'Restored from recently deleted'),
    });
    return chain;
  },

  restoreVersion(chainId: string, version: number): RuleChain | null {
    const current = state.chains.find((c) => c.chainId === chainId);
    if (!current) return null;
    const r = restoreVersion(current, state.versions[chainId] ?? [], version, { by: CURRENT_USER });
    if (!r) return null;
    setState({
      ...state,
      chains: state.chains.map((c) => (c.chainId === chainId ? r.chain : c)),
      versions: { ...state.versions, [chainId]: r.versions },
    });
    return r.chain;
  },

  import(items: ImportItem[], choices: Record<string, ConflictChoice>): ApplyImportResult {
    const r = applyImport(state.chains, items, choices);
    let versions = state.versions;
    for (const c of r.imported) {
      versions = { ...versions, [c.chainId]: addVersion(versions[c.chainId] ?? [], c, { by: CURRENT_USER, summary: 'Imported' }) };
    }
    setState({ ...state, chains: r.chains, versions });
    return r;
  },
};
