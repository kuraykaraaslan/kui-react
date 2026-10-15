import { colorField, fontField, layoutField, opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';
import { safeRowLinksRule } from '../views/content-logic';

/** `content.links`: quick links to internal pages or external addresses. */
export const CONTENT_LINKS: SettingsTemplate = {
  id: 'builtin:content.links',
  version: 1,
  namespace: '',
  label: 'Quick links',
  format: false,
  exportable: false,
  cardDefaults: { buttons: [] },
  groups: [
    { id: 'layout', label: 'Layout', tab: 'Display', since: 1 },
    { id: 'links', label: 'Links', tab: 'Display', since: 1 },
    { id: 'style', label: 'Text and icons', tab: 'Display', since: 1 },
    { id: 'behaviour', label: 'Behaviour', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    layout: layoutField([
      opt('list', 'List', 'links-list'),
      opt('grid', 'Cards', 'links-grid'),
      opt('buttons', 'Buttons', 'links-buttons'),
    ]),
    columns: {
      label: 'Columns', type: 'select', display: 'segmented', value: 'auto', group: 'layout', required: true, advanced: true,
      showIf: { layout: 'grid' },
      options: [opt('auto', 'Auto'), opt('1', '1'), opt('2', '2'), opt('3', '3'), opt('4', '4')],
    },
    links: {
      label: 'Links', type: 'repeater', value: [], max: 24, group: 'links',
      description: 'Targets must be an internal path, https, http or mailto; anything else is dropped.',
      fields: {
        label: { label: 'Label', type: 'text', maxLength: 80, required: true },
        href: { label: 'Target', type: 'text', maxLength: 2048, required: true, placeholder: '/admin/users' },
        description: { label: 'Description', type: 'text', maxLength: 160 },
        icon: { label: 'Icon', type: 'icon', placeholder: 'fas fa-users' },
        iconColor: { label: 'Icon colour', type: 'color' },
        color: { label: 'Accent colour', type: 'color' },
      },
    },
    labelFont: fontField('Label font', 'style', { advanced: true }),
    labelColor: colorField('Label colour', 'style', 'var(--text-primary)'),
    descriptionFont: fontField('Description font', 'style', { advanced: true }),
    descriptionColor: colorField('Description colour', 'style', 'var(--text-secondary)', { advanced: true }),
    iconColor: colorField('Icon colour', 'style', 'var(--primary)'),
    iconSize: { label: 'Icon size (px)', type: 'number', min: 8, max: 64, value: 16, group: 'style', advanced: true },
    accentColor: colorField('Accent colour', 'style', 'var(--primary)', {
      advanced: true, description: 'Buttons are filled with it; cards and list rows show it on hover. A link may set its own.',
    }),
    openExternalInNewTab: { label: 'Open external links in a new tab', type: 'boolean', value: true, group: 'behaviour' },
  }),
  rules: [safeRowLinksRule('links', 'href')],
  migrations: [],
};

export const CONTENT_LINKS_KIND: BuiltinKindSpec = {
  type: 'content.links',
  label: 'Quick links',
  category: 'Content',
  description: 'Navigation cards to internal pages or external addresses.',
  icon: 'fas fa-link',
  defaultW: 6,
  defaultH: 3,
  slots: [],
  template: CONTENT_LINKS,
};
