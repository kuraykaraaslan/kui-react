'use client';

import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import { Card } from '@/modules/ui/Card';
import { PageHeader } from '@/modules/ui/PageHeader';
import { Slider } from '@/modules/ui/Slider';
import { StatCard } from '@/modules/ui/StatCard';
import type { ShowcaseComponent } from '../showcase.types';

function SliderDemo() {
  const slides = [
    <div key="a" className="h-40 bg-primary-subtle flex items-center justify-center rounded-xl"><span className="text-lg font-semibold text-primary">Slide 1</span></div>,
    <div key="b" className="h-40 bg-success-subtle flex items-center justify-center rounded-xl"><span className="text-lg font-semibold text-success-fg">Slide 2</span></div>,
    <div key="c" className="h-40 bg-warning-subtle flex items-center justify-center rounded-xl"><span className="text-lg font-semibold text-warning">Slide 3</span></div>,
  ];
  return <Slider slides={slides} />;
}

function SliderAutoPlayDemo() {
  const slides = [
    <div key="a" className="h-36 bg-primary flex items-center justify-center rounded-xl"><span className="text-base font-semibold text-white">Auto A</span></div>,
    <div key="b" className="h-36 bg-secondary flex items-center justify-center rounded-xl"><span className="text-base font-semibold text-white">Auto B</span></div>,
    <div key="c" className="h-36 bg-error flex items-center justify-center rounded-xl"><span className="text-base font-semibold text-white">Auto C</span></div>,
  ];
  return <Slider slides={slides} autoPlay autoPlayInterval={2000} />;
}

