import { colorField, fontField, layoutField, opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';

/** `content.markdown`: author-written text (a safe markdown subset), optionally filled from a bound record. */
export const CONTENT_MARKDOWN: SettingsTemplate = {
  id: 'builtin:content.markdown',
  version: 1,
  namespace: '',
  label: 'Text',
  format: true,
  exportable: false,
  cardDefaults: { buttons: [] },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'content', label: 'Content', tab: 'Display', since: 1 },
    { id: 'callout', label: 'Callout', tab: 'Display', since: 1 },
    { id: 'text', label: 'Text style', tab: 'Display', since: 1 },
    { id: 'record', label: 'Record values', tab: 'Data', since: 1, showWhen: { slotBound: 'record' } },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('plain', 'Plain text', 'markdown-plain'),
      opt('callout', 'Callout box', 'markdown-callout'),
    ]),
    content: {
      label: 'Text (Markdown)', type: 'textarea', maxLength: 20000, value: '', group: 'content',
      placeholder: '## Heading\n\nSome **bold** text, a [link](/admin) and a value: {{temperature}}.',
      description: 'Headings, lists, quotes, code, bold, italic and links. HTML is shown as text, never run. '
        + '{{field}} inserts a value of the bound record.',
    },
    calloutColor: colorField('Callout accent colour', 'callout', 'var(--info)', { showIf: { layout: 'callout' } }),
    calloutBackground: colorField('Callout background', 'callout', 'var(--info-subtle)', { showIf: { layout: 'callout' } }),
    align: {
      label: 'Alignment', type: 'select', display: 'segmented', value: 'start', group: 'text', required: true,
      options: [opt('start', 'Left'), opt('center', 'Centre'), opt('end', 'Right')],
    },
    textSize: {
      label: 'Text size', type: 'select', display: 'segmented', value: 'md', group: 'text', required: true,
      options: [opt('sm', 'Small'), opt('md', 'Medium'), opt('lg', 'Large')],
    },
    textFont: fontField('Text font', 'text', { advanced: true, description: 'A size here overrides the text size above.' }),
    textColor: colorField('Text colour', 'text', 'var(--text-primary)'),
    headingColor: colorField('Heading colour', 'text', undefined, { advanced: true }),
    linkColor: colorField('Link colour', 'text', 'var(--primary)', { advanced: true }),
    missingText: {
      label: 'When a field has no value', type: 'text', maxLength: 40, value: '—', group: 'record',
      description: 'Shown in place of a {{field}} the record does not have.',
    },
  }),
  migrations: [],
};

export const CONTENT_MARKDOWN_KIND: BuiltinKindSpec = {
  type: 'content.markdown',
  label: 'Text',
  category: 'Content',
  description: 'Formatted text: headings, lists, links, bold, italic, code, and values from a bound record. HTML is shown as text, never run.',
  icon: 'fas fa-align-left',
  defaultW: 4,
  defaultH: 3,
  slots: [
    { key: 'record', label: 'Record for {{field}} values', shape: 'record', required: false },
  ],
  template: CONTENT_MARKDOWN,
};
