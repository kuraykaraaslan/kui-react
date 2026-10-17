'use client';
// Tiny global command registry (M1).
// Additive: defaults from <CommandPalette items={...} /> still merge in.
// Any module can add commands with registerCommand / registerCommands /
// useRegisterCommand; a command with `hidden: true` stays registered but is
// not listed, so gating (module off, no permission) is a flag, not a re-register.
// TODO M2: per-scope subscriptions, route-aware mount/unmount, enabled() gating.
// TODO M5: feed in `onSearch` async results.

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { CommandItem } from '../types';

type Listener = () => void;

const registry = new Map<string, CommandItem>();
const listeners = new Set<Listener>();

// useSyncExternalStore requires getSnapshot() to return a referentially
// stable value when nothing has changed — React calls it on every render to
// check for staleness, and a fresh array each time makes it look changed on
// every single call, forcing another immediate re-render forever (React
// error 185, "Maximum update depth exceeded"). Cache the array and only
// recompute it when the registry actually mutates.
let cachedSnapshot: CommandItem[] | null = null;

function emit() {
  cachedSnapshot = null;
  for (const fn of listeners) fn();
}

function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): CommandItem[] {
  if (cachedSnapshot === null) {
    cachedSnapshot = Array.from(registry.values());
  }
  return cachedSnapshot;
}

function getServerSnapshot(): CommandItem[] {
  return [];
}

/** The group a command is listed under. */
export function commandGroupOf(cmd: CommandItem): string {
  return cmd.group ?? cmd.category ?? 'Commands';
}

function commandKey(cmd: CommandItem): string {
  return cmd.id ?? `${commandGroupOf(cmd)}::${cmd.label}`;
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

/** Imperative batch add — one teardown removes them all. */
export function registerCommands(cmds: readonly CommandItem[]): () => void {
  const keys = cmds.map((cmd) => {
    const key = commandKey(cmd);
    registry.set(key, cmd);
    return key;
  });
  emit();
  return () => {
    for (const key of keys) registry.delete(key);
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
  }, [key, cmd?.shortcut, cmd?.onClick, cmd?.hidden, cmd?.order, cmd?.group, cmd?.category]);
}

/** Merge default + dynamically registered commands (dedupe by key), without hidden ones. */
export function useMergedCommands(defaults: CommandItem[]): CommandItem[] {
  const dynamic = useCommandStore();
  return useMemo(() => {
    const seen = new Map<string, CommandItem>();
    for (const c of defaults) seen.set(commandKey(c), c);
    for (const c of dynamic) seen.set(commandKey(c), c);
    return Array.from(seen.values()).filter((c) => !c.hidden);
  }, [defaults, dynamic]);
}
