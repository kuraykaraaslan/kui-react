import { opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';
import { safeEmbedRule } from '../views/content-logic';

/** `content.embed`: a public https page in a sandboxed frame. */
export const CONTENT_EMBED: SettingsTemplate = {
  id: 'builtin:content.embed',
  version: 1,
  namespace: '',
  label: 'Embed',
  format: false,
  exportable: false,
  cardDefaults: { buttons: [], padding: 0 },
  groups: [
    { id: 'embed', label: 'Embedded page', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    url: {
      label: 'Page address', type: 'url', maxLength: 2048, placeholder: 'https://…', group: 'embed',
      description: 'https only; private, loopback and single-label hosts are refused. The page runs sandboxed and cannot reach this app.',
    },
    aspect: {
      label: 'Shape', type: 'select', display: 'segmented', value: 'fill', group: 'embed', required: true,
      options: [opt('fill', 'Fill the card'), opt('16:9', '16:9'), opt('4:3', '4:3'), opt('1:1', '1:1')],
    },
    allowFullscreen: { label: 'Allow the page to go full screen', type: 'boolean', value: true, group: 'embed', advanced: true },
  }),
  rules: [safeEmbedRule('url')],
  migrations: [],
};

export const CONTENT_EMBED_KIND: BuiltinKindSpec = {
  type: 'content.embed',
  label: 'Embed',
  category: 'Content',
  description: 'An external https page in a sandboxed frame.',
  icon: 'fas fa-window-maximize',
  defaultW: 6,
  defaultH: 5,
  slots: [],
  template: CONTENT_EMBED,
};
