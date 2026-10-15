import { colorField, fontField, opt, since } from '../settings/packs';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec } from '../kind';
import { safeImageRule, safeLinkRule } from '../views/content-logic';

/** `content.image`: an image from an allow-listed address, with fit, caption, overlay and an optional link. */
export const CONTENT_IMAGE: SettingsTemplate = {
  id: 'builtin:content.image',
  version: 1,
  namespace: '',
  label: 'Image',
  format: false,
  exportable: false,
  cardDefaults: { buttons: [], padding: 0 },
  groups: [
    { id: 'image', label: 'Image', tab: 'Display', since: 1 },
    { id: 'display', label: 'Display', tab: 'Display', since: 1 },
    { id: 'caption', label: 'Caption', tab: 'Display', since: 1 },
    { id: 'link', label: 'Link', tab: 'Display', since: 1 },
  ],
  fields: since(1, {
    src: {
      label: 'Image address', type: 'url', maxLength: 2000, placeholder: 'https://… or /uploads/…', group: 'image',
      description: 'An internal path or an https / http address.',
    },
    alt: {
      label: 'Alternative text', type: 'text', maxLength: 300, group: 'image',
      description: 'Describe the image for screen readers. Empty marks it decorative.',
    },
    fit: {
      label: 'Fit', type: 'select', display: 'segmented', value: 'cover', group: 'display', required: true,
      options: [opt('cover', 'Cover'), opt('contain', 'Contain'), opt('fill', 'Stretch')],
    },
    position: {
      label: 'Position', type: 'select', value: 'center', group: 'display', required: true, advanced: true,
      options: [opt('center', 'Centre'), opt('top', 'Top'), opt('bottom', 'Bottom'), opt('left', 'Left'), opt('right', 'Right')],
    },
    radius: { label: 'Corner radius (px)', type: 'number', min: 0, max: 48, value: 0, group: 'display', advanced: true },
    overlayColor: colorField('Overlay colour', 'display', undefined, {
      advanced: true, description: 'A colour over the image, e.g. rgba(0,0,0,0.3).',
    }),
    caption: { label: 'Caption', type: 'text', maxLength: 200, group: 'caption' },
    captionPlacement: {
      label: 'Caption position', type: 'select', display: 'segmented', value: 'below', group: 'caption', required: true, advanced: true,
      options: [opt('below', 'Below the image'), opt('overlay', 'Over the image')],
    },
    captionFont: fontField('Caption font', 'caption', { advanced: true }),
    captionColor: colorField('Caption colour', 'caption', 'var(--text-secondary)', { advanced: true }),
    href: {
      label: 'Link', type: 'text', maxLength: 2048, placeholder: '/admin or https://…', group: 'link',
      description: 'Optional. An internal path or an https / http / mailto address.',
    },
    openInNewTab: { label: 'Open external links in a new tab', type: 'boolean', value: true, group: 'link', advanced: true },
  }),
  rules: [safeImageRule('src'), safeLinkRule('href', 'Link')],
  migrations: [],
};

export const CONTENT_IMAGE_KIND: BuiltinKindSpec = {
  type: 'content.image',
  label: 'Image',
  category: 'Content',
  description: 'An image from an https address or an internal path, optionally a link.',
  icon: 'fas fa-image',
  defaultW: 4,
  defaultH: 3,
  slots: [],
  template: CONTENT_IMAGE,
};
