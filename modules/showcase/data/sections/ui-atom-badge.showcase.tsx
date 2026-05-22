'use client';
import { Badge } from '@/modules/ui/Badge';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

function BadgeDismissibleDemo() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="primary" dismissible onDismiss={() => setTags((t) => t.filter((x) => x !== tag))}>
          {tag}
        </Badge>
      ))}
      {tags.length === 0 && <span className="text-sm text-text-secondary">All dismissed</span>}
    </div>
  );
}

export function buildBadgeData(): ShowcaseComponent[] {
  return [
    {
      id: 'badge',
      title: 'Badge',
      category: 'Atom',
      abbr: 'Bg',
      description: 'Status, category or label indicator. 6 semantic variants, 3 sizes, dot and dismissible support.',
      filePath: 'modules/ui/Badge.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

const variantMap = {
  success: 'bg-success-subtle text-success-fg',
  error:   'bg-error-subtle text-error-fg',
  warning: 'bg-warning-subtle text-warning-fg',
  info:    'bg-info-subtle text-info-fg',
  neutral: 'bg-surface-sunken text-text-secondary',
  primary: 'bg-primary-subtle text-primary',
};

export function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variantMap[variant], className)}>
      {children}
    </span>
  );
}`,
      playground: {
        controls: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['success', 'error', 'warning', 'info', 'neutral', 'primary'] as const, default: 'primary' },
          { key: 'size',    label: 'Size',    type: 'select', options: ['sm', 'md', 'lg'] as const, default: 'md' },
          { key: 'label',   label: 'Label',   type: 'text',    default: 'Frontend' },
          { key: 'dot',     label: 'Dot',     type: 'boolean', default: false },
        ],
        render: (p) => (
          <Badge variant={p.variant as any} size={p.size as any} dot={p.dot as boolean}>
            {p.label as string}
          </Badge>
        ),
        generateCode: (p) => {
          const attrs: string[] = [];
          if (p.variant !== 'primary') attrs.push(`variant="${p.variant}"`);
          if (p.size !== 'md')         attrs.push(`size="${p.size}"`);
          if (p.dot)                   attrs.push('dot');
          const a = attrs.length ? ' ' + attrs.join(' ') : '';
          return `<Badge${a}>${p.label}</Badge>`;
        },
      },
      variants: [
        { title: 'Success', preview: <Badge variant="success">Active</Badge>, code: `<Badge variant="success">Active</Badge>` },
        { title: 'Error', preview: <Badge variant="error">Inactive</Badge>, code: `<Badge variant="error">Inactive</Badge>` },
        { title: 'Warning', preview: <Badge variant="warning">Pending</Badge>, code: `<Badge variant="warning">Pending</Badge>` },
        { title: 'Info', preview: <Badge variant="info">New</Badge>, code: `<Badge variant="info">New</Badge>` },
        { title: 'Neutral', preview: <Badge variant="neutral">Design</Badge>, code: `<Badge variant="neutral">Design</Badge>` },
        { title: 'Primary', preview: <Badge variant="primary">Frontend</Badge>, code: `<Badge variant="primary">Frontend</Badge>` },
        {
          title: 'Sizes',
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">Small</Badge>
              <Badge variant="primary" size="md">Medium</Badge>
              <Badge variant="primary" size="lg">Large</Badge>
            </div>
          ),
          code: `<Badge size="sm">Small</Badge>\n<Badge size="md">Medium</Badge>\n<Badge size="lg">Large</Badge>`,
        },
        {
          title: 'Dot badge',
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" dot>Online</Badge>
              <Badge variant="warning" dot>Away</Badge>
              <Badge variant="error" dot>Busy</Badge>
              <Badge variant="neutral" dot>Offline</Badge>
            </div>
          ),
          code: `<Badge variant="success" dot>Online</Badge>\n<Badge variant="warning" dot>Away</Badge>`,
        },
        {
          title: 'Dismissible',
          preview: <BadgeDismissibleDemo />,
          code: `<Badge variant="primary" dismissible onDismiss={() => remove(tag)}>React</Badge>`,
        },
      ],
    },
  ];
}
