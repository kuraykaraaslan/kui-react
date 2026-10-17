'use client';
import { Component, type ErrorInfo, type ReactNode } from 'react';

export type ContributionBoundaryFallbackProps = {
  /** What the contribution threw. */
  error: Error;
  /** Clears the error and renders the children again. */
  reset: () => void;
};

export type ContributionBoundaryFallback =
  | ReactNode
  | ((props: ContributionBoundaryFallbackProps) => ReactNode);

export type ContributionBoundaryProps = {
  children?: ReactNode;
  /**
   * Rendered in place of the children after they throw: a node, or a function receiving
   * `{ error, reset }`. Defaults to nothing, so an end user never sees a broken contribution.
   */
  fallback?: ContributionBoundaryFallback;
  /** Called once per caught error, for reporting. A throwing handler is logged, never rethrown. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** The boundary resets when any of these values changes (compared with `Object.is`). */
  resetKeys?: ReadonlyArray<unknown>;
  /** Called after the boundary resets, by `reset()` or a `resetKeys` change. */
  onReset?: () => void;
};

type State = { error: Error | null };

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

function keysChanged(a: ReadonlyArray<unknown> = [], b: ReadonlyArray<unknown> = []): boolean {
  return a.length !== b.length || a.some((value, i) => !Object.is(value, b[i]));
}

/**
 * Isolates one contribution (a slot item, a tab, a widget, a block) so that when it throws
 * while rendering, only it is replaced by `fallback` and its host keeps working.
 */
export class ContributionBoundary extends Component<ContributionBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: toError(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    try {
      this.props.onError?.(toError(error), info);
    } catch (reportError) {
      console.error('ContributionBoundary: onError threw', reportError);
    }
  }

  componentDidUpdate(prevProps: ContributionBoundaryProps, prevState: State) {
    // Skip the update that caught the error: when the value that made the child throw is
    // itself one of the reset keys, resetting here would throw again straight away.
    if (this.state.error && prevState.error && keysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children ?? null;
    const { fallback } = this.props;
    if (typeof fallback === 'function') return fallback({ error, reset: this.reset });
    return fallback ?? null;
  }
}
