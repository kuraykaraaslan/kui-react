'use client';
import { useState } from 'react';
import { AppBreadcrumbs } from '@/modules/app/AppBreadcrumbs';
import { AppFooter } from '@/modules/app/AppFooter';
import { ThemeSwitcher } from '@/modules/app/ThemeSwitcher';
import { ContextMenu } from '@/modules/app/ContextMenu';
import { ShareDialog, type ShareInvitee, type SharePermission } from '@/modules/app/ShareDialog';
import { CommentThread, type CommentThreadItem } from '@/modules/app/CommentThread';
import { MentionPicker, type MentionPickerUser } from '@/modules/app/MentionPicker';
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
    {
      id: 'share-dialog',
      title: 'ShareDialog',
      category: 'App',
      abbr: 'SD',
      since: '2026-05',
      description: 'Share modal: copyable link, email invitation with permission picker, and a list of current invitees with permission/remove controls.',
      filePath: 'modules/app/ShareDialog.tsx',
      sourceCode: `'use client';
import { ShareDialog } from '@/modules/app/ShareDialog';

<ShareDialog
  open={open}
  onClose={() => setOpen(false)}
  shareUrl="https://app.example.com/docs/x4y9"
  invitees={invitees}
  onInvite={(email, perm) => addInvitee(email, perm)}
  onRemove={(id) => removeInvitee(id)}
  onPermissionChange={(id, p) => updatePermission(id, p)}
/>`,
      variants: [
        {
          title: 'With invitees',
          layout: 'stack' as const,
          preview: <ShareDialogDemo />,
          code: `<ShareDialog
  open
  onClose={() => {}}
  shareUrl="https://app.example.com/docs/x4y9"
  invitees={[
    { id: '1', name: 'Alice Brooks',  email: 'alice@example.com', permission: 'owner' },
    { id: '2', name: 'Marcus Reed',   email: 'marcus@example.com', permission: 'editor' },
  ]}
/>`,
        },
        {
          title: 'Empty / link only',
          layout: 'stack' as const,
          preview: <ShareDialogEmptyDemo />,
          code: `<ShareDialog
  open
  onClose={() => {}}
  shareUrl="https://app.example.com/docs/x4y9"
  invitees={[]}
/>`,
        },
      ],
      composes: ['modal', 'avatar', 'button'],
      designTokens: ['--primary', '--surface-base', '--surface-raised', '--border', '--text-primary', '--text-secondary'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby', 'aria-describedby'],
        keyboardInteractions: [
          { keys: 'Escape', action: 'Close dialog' },
          { keys: 'Tab',    action: 'Cycle focus among interactive controls' },
        ],
      },
    },
    {
      id: 'comment-thread',
      title: 'CommentThread',
      category: 'App',
      abbr: 'CT',
      since: '2026-05',
      description: 'Generic threaded comments with replies, like counts, delete-own actions, and a composer. Domain-agnostic — pass comments + handlers.',
      filePath: 'modules/app/CommentThread.tsx',
      sourceCode: `'use client';
import { CommentThread, type CommentThreadItem } from '@/modules/app/CommentThread';

<CommentThread
  comments={comments}
  currentUserId="me"
  onReply={(parentId, body) => addComment(parentId, body)}
  onLike={(id, liked) => toggleLike(id, liked)}
  onDelete={(id) => removeComment(id)}
/>`,
      variants: [
        {
          title: 'With replies',
          layout: 'stack' as const,
          preview: <CommentThreadDemo />,
          code: `<CommentThread comments={comments} currentUserId="me" onReply={addComment} onLike={toggle} onDelete={remove} />`,
        },
        {
          title: 'Empty state',
          layout: 'stack' as const,
          preview: <CommentThreadEmptyDemo />,
          code: `<CommentThread comments={[]} onReply={addComment} />`,
        },
      ],
      composes: ['avatar', 'button'],
      designTokens: ['--surface-overlay', '--surface-base', '--border', '--text-primary', '--text-secondary', '--text-disabled', '--primary'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['aria-label="Comments"', 'aria-pressed (like)', 'aria-expanded (reply)'],
      },
    },
    {
      id: 'mention-picker',
      title: 'MentionPicker',
      category: 'App',
      abbr: 'MP',
      since: '2026-05',
      description: '@-trigger autocomplete picker. Headless: takes users + query + position, fires onSelect. Keyboard nav (ArrowUp/Down, Enter/Tab, Escape).',
      filePath: 'modules/app/MentionPicker.tsx',
      sourceCode: `'use client';
import { MentionPicker } from '@/modules/app/MentionPicker';

<MentionPicker
  users={users}
  query={query}
  position={{ top, left }}
  onSelect={(u) => insertMention(u)}
  onCancel={() => closePicker()}
/>`,
      variants: [
        {
          title: 'Filtered list',
          layout: 'stack' as const,
          preview: <MentionPickerDemo />,
          code: `<MentionPicker users={users} query="ay" onSelect={(u) => {}} onCancel={() => {}} />`,
        },
        {
          title: 'Empty results',
          layout: 'stack' as const,
          preview: <MentionPickerEmptyDemo />,
          code: `<MentionPicker users={users} query="zzz" onSelect={(u) => {}} onCancel={() => {}} />`,
        },
      ],
      composes: ['avatar'],
      designTokens: ['--surface-raised', '--surface-overlay', '--border', '--text-primary', '--text-secondary', '--text-disabled'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="listbox"', 'role="option"', 'aria-selected'],
        keyboardInteractions: [
          { keys: 'ArrowDown / ArrowUp', action: 'Move selection' },
          { keys: 'Enter / Tab',          action: 'Insert highlighted mention' },
          { keys: 'Escape',               action: 'Cancel picker' },
        ],
      },
    },
  ];
}

