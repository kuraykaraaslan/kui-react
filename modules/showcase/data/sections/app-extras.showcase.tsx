'use client';
import { AppBreadcrumbs } from '@/modules/app/AppBreadcrumbs';
import { AppFooter } from '@/modules/app/AppFooter';
import { ThemeSwitcher } from '@/modules/app/ThemeSwitcher';
import { ContextMenu } from '@/modules/app/ContextMenu';
import { Badge } from '@/modules/ui/Badge';
import { BrandLogo } from '@/modules/ui/BrandLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faCut,
  faPaste,
  faTrash,
  faPen,
  faLink,
  faDownload,
  faShareNodes,
  faFolder,
  faFile,
  faEye,
  faCodeBranch,
  faTag,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import type { ShowcaseComponent } from '../showcase.types';

function AppBreadcrumbsBasicDemo() {
  return (
    <div className="w-full">
      <AppBreadcrumbs
        title="Project Atlas"
        description="Internal tooling for the design system team"
        items={[
          { label: 'Workspace', href: '#' },
          { label: 'Projects', href: '#' },
          { label: 'Atlas' },
        ]}
        badge={<Badge variant="info" size="sm">Beta</Badge>}
      />
    </div>
  );
}

function AppBreadcrumbsDeepDemo() {
  return (
    <div className="w-full">
      <AppBreadcrumbs
        title="invoice-2026-05-001.pdf"
        items={[
          { label: 'Home', href: '#' },
          { label: 'Accounts', href: '#' },
          { label: 'Acme Inc', href: '#' },
          { label: 'Invoices', href: '#' },
          { label: '2026-05', href: '#' },
          { label: 'invoice-2026-05-001.pdf' },
        ]}
      />
    </div>
  );
}

function AppFooterDemo() {
  return (
    <div className="w-full">
      <AppFooter
        logo={
          <div className="flex items-center gap-2">
            <BrandLogo size="sm">K</BrandLogo>
            <span className="font-semibold text-text-primary">KUIreact</span>
          </div>
        }
        nav={
          <>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">Docs</a>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">Pricing</a>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">Status</a>
          </>
        }
        version="0.2.0"
        status="operational"
        copyright="© 2026 KUIreact"
      />
    </div>
  );
}

function ThemeSwitcherDemo() {
  return (
    <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface-raised">
      <span className="text-sm text-text-secondary">Try it:</span>
      <ThemeSwitcher />
    </div>
  );
}

