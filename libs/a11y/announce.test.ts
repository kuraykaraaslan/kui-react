import { describe, it, expect, beforeEach } from 'vitest';
import { announce } from './announce';

// announce() lazily creates one singleton <div role="status"> per
// politeness level and appends it to document.body, never removing it —
// so each test clears document.body first rather than assuming a fresh
// DOM, and the "same call twice reuses the same element" test is explicit
// about that being the intended behavior, not a leak.

function waitForRaf() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

describe('announce', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates a visually-hidden aria-live region on first call', async () => {
    announce('Saved successfully');
    const region = document.getElementById('announce-polite');
    expect(region).not.toBeNull();
    expect(region).toHaveAttribute('role', 'status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region?.style.position).toBe('absolute');
    expect(region?.style.width).toBe('1px');
  });

  it('sets the region text content (after the rAF flush)', async () => {
    announce('Saved successfully');
    await waitForRaf();
    expect(document.getElementById('announce-polite')).toHaveTextContent('Saved successfully');
  });

  it('defaults to politeness="polite"', async () => {
    announce('Default politeness');
    await waitForRaf();
    expect(document.getElementById('announce-polite')).toHaveTextContent('Default politeness');
    expect(document.getElementById('announce-assertive')).toBeNull();
  });

  it('politeness="assertive" uses a separate region from "polite"', async () => {
    announce('Polite message', 'polite');
    announce('Urgent message', 'assertive');
    await waitForRaf();
    expect(document.getElementById('announce-polite')).toHaveTextContent('Polite message');
    expect(document.getElementById('announce-assertive')).toHaveTextContent('Urgent message');
    expect(document.getElementById('announce-assertive')).toHaveAttribute('aria-live', 'assertive');
  });

  it('reuses the same region element across repeated calls at the same politeness', async () => {
    announce('First');
    await waitForRaf();
    const region = document.getElementById('announce-polite');
    announce('Second');
    await waitForRaf();
    expect(document.getElementById('announce-polite')).toBe(region);
    expect(region).toHaveTextContent('Second');
  });

  it('clears the region synchronously before the rAF sets the new text (forces re-announcement of an identical message)', () => {
    announce('Repeat me');
    // Immediately after the call, before the rAF callback has run, the
    // region's content should already be cleared -- that's the mechanism
    // that makes screen readers re-announce an unchanged message.
    const region = document.getElementById('announce-polite');
    expect(region).toHaveTextContent('');
  });
});
