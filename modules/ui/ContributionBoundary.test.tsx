import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ContributionBoundary } from './ContributionBoundary';

let shouldThrow = true;
function Flaky({ label = 'contribution ok' }: { label?: string }) {
  if (shouldThrow) throw new Error('contribution broke');
  return <p>{label}</p>;
}

function Thrower({ value }: { value: unknown }): never {
  throw value;
}

describe('ContributionBoundary', () => {
  // React logs every caught render error; keep the test output readable.
  beforeEach(() => {
    shouldThrow = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('renders its children when nothing throws', () => {
    shouldThrow = false;
    render(<ContributionBoundary fallback={<p>fallback</p>}><Flaky /></ContributionBoundary>);
    expect(screen.getByText('contribution ok')).toBeInTheDocument();
    expect(screen.queryByText('fallback')).not.toBeInTheDocument();
  });

  it('renders nothing by default when a child throws, and the host around it keeps rendering', () => {
    render(
      <div>
        <p>host content</p>
        <ContributionBoundary><Flaky /></ContributionBoundary>
      </div>,
    );
    expect(screen.getByText('host content')).toBeInTheDocument();
    expect(screen.queryByText('contribution ok')).not.toBeInTheDocument();
  });

  it('renders a node fallback', () => {
    render(<ContributionBoundary fallback={<p>fallback node</p>}><Flaky /></ContributionBoundary>);
    expect(screen.getByText('fallback node')).toBeInTheDocument();
  });

  it('a function fallback receives the error and a reset that renders the children again', async () => {
    const user = userEvent.setup();
    render(
      <ContributionBoundary
        fallback={({ error, reset }) => (
          <div>
            <p>{error.message}</p>
            <button onClick={reset}>Retry</button>
          </div>
        )}
      >
        <Flaky />
      </ContributionBoundary>,
    );
    expect(screen.getByText('contribution broke')).toBeInTheDocument();
    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByText('contribution ok')).toBeInTheDocument();
  });

  it('wraps a non-Error throw in an Error', () => {
    render(
      <ContributionBoundary fallback={({ error }) => <p>{error instanceof Error ? `Error: ${error.message}` : 'raw'}</p>}>
        <Thrower value="a plain string" />
      </ContributionBoundary>,
    );
    expect(screen.getByText('Error: a plain string')).toBeInTheDocument();
  });

  it('calls onError once with the error and the component stack', () => {
    const onError = vi.fn();
    render(<ContributionBoundary onError={onError}><Flaky /></ContributionBoundary>);
    expect(onError).toHaveBeenCalledTimes(1);
    const [error, info] = onError.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('contribution broke');
    expect(typeof info.componentStack).toBe('string');
  });

  it('an onError that throws is logged, not rethrown into the host', () => {
    const onError = vi.fn(() => {
      throw new Error('reporter down');
    });
    render(
      <div>
        <p>host content</p>
        <ContributionBoundary onError={onError} fallback={<p>fallback</p>}><Flaky /></ContributionBoundary>
      </div>,
    );
    expect(screen.getByText('host content')).toBeInTheDocument();
    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith('ContributionBoundary: onError threw', expect.any(Error));
  });

  it('resets when a reset key changes', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    function Host() {
      const [version, setVersion] = useState(1);
      return (
        <div>
          <button onClick={() => { shouldThrow = false; setVersion((v) => v + 1); }}>Reload</button>
          <ContributionBoundary resetKeys={[version]} onReset={onReset} fallback={<p>fallback</p>}>
            <Flaky label={`version ${version}`} />
          </ContributionBoundary>
        </div>
      );
    }
    render(<Host />);
    expect(screen.getByText('fallback')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reload' }));
    expect(screen.getByText('version 2')).toBeInTheDocument();
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('does not reset while the reset keys stay the same', async () => {
    const user = userEvent.setup();
    function Host() {
      const [, setTick] = useState(0);
      return (
        <div>
          <button onClick={() => { shouldThrow = false; setTick((t) => t + 1); }}>Rerender</button>
          <ContributionBoundary resetKeys={['same']} fallback={<p>fallback</p>}>
            <Flaky />
          </ContributionBoundary>
        </div>
      );
    }
    render(<Host />);
    await user.click(screen.getByRole('button', { name: 'Rerender' }));
    expect(screen.getByText('fallback')).toBeInTheDocument();
  });
});
