import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '../help/markdown';
import { SCRIPT_API, SCRIPT_API_HELP, SCRIPT_SIGNATURE } from './api';

describe('the script API text', () => {
  it('documents every name of the signature line', () => {
    for (const name of ['msg', 'node', 'context', 'flow', 'global', 'env']) {
      expect(SCRIPT_SIGNATURE).toContain(name);
      expect(SCRIPT_API_HELP).toContain(`\`${name}`);
    }
  });
  it('lists the return forms of the signature in the help, and what the sandbox lacks', () => {
    for (const form of ['return msg', 'return [a, b]', 'return [[a, b]]', 'return "label"']) expect(SCRIPT_API_HELP).toContain(form);
    for (const gone of ['require', 'eval', 'fetch', 'util']) expect(SCRIPT_API_HELP).toContain(gone);
    expect(SCRIPT_API_HELP).toContain('There is no `util` object');
  });
  it('lists the helper namespaces of phase 06 and the node methods', () => {
    for (const ns of ['bytes', 'num', 'bits', 'obj', 'time']) expect(SCRIPT_API_HELP).toContain(`\`${ns}\``);
    for (const call of ['node.send', 'node.status', 'node.warn', 'node.error', 'env.get', 'console.log']) expect(SCRIPT_API_HELP).toContain(call);
  });
  it('is well formed markdown: headings, a table, lists, no raw html', () => {
    const kinds = parseMarkdown(SCRIPT_API_HELP).map((b) => b.kind);
    expect(kinds).toContain('table');
    expect(kinds.filter((k) => k === 'heading').length).toBeGreaterThanOrEqual(4);
    expect(kinds).toContain('list');
    expect(SCRIPT_API_HELP).not.toMatch(/<\w+[^>]*>/);
    expect(SCRIPT_API).toBe('automation-script');
  });
});