export function buildContainerData(): ShowcaseComponent[] {
  return [
    {
      id: 'card',
      title: 'Card',
      category: 'Organism',
      abbr: 'Ca',
      description: 'Content container with raised / flat / outline variants. Supports title, subtitle, headerRight, footer slots and loading skeleton state.',
      filePath: 'modules/ui/Card.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

export function Card({ title, subtitle, headerRight, footer, children, variant = 'raised', className }) {
  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', variant === 'raised' && 'bg-surface-raised shadow-sm', variant === 'flat' && 'bg-surface-base', variant === 'outline' && 'bg-transparent', className)}>
      {(title || headerRight) && (
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
          <div>
            {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}
      {children && <div className="px-6 py-4">{children}</div>}
      {footer && <div className="px-6 py-3 border-t border-border bg-surface-base">{footer}</div>}
    </div>
  );
}`,
      playground: {
        controls: [
          { key: 'variant',   label: 'Variant',   type: 'select',  options: ['raised', 'flat', 'outline'] as const, default: 'raised' },
          { key: 'title',     label: 'Title',     type: 'text',    default: 'User profile' },
          { key: 'subtitle',  label: 'Subtitle',  type: 'text',    default: 'Manage your account details' },
          { key: 'hoverable', label: 'Hoverable', type: 'boolean', default: false },
          { key: 'loading',   label: 'Loading',   type: 'boolean', default: false },
        ],
        render: (p) => (
          <div className="w-full max-w-sm">
            <Card
              variant={p.variant as any}
              title={p.title as string}
              subtitle={p.subtitle as string}
              hoverable={p.hoverable as boolean}
              loading={p.loading as boolean}
            >
              <p className="text-sm text-text-secondary">Card body content goes here.</p>
            </Card>
          </div>
        ),
        generateCode: (p) => {
          const attrs: string[] = [];
          if (p.variant !== 'raised') attrs.push(`variant="${p.variant}"`);
          if (p.title)                attrs.push(`title="${p.title}"`);
          if (p.subtitle)             attrs.push(`subtitle="${p.subtitle}"`);
          if (p.hoverable)            attrs.push('hoverable');
          if (p.loading)              attrs.push('loading');
          const a = attrs.length ? '\n  ' + attrs.join('\n  ') + '\n' : '';
          return p.loading ? `<Card${a}/>` : `<Card${a}>\n  <p>Card body content.</p>\n</Card>`;
        },
      },
      variants: [
        {
          title: 'Raised',
          preview: (
            <div className="w-full max-w-sm">
              <Card title="User profile" subtitle="Manage your account details" headerRight={<Badge variant="success">Active</Badge>}>
                <p className="text-sm text-text-secondary">Card body content goes here.</p>
              </Card>
            </div>
          ),
          code: `<Card title="User profile" subtitle="Manage your account" headerRight={<Badge variant="success">Active</Badge>}>\n  <p>Card body content goes here.</p>\n</Card>`,
        },
        {
          title: 'With footer',
          preview: (
            <div className="w-full max-w-sm">
              <Card title="Confirm deletion" footer={<div className="flex gap-2"><Button variant="outline" size="sm">Cancel</Button><Button variant="danger" size="sm">Delete</Button></div>}>
                <p className="text-sm text-text-secondary">This action is irreversible.</p>
              </Card>
            </div>
          ),
          code: `<Card title="Confirm deletion" footer={<><Button variant="outline" size="sm">Cancel</Button><Button variant="danger" size="sm">Delete</Button></>}>\n  <p>This action is irreversible.</p>\n</Card>`,
        },
        {
          title: 'Flat',
          preview: (
            <div className="w-full max-w-sm">
              <Card variant="flat" title="Flat card">
                <p className="text-sm text-text-secondary">No shadow, uses page background color.</p>
              </Card>
            </div>
          ),
          code: `<Card variant="flat" title="Flat card">\n  <p>No shadow, uses page background color.</p>\n</Card>`,
        },
        {
          title: 'Outline',
          preview: (
            <div className="w-full max-w-sm">
              <Card variant="outline" title="Outline card">
                <p className="text-sm text-text-secondary">Transparent background, border only.</p>
              </Card>
            </div>
          ),
          code: `<Card variant="outline" title="Outline card">\n  <p>Transparent background, border only.</p>\n</Card>`,
        },
        {
          title: 'Clickable / hoverable',
          preview: (
            <div className="w-full max-w-sm space-y-3">
              <Card title="Clickable card" subtitle="Tap to navigate" onClick={() => alert('Card clicked!')} >
                <p className="text-sm text-text-secondary">This card is a button element with hover + focus ring.</p>
              </Card>
              <Card title="Hoverable only" subtitle="Hover for shadow" hoverable>
                <p className="text-sm text-text-secondary">Not clickable, just visually responsive.</p>
              </Card>
            </div>
          ),
          code: `<Card title="Clickable" onClick={() => navigate('/detail')}>...</Card>\n<Card title="Hoverable" hoverable>...</Card>`,
          layout: 'stack' as const,
        },
        {
          title: 'Loading skeleton',
          preview: (
            <div className="w-full max-w-sm">
              <Card loading />
            </div>
          ),
          code: `<Card loading />`,
        },
      ],
    },
    {
      id: 'page-header',
      title: 'PageHeader',
      category: 'Organism',
      abbr: 'Ph',
      description: 'Page title + subtitle + optional badge + action buttons. Supports 5 button variants (primary/secondary/outline/danger/ghost); rendered as a link with href or as a button.',
      filePath: 'modules/ui/PageHeader.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

const variantMap = {
  primary:   'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
  outline:   'border border-border text-text-primary hover:bg-surface-overlay',
  danger:    'bg-error text-text-inverse hover:opacity-90',
  ghost:     'bg-transparent text-text-primary hover:bg-surface-overlay',
};

export function PageHeader({ title, subtitle, badge, actions, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 pb-5 border-b border-border', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-text-primary leading-tight">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {actions?.length > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          {actions.map((action, i) => (
            <button key={i} type="button" onClick={action.onClick} disabled={action.disabled} className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50', variantMap[action.variant ?? 'primary'])}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}`,
      playground: {
        controls: [
          { key: 'title',       label: 'Title',        type: 'text',    default: 'Users' },
          { key: 'subtitle',    label: 'Subtitle',     type: 'text',    default: 'Manage your team members and their permissions.' },
          { key: 'showActions', label: 'Show actions', type: 'boolean', default: true },
        ],
        render: (p) => (
          <div className="w-full">
            <PageHeader
              title={p.title as string}
              subtitle={p.subtitle as string}
              actions={p.showActions ? [
                { label: 'Export', variant: 'outline' as const },
                { label: '+ Invite user', variant: 'primary' as const },
              ] : []}
            />
          </div>
        ),
        generateCode: (p) => {
          const lines = [`title="${p.title}"`, `subtitle="${p.subtitle}"`];
          if (p.showActions) lines.push(`actions={[{ label: 'Export', variant: 'outline' }, { label: '+ Invite user', variant: 'primary' }]}`);
          return `<PageHeader\n  ${lines.join('\n  ')}\n/>`;
        },
      },
      variants: [
        {
          title: 'With actions',
          layout: 'stack' as const,
          preview: (
            <div className="w-full">
              <PageHeader
                title="Users"
                subtitle="Manage your team members and their permissions."
                badge={<Badge variant="info">48 members</Badge>}
                actions={[
                  { label: 'Export', variant: 'outline' },
                  { label: '+ Invite user', variant: 'primary' },
                ]}
              />
            </div>
          ),
          code: `<PageHeader\n  title="Users"\n  subtitle="Manage your team members."\n  badge={<Badge variant="info">48 members</Badge>}\n  actions={[\n    { label: 'Export', variant: 'outline' },\n    { label: '+ Invite user', variant: 'primary' },\n  ]}\n/>`,
        },
        {
          title: 'Danger action',
          layout: 'stack' as const,
          preview: (
            <div className="w-full">
              <PageHeader
                title="Danger Zone"
                subtitle="Irreversible actions. Proceed with caution."
                actions={[
                  { label: 'Archive', variant: 'outline' },
                  { label: 'Delete project', variant: 'danger' },
                ]}
              />
            </div>
          ),
          code: `<PageHeader\n  title="Danger Zone"\n  subtitle="Irreversible actions."\n  actions={[\n    { label: 'Archive', variant: 'outline' },\n    { label: 'Delete project', variant: 'danger' },\n  ]}\n/>`,
        },
        {
          title: 'Minimal',
          layout: 'stack' as const,
          preview: (
            <div className="w-full">
              <PageHeader title="Settings" subtitle="Configure your workspace preferences." />
            </div>
          ),
          code: `<PageHeader title="Settings" subtitle="Configure your workspace preferences." />`,
        },
      ],
    },
    {
      id: 'slider',
      title: 'Slider',
      category: 'Molecule',
      abbr: 'Sl',
      description: 'Accessible carousel. Includes role="region" + aria-roledescription="carousel" and per-slide aria labels. Supports autoplay, arrow keys, and dot navigation.',
      filePath: 'modules/ui/Slider.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\nimport { useState, useEffect, useCallback, useRef } from 'react';\n\nexport function Slider({ slides, autoPlay = false, autoPlayInterval = 4000, showDots = true, showArrows = true, loop = true, className, slideClassName }) {\n  const [current, setCurrent] = useState(0);\n  const total = slides.length;\n  const goTo = useCallback((index) => setCurrent(loop ? ((index + total) % total) : Math.max(0, Math.min(index, total - 1))), [loop, total]);\n  const prev = () => goTo(current - 1);\n  const next = () => goTo(current + 1);\n  useEffect(() => {\n    if (!autoPlay || total <= 1) return;\n    const t = setInterval(() => setCurrent((c) => (c + 1) % total), autoPlayInterval);\n    return () => clearInterval(t);\n  }, [autoPlay, autoPlayInterval, total]);\n  return (\n    <div className={cn('relative overflow-hidden rounded-xl', className)} role="region" aria-label="Content slider" aria-roledescription="carousel">\n      <div className="flex transition-transform duration-350 ease-in-out" style={{ transform: \`translateX(-\${current * 100}%)\` }}>\n        {slides.map((slide, i) => (\n          <div key={i} role="group" aria-roledescription="slide" aria-label={\`Slide \${i + 1} of \${total}\`} aria-hidden={i !== current} className={cn('w-full shrink-0', slideClassName)}>{slide}</div>\n        ))}\n      </div>\n      {showArrows && (loop || current > 0) && <button onClick={prev} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">‹</button>}\n      {showArrows && (loop || current < total - 1) && <button onClick={next} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">›</button>}\n      {showDots && total > 1 && (\n        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" role="tablist" aria-label="Slide indicators">\n          {slides.map((_, i) => <button key={i} role="tab" aria-selected={i === current} aria-label={\`Go to slide \${i + 1}\`} onClick={() => goTo(i)} className={cn('h-2 rounded-full transition-all', i === current ? 'w-5 bg-white' : 'w-2 bg-white/40')} />)}\n        </div>\n      )}\n    </div>\n  );\n}`,
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-md">
              <SliderDemo />
            </div>
          ),
          code: `<Slider\n  slides={[\n    <HeroSlide title="Slide 1" />,\n    <HeroSlide title="Slide 2" />,\n    <HeroSlide title="Slide 3" />,\n  ]}\n/>`,
        },
        {
          title: 'Auto-play',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-md">
              <SliderAutoPlayDemo />
            </div>
          ),
          code: `<Slider slides={slides} autoPlay autoPlayInterval={2000} />`,
        },
        {
          title: 'No arrows / no loop',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-md">
              <Slider
                loop={false}
                showArrows={false}
                slides={[
                  <div key="a" className="h-32 bg-surface-sunken flex items-center justify-center rounded-xl text-sm text-text-secondary">Slide 1 — dots only, no loop</div>,
                  <div key="b" className="h-32 bg-surface-sunken flex items-center justify-center rounded-xl text-sm text-text-secondary">Slide 2</div>,
                  <div key="c" className="h-32 bg-surface-sunken flex items-center justify-center rounded-xl text-sm text-text-secondary">Slide 3</div>,
                ]}
              />
            </div>
          ),
          code: `<Slider slides={slides} showArrows={false} loop={false} />`,
        },
      ],
    },

    {
      id: 'stat-card',
      title: 'StatCard',
      category: 'Organism',
      abbr: 'Sc',
      description: 'Compact metric display card with value, label, and optional accent color.',
      filePath: 'modules/ui/StatCard.tsx',
      sourceCode: `import { StatCard } from '@/modules/ui/StatCard';

<StatCard label="Total Users" value={1284} />
<StatCard label="Active"      value={947}  accent="text-success" />
<StatCard label="Cancelled"   value={12}   accent="text-error" />`,
      variants: [
        {
          title: 'Variants',
          layout: 'stack' as const,
          preview: (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total Users"  value={1284} />
              <StatCard label="Active"       value={947}  accent="text-success" />
              <StatCard label="Transferred"  value={38}   accent="text-info" />
              <StatCard label="Cancelled"    value={12}   accent="text-error" />
            </div>
          ),
          code: `<StatCard label="Total Users" value={1284} />
<StatCard label="Active"      value={947}  accent="text-success" />
<StatCard label="Transferred" value={38}   accent="text-info" />
<StatCard label="Cancelled"   value={12}   accent="text-error" />`,
        },
      ],
    },
  ];
}
