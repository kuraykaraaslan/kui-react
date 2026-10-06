'use client';
// libs/hooks/useAsyncControl.ts
//
// Pure state machine for a control that writes to something slow (phase 9 §9.16):
//   idle -> pending -> confirmed            (commit resolved, and `reported` matches if given)
//   idle -> pending -> mismatch             (commit resolved but `reported` never matched in time)
//   idle -> pending -> failed               (commit rejected; the display rolls back to `value`)
// No transport knowledge: the caller supplies `commit` and, optionally, the value the
// other side `reported`.

import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncControlState = 'idle' | 'pending' | 'confirmed' | 'mismatch' | 'failed';

export type UseAsyncControlOptions<T> = {
  /** The last known (bound) value. A fresh value supersedes an optimistic one once nothing is pending. */
  value: T | null | undefined;
  /** What the other side reports. While given, "pending" lasts until it equals the requested value. */
  reported?: T | null;
  /** The write. A rejection means failure and rolls the display back. */
  commit: (next: T) => Promise<void>;
  /** How long to wait for `reported` to match after the commit resolved. Default = 10000. */
  timeoutMs?: number;
  /** How long "confirmed" shows before returning to idle. 0 keeps it. Default = 2000. */
  confirmedMs?: number;
  /** Ask for confirmation first: `set` parks the value in `awaiting`; `accept()` commits it, `dismiss()` drops it. */
  confirm?: boolean;
  /** Equality for `reported` matching. Default = `Object.is`. */
  equals?: (a: T, b: T) => boolean;
};

export type UseAsyncControlResult<T> = {
  /** What to render: the requested value while pending, else the bound value. */
  displayValue: T | null | undefined;
  state: AsyncControlState;
  /** The rejection message when `state === 'failed'`. */
  error: string | null;
  set: (next: T) => void;
  /** Repeat the last failed or mismatched write. */
  retry: () => void;
  /** With `confirm`: the value waiting for the user's confirmation. */
  awaiting: { value: T } | null;
  accept: () => void;
  dismiss: () => void;
};

export function useAsyncControl<T>(opts: UseAsyncControlOptions<T>): UseAsyncControlResult<T> {
  const { value, reported, timeoutMs = 10_000, confirmedMs = 2000, confirm = false } = opts;
  const equals = opts.equals ?? Object.is;
  const [desiredRaw, setDesired] = useState<{ value: T; base: T | null | undefined } | null>(null);
  const [state, setState] = useState<AsyncControlState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [awaiting, setAwaiting] = useState<{ value: T } | null>(null);

  const commitRef = useRef(opts.commit);
  const equalsRef = useRef(equals);
  useEffect(() => { commitRef.current = opts.commit; equalsRef.current = equals; });
  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; });
  const seq = useRef(0);
  const alive = useRef(true);
  const last = useRef<{ value: T } | null>(null);
  const resolved = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    if (confirmedTimer.current) { clearTimeout(confirmedTimer.current); confirmedTimer.current = null; }
  };
  useEffect(() => { alive.current = true; return () => { alive.current = false; clearTimers(); }; }, []);

  const finishConfirmed = useCallback(() => {
    clearTimers();
    setState('confirmed');
    if (confirmedMs > 0) {
      confirmedTimer.current = setTimeout(() => { if (alive.current) setState('idle'); }, confirmedMs);
    }
  }, [confirmedMs]);

  // The requested value holds while a write is in flight, and afterwards only until the bound
  // value changes: a fresh bound value supersedes the optimistic one.
  const desired = desiredRaw && (state === 'pending' || Object.is(desiredRaw.base, value)) ? desiredRaw : null;

  // `reported` arriving (or matching) resolves a pending write whose commit already resolved.
  useEffect(() => {
    if (state === 'pending' && resolved.current && desired && reported !== undefined && reported !== null
      && equalsRef.current(reported, desired.value)) {
      finishConfirmed();
    }
  }, [reported, state, desired, finishConfirmed]);

  const run = useCallback((next: T) => {
    clearTimers();
    const id = ++seq.current;
    last.current = { value: next };
    resolved.current = false;
    setError(null);
    setDesired({ value: next, base: valueRef.current });
    setState('pending');
    commitRef.current(next).then(
      () => {
        if (!alive.current || id !== seq.current) return;
        resolved.current = true;
        if (reported === undefined) { finishConfirmed(); return; }
        if (reported !== null && equalsRef.current(reported, next)) { finishConfirmed(); return; }
        timer.current = setTimeout(() => {
          if (alive.current && id === seq.current) setState('mismatch');
        }, timeoutMs);
      },
      (err: unknown) => {
        if (!alive.current || id !== seq.current) return;
        clearTimers();
        setDesired(null); // roll the display back to the bound value
        setError(err instanceof Error ? err.message : typeof err === 'string' ? err : null);
        setState('failed');
      },
    );
  }, [timeoutMs, finishConfirmed, reported]);

  const set = useCallback((next: T) => {
    if (confirm) { setAwaiting({ value: next }); return; }
    run(next);
  }, [confirm, run]);

  const accept = useCallback(() => {
    setAwaiting((a) => { if (a) run(a.value); return null; });
  }, [run]);
  const dismiss = useCallback(() => setAwaiting(null), []);
  const retry = useCallback(() => { if (last.current) run(last.current.value); }, [run]);

  return {
    displayValue: desired ? desired.value : value,
    state,
    error,
    set,
    retry,
    awaiting,
    accept,
    dismiss,
  };
}