export function buildAppExtrasData(): ShowcaseComponent[] {
  return [
    {
      id: 'app-breadcrumbs',
      title: 'AppBreadcrumbs',
      category: 'App',
      abbr: 'ABc',
      description: 'Page header with breadcrumb trail, title, description, and optional status badge. Collapses to a Breadcrumb + dropdown menu on mobile for deep paths.',
      filePath: 'modules/app/AppBreadcrumbs.tsx',
      sourceCode: `'use client';
import { AppBreadcrumbs } from '@/modules/app/AppBreadcrumbs';
import { Badge } from '@/modules/ui/Badge';

<AppBreadcrumbs
  title="Project Atlas"
  description="Internal tooling for the design system team"
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects',  href: '/projects' },
    { label: 'Atlas' },
  ]}
  badge={<Badge variant="info" size="sm">Beta</Badge>}
/>`,
      variants: [
        {
          title: 'With title + badge',
          layout: 'stack' as const,
          preview: <AppBreadcrumbsBasicDemo />,
          code: `<AppBreadcrumbs
  title="Project Atlas"
  description="Internal tooling for the design system team"
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects',  href: '/projects' },
    { label: 'Atlas' },
  ]}
  badge={<Badge variant="info" size="sm">Beta</Badge>}
/>`,
        },
        {
          title: 'Deep path',
          layout: 'stack' as const,
          preview: <AppBreadcrumbsDeepDemo />,
          code: `<AppBreadcrumbs
  title="invoice-2026-05-001.pdf"
  items={[
    { label: 'Home',     href: '/' },
    { label: 'Accounts', href: '/accounts' },
    { label: 'Acme Inc', href: '/accounts/acme' },
    { label: 'Invoices', href: '/accounts/acme/invoices' },
    { label: '2026-05',  href: '/accounts/acme/invoices/2026-05' },
    { label: 'invoice-2026-05-001.pdf' },
  ]}
/>`,
        },
      ],
    },
    {
      id: 'app-footer',
      title: 'AppFooter',
      category: 'App',
      abbr: 'AFt',
      description: 'Two-row application footer with logo, navigation links, system status badge, version, copyright, and social slot.',
      filePath: 'modules/app/AppFooter.tsx',
      sourceCode: `'use client';
import { AppFooter } from '@/modules/app/AppFooter';

<AppFooter
  logo={<span className="font-semibold">KUIreact</span>}
  nav={<><a href="/docs">Docs</a><a href="/status">Status</a></>}
  version="0.2.0"
  status="operational"          // 'operational' | 'degraded' | 'outage'
  copyright="© 2026 KUIreact"
/>`,
      variants: [
        {
          title: 'Operational, with nav + version',
          layout: 'stack' as const,
          preview: <AppFooterDemo />,
          code: `<AppFooter
  logo={<><BrandLogo size="sm">K</BrandLogo><span>KUIreact</span></>}
  nav={<><a href="#">Docs</a><a href="#">Pricing</a><a href="#">Status</a></>}
  version="0.2.0"
  status="operational"
  copyright="© 2026 KUIreact"
/>`,
        },
      ],
    },
    {
      id: 'theme-switcher',
      title: 'ThemeSwitcher',
      category: 'App',
      abbr: 'TS',
      description: 'Tri-state theme selector (light / dark / system). Persists the choice to localStorage and toggles the .dark class on <html>. Mounts safely on the server with a placeholder until hydrated.',
      filePath: 'modules/app/ThemeSwitcher.tsx',
      sourceCode: `'use client';
import { ThemeSwitcher } from '@/modules/app/ThemeSwitcher';

// Drop into any layout — manages its own state.
<ThemeSwitcher />`,
      variants: [
        {
          title: 'Default',
          preview: <ThemeSwitcherDemo />,
          code: `<ThemeSwitcher />`,
        },
      ],
    },
    {
      id: 'context-menu',
      title: 'ContextMenu',
      category: 'App',
      abbr: 'CM',
      description:
        'Right-click context menu. Wraps any element as a trigger. Supports item groups, keyboard shortcuts, separators, danger items, and disabled items. Positions itself via viewport-aware boundary detection, auto-flips when near screen edges. Full keyboard navigation: ↑↓ arrows, Enter, Escape.',
      filePath: 'modules/app/ContextMenu.tsx',
      sourceCode: `'use client';
import { ContextMenu } from '@/modules/app/ContextMenu';
import type { ContextMenuItem } from '@/modules/app/ContextMenu';

const items: ContextMenuItem[] = [
  { label: 'Copy',   icon: <Icon />, shortcut: '⌘C', onClick: () => {} },
  { label: 'Paste',  icon: <Icon />, shortcut: '⌘V', onClick: () => {} },
  { type: 'separator' },
  { label: 'Delete', icon: <Icon />, danger: true,   onClick: () => {} },
];

<ContextMenu items={items}>
  <div>Right-click anywhere here</div>
</ContextMenu>`,
      variants: [
        {
          title: 'Text editor — clipboard + format actions',
          layout: 'stack' as const,
          preview: (
            <ContextMenu
              items={[
                { label: 'Cut',    icon: <FontAwesomeIcon icon={faCut}   className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌘X', onClick: () => {} },
                { label: 'Copy',   icon: <FontAwesomeIcon icon={faCopy}  className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌘C', onClick: () => {} },
                { label: 'Paste',  icon: <FontAwesomeIcon icon={faPaste} className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌘V', onClick: () => {} },
                { type: 'separator' },
                { label: 'Copy link', icon: <FontAwesomeIcon icon={faLink} className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌘⇧C', onClick: () => {} },
                { type: 'separator' },
                { label: 'Rename', icon: <FontAwesomeIcon icon={faPen}   className="w-3.5 h-3.5" aria-hidden="true" />, onClick: () => {} },
                { label: 'Delete', icon: <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌫',   danger: true, onClick: () => {} },
              ]}
            >
              <div className="rounded-xl border-2 border-dashed border-border bg-surface-raised p-8 text-center text-sm text-text-secondary select-none cursor-default hover:border-border-strong hover:bg-surface-overlay transition-colors">
                Right-click anywhere in this area
              </div>
            </ContextMenu>
          ),
          code: `<ContextMenu items={[
  { label: 'Cut',      icon: <Icon />, shortcut: '⌘X' },
  { label: 'Copy',     icon: <Icon />, shortcut: '⌘C' },
  { label: 'Paste',    icon: <Icon />, shortcut: '⌘V' },
  { type: 'separator' },
  { label: 'Copy link',icon: <Icon />, shortcut: '⌘⇧C' },
  { type: 'separator' },
  { label: 'Rename',   icon: <Icon /> },
  { label: 'Delete',   icon: <Icon />, danger: true, shortcut: '⌫' },
]}>
  <div>Right-click anywhere in this area</div>
</ContextMenu>`,
        },
        {
          title: 'File manager — groups + shortcut hint',
          layout: 'stack' as const,
          preview: (
            <div className="grid grid-cols-3 gap-3 p-4 bg-surface-raised rounded-xl border border-border">
              {['Report Q1.pdf', 'Design System.fig', 'README.md'].map((name) => (
                <ContextMenu
                  key={name}
                  items={[
                    { type: 'group', label: 'Actions' },
                    { label: 'Open',     icon: <FontAwesomeIcon icon={faEye}        className="w-3.5 h-3.5" aria-hidden="true" />, onClick: () => {} },
                    { label: 'Download', icon: <FontAwesomeIcon icon={faDownload}   className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌘D', onClick: () => {} },
                    { label: 'Share',    icon: <FontAwesomeIcon icon={faShareNodes} className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌘⇧S', onClick: () => {} },
                    { type: 'separator' },
                    { type: 'group', label: 'Organise' },
                    { label: 'Move to…', icon: <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />, onClick: () => {} },
                    { label: 'Add tag',  icon: <FontAwesomeIcon icon={faTag}        className="w-3.5 h-3.5" aria-hidden="true" />, onClick: () => {} },
                    { type: 'separator' },
                    { label: 'Delete',   icon: <FontAwesomeIcon icon={faTrash}      className="w-3.5 h-3.5" aria-hidden="true" />, danger: true, onClick: () => {} },
                  ]}
                >
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-surface-base hover:bg-surface-overlay cursor-default select-none transition-colors text-center">
                    <FontAwesomeIcon
                      icon={name.endsWith('.fig') ? faFolder : faFile}
                      className="w-8 h-8 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-text-secondary truncate w-full">{name}</span>
                  </div>
                </ContextMenu>
              ))}
            </div>
          ),
          code: `<ContextMenu items={[
  { type: 'group', label: 'Actions' },
  { label: 'Open',     icon: <Icon /> },
  { label: 'Download', icon: <Icon />, shortcut: '⌘D' },
  { label: 'Share',    icon: <Icon />, shortcut: '⌘⇧S' },
  { type: 'separator' },
  { type: 'group', label: 'Organise' },
  { label: 'Move to…', icon: <Icon /> },
  { label: 'Add tag',  icon: <Icon /> },
  { type: 'separator' },
  { label: 'Delete', icon: <Icon />, danger: true },
]}>
  <FileCard name="Report Q1.pdf" />
</ContextMenu>`,
        },
        {
          title: 'Code branch — some items disabled',
          layout: 'stack' as const,
          preview: (
            <ContextMenu
              items={[
                { label: 'View diff',    icon: <FontAwesomeIcon icon={faCodeBranch} className="w-3.5 h-3.5" aria-hidden="true" />, onClick: () => {} },
                { label: 'Copy branch name', icon: <FontAwesomeIcon icon={faCopy} className="w-3.5 h-3.5" aria-hidden="true" />, shortcut: '⌘C', onClick: () => {} },
                { type: 'separator' },
                { label: 'Merge into main', icon: <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />, disabled: true, onClick: () => {} },
                { label: 'Cherry-pick', disabled: true, onClick: () => {} },
                { type: 'separator' },
                { label: 'Delete branch', icon: <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />, danger: true, onClick: () => {} },
              ]}
            >
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-border bg-surface-raised cursor-default select-none hover:bg-surface-overlay transition-colors w-fit">
                <FontAwesomeIcon icon={faCodeBranch} className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
                <span className="text-sm font-medium text-text-primary">feature/context-menu</span>
                <span className="text-xs text-text-disabled">(right-click)</span>
              </div>
            </ContextMenu>
          ),
          code: `<ContextMenu items={[
  { label: 'View diff',        icon: <Icon /> },
  { label: 'Copy branch name', icon: <Icon />, shortcut: '⌘C' },
  { type: 'separator' },
  { label: 'Merge into main',  icon: <Icon />, disabled: true },
  { label: 'Cherry-pick',                      disabled: true },
  { type: 'separator' },
  { label: 'Delete branch',    icon: <Icon />, danger: true },
]}>
  <BranchRow name="feature/context-menu" />
</ContextMenu>`,
        },
      ],
    },
  ];
}
