'use client';
// Tiny global command registry (M1).
// Additive: defaults from <CommandPalette items={...} /> still merge in.
// TODO M2: per-scope subscriptions, route-aware mount/unmount, enabled() gating.
// TODO M5: feed in `onSearch` async results.

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { CommandItem } from '../types';

type Listener = () => void;

const registry = new Map<string, CommandItem>();
const listeners = new Set<Listener>();

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): CommandItem[] {
  return Array.from(registry.values());
}

function getServerSnapshot(): CommandItem[] {
  return [];
}

function commandKey(cmd: CommandItem): string {
  return cmd.id ?? `${cmd.category}::${cmd.label}`;
}

/** Imperative add — returns a teardown to remove on unmount. */
export function registerCommand(cmd: CommandItem): () => void {
  const key = commandKey(cmd);
  registry.set(key, cmd);
  emit();
  return () => {
    registry.delete(key);
    emit();
  };
}

/** Read-only snapshot of all dynamically registered commands. */
export function useCommandStore(): CommandItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Declarative registration. Re-registers when `cmd.label`, `cmd.id`,
 * or `cmd.category` change.
 */
export function useRegisterCommand(cmd: CommandItem | null | undefined): void {
  // Stable key for the dependency array — the consumer's exact object identity
  // shouldn't churn the registry on every render.
  const key = useMemo(() => (cmd ? commandKey(cmd) : null), [cmd]);
  useEffect(() => {
    if (!cmd) return;
    const dispose = registerCommand(cmd);
    return dispose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cmd?.shortcut, cmd?.onClick]);
}

/** Merge default + dynamically registered commands (dedupe by key). */
export function useMergedCommands(defaults: CommandItem[]): CommandItem[] {
  const dynamic = useCommandStore();
  return useMemo(() => {
    const seen = new Map<string, CommandItem>();
    for (const c of defaults) seen.set(commandKey(c), c);
    for (const c of dynamic) seen.set(commandKey(c), c);
    return Array.from(seen.values());
  }, [defaults, dynamic]);
}
