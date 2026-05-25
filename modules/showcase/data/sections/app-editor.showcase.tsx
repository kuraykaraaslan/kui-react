'use client';
import { useState } from 'react';
import { RichTextEditor } from '@/modules/app/RichTextEditor';
import type { ShowcaseComponent } from '../showcase.types';

const SAMPLE_HTML = `<h1>Release notes</h1>
<p>This week we shipped <strong>three</strong> things you should know about.</p>
<h2>New features</h2>
<ul>
  <li>Inline <em>image upload</em> in the editor toolbar.</li>
  <li>Block-level <code>code</code> snippets with syntax highlighting.</li>
  <li>Read-only mode for archived documents.</li>
</ul>
<blockquote>Pixel parity between the React and EJS sibling components is now enforced.</blockquote>
<p>Read the <a href="https://example.com/changelog">full changelog</a> for the rest.</p>`;

function EmptyDemo() {
  const [html, setHtml] = useState('');
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_220px] w-full">
      <RichTextEditor
        id="rte-empty"
        label="Article body"
        hint="Use the toolbar to format your text."
        value={html}
        onChange={setHtml}
        placeholder="Start writing your article…"
      />
      <pre className="text-[10px] leading-snug bg-surface-sunken text-text-secondary p-2 rounded-md overflow-auto max-h-[260px] whitespace-pre-wrap break-words">
        {html || '<empty>'}
      </pre>
    </div>
  );
}

function PrepopulatedDemo() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_220px] w-full">
      <RichTextEditor
        id="rte-prefilled"
        label="Release notes"
        defaultValue={SAMPLE_HTML}
        onChange={setHtml}
      />
      <pre className="text-[10px] leading-snug bg-surface-sunken text-text-secondary p-2 rounded-md overflow-auto max-h-[260px] whitespace-pre-wrap break-words">
        {html}
      </pre>
    </div>
  );
}

function ReadOnlyDemo() {
  return (
    <RichTextEditor
      id="rte-readonly"
      label="Archived document"
      hint="This document is read-only."
      defaultValue={SAMPLE_HTML}
      readOnly
    />
  );
}

export function buildAppEditorData(): ShowcaseComponent[] {
  return [
    {
      id: 'rich-text-editor',
      title: 'RichTextEditor',
      category: 'App',
      abbr: 'RT',
      description:
        'WYSIWYG editor for long-form prose. Built on Quill 2.x — single shared library on both the React and EJS sibling repos so output HTML is identical. Toolbar covers bold/italic/underline/strike/inline code, headings, blockquote, code block, lists, link, image (via Modal + FileInput), text align, clear formatting, undo/redo.',
      filePath: 'modules/app/RichTextEditor.tsx',
      sourceCode: `import { RichTextEditor } from '@/modules/app/RichTextEditor';

const [body, setBody] = useState('');

<RichTextEditor
  id="article-body"
  label="Article body"
  hint="Use the toolbar to format your text."
  value={body}
  onChange={setBody}
  placeholder="Start writing your article…"
/>

// Pre-populated, uncontrolled:
<RichTextEditor
  id="release-notes"
  label="Release notes"
  defaultValue={initialHtml}
  onChange={setBody}
/>

// Read-only (toolbar hidden):
<RichTextEditor id="archived" defaultValue={savedHtml} readOnly />`,
      since: '2026-05',
      composes: ['modal', 'input', 'button'],
      dependencies: ['quill'],
      designTokens: [
        '--surface-base', '--surface-sunken', '--surface-raised',
        '--text-primary', '--text-secondary', '--text-disabled',
        '--border', '--border-focus', '--primary', '--error',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['textbox', 'toolbar'],
        keyboardInteractions: [
          { keys: 'Ctrl/Cmd + B', action: 'Bold selection' },
          { keys: 'Ctrl/Cmd + I', action: 'Italic selection' },
          { keys: 'Ctrl/Cmd + U', action: 'Underline selection' },
          { keys: 'Ctrl/Cmd + Z', action: 'Undo' },
          { keys: 'Ctrl/Cmd + Shift + Z', action: 'Redo' },
        ],
      },
      variants: [
        {
          title: 'Empty',
          layout: 'stack' as const,
          preview: <EmptyDemo />,
          code: `const [body, setBody] = useState('');

<RichTextEditor
  id="article-body"
  label="Article body"
  hint="Use the toolbar to format your text."
  value={body}
  onChange={setBody}
  placeholder="Start writing your article…"
/>`,
        },
        {
          title: 'Pre-populated',
          layout: 'stack' as const,
          preview: <PrepopulatedDemo />,
          code: `const initial = '<h1>Release notes</h1><p>...</p>';

<RichTextEditor
  id="release-notes"
  label="Release notes"
  defaultValue={initial}
  onChange={setBody}
/>`,
        },
        {
          title: 'Read-only',
          layout: 'stack' as const,
          preview: <ReadOnlyDemo />,
          code: `<RichTextEditor
  id="archived"
  label="Archived document"
  hint="This document is read-only."
  defaultValue={savedHtml}
  readOnly
/>`,
        },
      ],
    },
  ];
}
