'use client';
import { Avatar, AvatarGroup } from '@/modules/ui/Avatar';
import type { ShowcaseComponent } from '../showcase.types';

function AvatarImageDemo() {
  const imageSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#3b82f6"/><text x="64" y="74" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="white">JD</text></svg>`
  )}`;

  return (
    <div className="flex items-center gap-4">
      <Avatar src={imageSrc} name="Jane Doe" size="md" />
      <Avatar src={imageSrc} name="Jane Doe" size="md" status="online" />
      <div>
        <p className="text-sm font-medium text-text-primary">Image source</p>
        <p className="text-xs text-text-secondary">Uses the same sizing and status rules</p>
      </div>
    </div>
  );
}

export function buildAvatarData(): ShowcaseComponent[] {
  return [
    {
      id: 'avatar',
      title: 'Avatar',
      category: 'Atom',
      abbr: 'Av',
      description: 'User profile photo or initials indicator. 5 sizes with optional status dot. When no image is provided, initials render on a bg-primary-subtle / text-primary tile.',
      filePath: 'modules/ui/Avatar.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

const sizeMap = {
  xs: 'h-6 w-6 text-xs',  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base', xl: 'h-16 w-16 text-lg',
};

function getInitials(name) {
  return name.trim().split(/\\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

export function Avatar({ src, name, size = 'md', className }) {
  const sizeClass = sizeMap[size];
  if (src) return <img src={src} alt={name} className={cn(sizeClass, 'rounded-full object-cover border border-border shrink-0', className)} />;
  return (
    <span aria-label={name} className={cn(sizeClass, 'rounded-full bg-primary-subtle text-primary font-semibold flex items-center justify-center shrink-0 border border-primary-subtle select-none', className)}>
      {getInitials(name)}
    </span>
  );
}`,
      playground: {
        controls: [
          { key: 'name',   label: 'Name',   type: 'text',   default: 'Jane Doe' },
          { key: 'size',   label: 'Size',   type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] as const, default: 'md' },
          { key: 'status', label: 'Status', type: 'select', options: ['none', 'online', 'away', 'busy', 'offline'] as const, default: 'none' },
        ],
        render: (p) => (
          <Avatar
            name={p.name as string}
            size={p.size as any}
            status={p.status !== 'none' ? (p.status as any) : undefined}
          />
        ),
        generateCode: (p) => {
          const attrs: string[] = [`name="${p.name}"`];
          if (p.size !== 'md')       attrs.push(`size="${p.size}"`);
          if (p.status !== 'none')   attrs.push(`status="${p.status}"`);
          return `<Avatar ${attrs.join(' ')} />`;
        },
      },
      variants: [
        {
          title: 'Initials (sizes)',
          preview: (
            <div className="flex items-center gap-3">
              {(['xs','sm','md','lg','xl'] as const).map((s) => <Avatar key={s} name="Jane Doe" size={s} />)}
            </div>
          ),
          code: `<Avatar name="Jane Doe" size="xs" />\n<Avatar name="Jane Doe" size="sm" />\n<Avatar name="Jane Doe" size="md" />\n<Avatar name="Jane Doe" size="lg" />\n<Avatar name="Jane Doe" size="xl" />`,
        },
        {
          title: 'With label',
          preview: (
            <div className="flex items-center gap-3">
              <Avatar name="John Smith" size="md" />
              <div>
                <p className="text-sm font-medium text-text-primary">John Smith</p>
                <p className="text-xs text-text-secondary">john@example.com</p>
              </div>
            </div>
          ),
          code: `<div className="flex items-center gap-3">
  <Avatar name="John Smith" size="md" />
  <div>
    <p className="text-sm font-medium text-text-primary">John Smith</p>
    <p className="text-xs text-text-secondary">john@example.com</p>
  </div>
</div>`,
        },
        {
          title: 'Image source',
          preview: <AvatarImageDemo />,
          code: `<Avatar src="/avatar.jpg" name="Jane Doe" />`,
        },
        {
          title: 'Status dot',
          preview: (
            <div className="flex items-center gap-4">
              <Avatar name="Alice" size="md" status="online" />
              <Avatar name="Bob" size="md" status="away" />
              <Avatar name="Carol" size="md" status="busy" />
              <Avatar name="Dave" size="md" status="offline" />
            </div>
          ),
          code: `<Avatar name="Alice" status="online" />\n<Avatar name="Bob" status="away" />\n<Avatar name="Carol" status="busy" />\n<Avatar name="Dave" status="offline" />`,
        },
        {
          title: 'AvatarGroup',
          preview: (
            <AvatarGroup
              avatars={[
                { name: 'Alice' },
                { name: 'Bob' },
                { name: 'Carol' },
                { name: 'Dave' },
                { name: 'Eve' },
                { name: 'Frank' },
              ]}
              max={4}
            />
          ),
          code: `<AvatarGroup\n  avatars={[{ name: 'Alice' }, { name: 'Bob' }, ...]}\n  max={4}\n/>`,
        },
      ],
    },
  ];
}
