import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { firstParagraph, Markdown, parseMarkdown } from './markdown';

const html = (md: string) => render(<Markdown text={md} />).container;

describe('help markdown', () => {
  it('reads headings, paragraphs (lines joined), lists, a table and fenced code', () => {
    const blocks = parseMarkdown('# Title\n\nFirst line\nsecond line\n\n- one\n- two\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n```\ncode here\n```\n## Part');
    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'paragraph', 'list', 'table', 'code', 'heading']);
    expect(blocks[1]).toEqual({ kind: 'paragraph', text: 'First line second line' });
    expect(blocks[2]).toEqual({ kind: 'list', items: ['one', 'two'] });
    expect(blocks[3]).toEqual({ kind: 'table', head: ['A', 'B'], rows: [['1', '2']] });
    expect(blocks[4]).toEqual({ kind: 'code', text: 'code here' });
    expect(blocks[0]).toMatchObject({ level: 3 });
    expect(blocks[5]).toMatchObject({ level: 4 });
  });
  it('draws inline code, bold and italic as elements', () => {
    const c = html('Use `msg.payload` and **bold** and *soft*.');
    expect(c.querySelector('code')?.textContent).toBe('msg.payload');
    expect(c.querySelector('strong')?.textContent).toBe('bold');
    expect(c.querySelector('em')?.textContent).toBe('soft');
    expect(c.textContent).toBe('Use msg.payload and bold and soft.');
  });
  it('never turns text into markup: tags, scripts and attributes stay characters', () => {
    const c = html('Hello <img src=x onerror=alert(1)> <script>alert(1)</script> **<b>x</b>**\n\n```\n<div>raw</div>\n```');
    expect(c.querySelector('img, script, b')).toBeNull();
    expect(c.querySelector('pre div')).toBeNull();
    expect(c.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(c.textContent).toContain('<script>alert(1)</script>');
    expect(c.querySelector('pre')?.textContent).toBe('<div>raw</div>');
    expect(c.querySelector('strong')?.textContent).toBe('<b>x</b>');
  });
  it('closes an open fence at the end and ignores empty input', () => {
    expect(parseMarkdown('```\nopen')).toEqual([{ kind: 'code', text: 'open' }]);
    expect(parseMarkdown('')).toEqual([]);
    expect(html('').textContent).toBe('');
  });
  it('gives the first paragraph as plain text for a hover hint', () => {
    expect(firstParagraph('# Title\n\nSends a **message** when `msg` arrives.\nMore.\n\nSecond.')).toBe('Sends a message when msg arrives. More.');
    expect(firstParagraph('# Only a heading')).toBe('');
    expect(firstParagraph('')).toBe('');
  });
});