const SAMPLE_INVITEES: ShareInvitee[] = [
  { id: '1', name: 'Alice Brooks',  email: 'alice@example.com',  avatarUrl: null, permission: 'owner' },
  { id: '2', name: 'Marcus Reed',   email: 'marcus@example.com', avatarUrl: null, permission: 'editor' },
  { id: '3', name: 'Priya Sharma',  email: 'priya@example.com',  avatarUrl: null, permission: 'viewer' },
];

function ShareDialogDemo() {
  const [invitees, setInvitees] = useState<ShareInvitee[]>(SAMPLE_INVITEES);
  return (
    <div
      id="share-dialog-preview-with"
      className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base"
      style={{ minHeight: 620, transform: 'translateZ(0)' }}
    >
      <ShareDialog
        open
        onClose={() => undefined}
        shareUrl="https://app.example.com/docs/x4y9-zk7"
        invitees={invitees}
        onInvite={(email, permission) => {
          setInvitees((prev) => [
            ...prev,
            { id: String(prev.length + 1), name: email.split('@')[0], email, avatarUrl: null, permission },
          ]);
        }}
        onRemove={(id) => setInvitees((prev) => prev.filter((i) => i.id !== id))}
        onPermissionChange={(id, permission: SharePermission) =>
          setInvitees((prev) => prev.map((i) => (i.id === id ? { ...i, permission } : i)))
        }
        portalTarget="#share-dialog-preview-with"
      />
    </div>
  );
}

function ShareDialogEmptyDemo() {
  return (
    <div
      id="share-dialog-preview-empty"
      className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base"
      style={{ minHeight: 360, transform: 'translateZ(0)' }}
    >
      <ShareDialog
        open
        onClose={() => undefined}
        shareUrl="https://app.example.com/projects/empty-share"
        invitees={[]}
        portalTarget="#share-dialog-preview-empty"
      />
    </div>
  );
}

const SAMPLE_COMMENTS: CommentThreadItem[] = [
  {
    id: 'c1',
    author: { id: 'u1', name: 'Alice Brooks', avatarUrl: null },
    body: 'I think this feature would be great for the landing page.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    likeCount: 4,
    likedByMe: true,
    replies: [
      {
        id: 'c2',
        author: { id: 'me', name: 'You', avatarUrl: null },
        body: 'Agreed. I can open a PR.',
        createdAt: new Date(Date.now() - 1000 * 60 * 12),
        likeCount: 1,
      },
    ],
  },
  {
    id: 'c3',
    author: { id: 'u2', name: 'Marcus Reed', avatarUrl: null },
    body: 'The mobile breakpoint should be reviewed as well.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likeCount: 0,
  },
];

function CommentThreadDemo() {
  const [comments, setComments] = useState<CommentThreadItem[]>(SAMPLE_COMMENTS);
  return (
    <div className="w-full">
      <CommentThread
        comments={comments}
        currentUserId="me"
        onReply={(parentId, body) => {
          const next: CommentThreadItem = {
            id: 'r' + Math.random().toString(36).slice(2, 8),
            author: { id: 'me', name: 'You', avatarUrl: null },
            body,
            createdAt: new Date(),
          };
          if (!parentId) {
            setComments((prev) => [...prev, next]);
            return;
          }
          function attach(list: CommentThreadItem[]): CommentThreadItem[] {
            return list.map((c) =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies ?? []), next] }
                : c.replies
                ? { ...c, replies: attach(c.replies) }
                : c,
            );
          }
          setComments((prev) => attach(prev));
        }}
        onLike={(id, liked) => {
          function walk(list: CommentThreadItem[]): CommentThreadItem[] {
            return list.map((c) =>
              c.id === id
                ? { ...c, likedByMe: liked, likeCount: (c.likeCount ?? 0) + (liked ? 1 : -1) }
                : c.replies
                ? { ...c, replies: walk(c.replies) }
                : c,
            );
          }
          setComments(walk);
        }}
      />
    </div>
  );
}

function CommentThreadEmptyDemo() {
  return (
    <CommentThread
      comments={[]}
      currentUserId="me"
      onReply={() => undefined}
    />
  );
}

const SAMPLE_USERS: MentionPickerUser[] = [
  { id: 'u1', name: 'Alice Brooks',   handle: 'aliceb',  avatarUrl: null },
  { id: 'u2', name: 'Marcus Reed',    handle: 'marcusr', avatarUrl: null },
  { id: 'u3', name: 'Priya Sharma',   handle: 'priyas',  avatarUrl: null },
  { id: 'u4', name: 'Diego Alvarez',  handle: 'diegoa',  avatarUrl: null },
];

function MentionPickerDemo() {
  const [query, setQuery] = useState('al');
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="w-full max-w-xs">
        <label htmlFor="mp-query" className="block text-sm font-medium text-text-primary mb-1">
          Query
        </label>
        <input
          id="mp-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        />
      </div>
      <div className="relative">
        <MentionPicker
          users={SAMPLE_USERS}
          query={query}
          onSelect={() => undefined}
          onCancel={() => undefined}
        />
      </div>
    </div>
  );
}

function MentionPickerEmptyDemo() {
  return (
    <div className="flex justify-center py-6">
      <MentionPicker
        users={SAMPLE_USERS}
        query="zzz"
        onSelect={() => undefined}
        onCancel={() => undefined}
      />
    </div>
  );
}
