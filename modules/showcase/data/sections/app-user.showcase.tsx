'use client';
import { UserMenu } from '@/modules/domains/common/user/UserMenu';
import { GlobalSearch, type SearchResult } from '@/modules/app/GlobalSearch';
import { AppCommandBar, type CommandItem } from '@/modules/app/AppCommandBar';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faCreditCard, faReceipt, faPlus } from '@fortawesome/free-solid-svg-icons';

const DEMO_USER = {
  userId: 'demo-1',
  email: 'jane@acme.com',
  userRole: 'ADMIN' as const,
  userStatus: 'ACTIVE' as const,
  userProfile: { name: 'Jane Doe', profilePicture: null },
};

const SEARCH_RESULTS: SearchResult[] = [
  { id: 'dash',        label: 'Dashboard',     description: 'Overview page',               icon: <FontAwesomeIcon icon={faHouse}       className="w-3.5 h-3.5" />, category: 'Pages'    },
  { id: 'users',       label: 'Users',          description: 'Manage team members',         icon: <FontAwesomeIcon icon={faUsers}       className="w-3.5 h-3.5" />, category: 'Pages'    },
  { id: 'billing',     label: 'Billing',        description: 'Invoices and plans',          icon: <FontAwesomeIcon icon={faCreditCard}  className="w-3.5 h-3.5" />, category: 'Settings' },
  { id: 'audit',       label: 'Audit Logs',     description: 'Security and activity logs',  icon: <FontAwesomeIcon icon={faReceipt}     className="w-3.5 h-3.5" />, category: 'Settings' },
  { id: 'new-project', label: 'Create Project', description: 'Quick action',                icon: <FontAwesomeIcon icon={faPlus}        className="w-3.5 h-3.5" />, category: 'Actions'  },
];

function UserMenuDefaultDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <UserMenu user={DEMO_USER} />
    </div>
  );
}

function UserMenuCustomDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <UserMenu
        user={{
          userId: 'demo-2',
          email: 'john@acme.com',
          userRole: 'AUTHOR' as const,
          userStatus: 'ACTIVE' as const,
          userProfile: { name: 'John Smith', profilePicture: null },
        }}
        items={[
          { label: 'View Profile',  icon: '👤', onClick: () => {} },
          { label: 'Billing',       icon: '💳', onClick: () => {} },
          { label: 'Team Settings', icon: '👥', onClick: () => {} },
          { type: 'separator' },
          { label: 'Sign out',      icon: '↩️', danger: true, onClick: () => {} },
        ]}
      />
    </div>
  );
}

function GlobalSearchStandaloneDemo() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState('Nothing selected');

  function handleSearch(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    setResults(
      SEARCH_RESULTS.filter((item) => (
        item.label.toLowerCase().includes(q)
        || item.description?.toLowerCase().includes(q)
        || item.category?.toLowerCase().includes(q)
      ))
    );
  }

  return (
    <div className="w-full max-w-xl space-y-2">
      <GlobalSearch
        placeholder="Search pages and actions…"
        results={results}
        onSearch={handleSearch}
        onSelect={(item) => setSelected(item.label)}
      />
      <p className="text-xs text-text-secondary">Selected: {selected}</p>
    </div>
  );
}

function GlobalSearchLoadingDemo() {
  return (
    <div className="w-full max-w-xl">
      <GlobalSearch
        placeholder="Type to search (loading demo)…"
        loading
        results={SEARCH_RESULTS}
        onSearch={() => {}}
        onSelect={() => {}}
      />
    </div>
  );
}

function AppCommandBarDemo({ variant }: { variant?: 'default' | 'custom' | 'fuzzy' }) {
  const customItems: CommandItem[] = [
    { icon: '🛍️', label: 'View Orders',    shortcut: 'G O', category: 'Navigation' },
    { icon: '📦', label: 'Inventory',      shortcut: 'G I', category: 'Navigation' },
    { icon: '💰', label: 'New Sale',       shortcut: '⌘N',  category: 'Actions', onClick: () => {} },
    { icon: '📊', label: 'Export Report',  shortcut: '⌘E',  category: 'Actions', onClick: () => {} },
    { icon: '🕐', label: 'Order #1042',    category: 'Recent' },
    { icon: '🕑', label: 'Customer: Acme', category: 'Recent' },
  ];

  // M1 — bespoke groups + fuzzy-search-resistant labels. Try typing
  // "kbd", "asgn" or "rls" to exercise the subsequence matcher.
  const fuzzyItems: CommandItem[] = [
    { icon: '⌨️', label: 'Open Keyboard Shortcuts',    shortcut: '?',   category: 'Help',         keywords: ['kbd', 'shortcuts'] },
    { icon: '📚', label: 'Browse Documentation',       shortcut: 'G H', category: 'Help' },
    { icon: '🔔', label: 'Notification Preferences',   shortcut: 'G N', category: 'Preferences' },
    { icon: '🎨', label: 'Switch Theme: Solarized',    shortcut: 'T S', category: 'Preferences' },
    { icon: '🛠️', label: 'Assign Reviewer to PR-42',  shortcut: 'A R', category: 'Workflows',    keywords: ['asgn', 'review'] },
    { icon: '🚀', label: 'Release & Tag v1.4.0',       shortcut: 'R T', category: 'Workflows',    keywords: ['rls', 'deploy'] },
    { icon: '🐛', label: 'Triage Latest Bug Reports',  category: 'Workflows' },
  ];

  let items: CommandItem[] | undefined;
  if (variant === 'custom') items = customItems;
  else if (variant === 'fuzzy') items = fuzzyItems;

  return (
    <AppCommandBar
      items={items}
      onSelect={() => {}}
    />
  );
}

export function buildAppUserData(): ShowcaseComponent[] {
  return [
    {
      id: 'user-menu',
      title: 'UserMenu',
      category: 'App',
      abbr: 'UM',
      description: 'User dropdown opened by a trigger showing avatar, name and role. Accepts a SafeUser prop; the dropdown header shows the name and email.',
      filePath: 'modules/app/UserMenu.tsx',
      sourceCode: `'use client';
import { Avatar } from '@/modules/ui/Avatar';
import { DropdownMenu } from '@/modules/ui/DropdownMenu';

export function UserMenu({ user, items, align = 'right' }) {
  const displayName = user.userProfile?.name ?? user.name ?? user.email;
  const avatar      = user.userProfile?.profilePicture ?? null;

  const defaultItems = items ?? [
    { type: 'item', label: 'Profile',  icon: '👤' },
    { type: 'item', label: 'Settings', icon: '⚙️' },
    { type: 'separator' },
    { type: 'item', label: 'Sign out', icon: '↩️', danger: true },
  ];

  const header = (
    <div className="px-3 py-2.5">
      <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
      <p className="text-xs text-text-secondary truncate">{user.email}</p>
    </div>
  );

  const trigger = (
    <button type="button"
      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <Avatar src={avatar} name={displayName} size="sm" />
      <div className="hidden sm:block text-left min-w-0">
        <p className="text-sm font-medium text-text-primary truncate max-w-[8rem]">{displayName}</p>
        <p className="text-xs text-text-secondary truncate">{user.userRole}</p>
      </div>
      <span aria-hidden="true" className="text-text-disabled text-xs hidden sm:block">▾</span>
    </button>
  );

  return <DropdownMenu trigger={trigger} items={defaultItems} header={header} align={align} />;
}`,
      variants: [
        {
          title: 'Varsayılan (isim + e-posta + rol)',
          preview: <UserMenuDefaultDemo />,
          code: `<UserMenu
  user={{
    userId: 'u1',
    email: 'jane@acme.com',
    userRole: 'Admin',
    userStatus: 'ACTIVE',
    userPreferences: null,
    userProfile: { name: 'Jane Doe', profilePicture: null },
  }}
/>`,
        },
        {
          title: 'Özel items',
          preview: <UserMenuCustomDemo />,
          code: `<UserMenu
  user={currentUser}
  items={[
    { label: 'View Profile',  icon: '👤', onClick: () => {} },
    { label: 'Billing',       icon: '💳', onClick: () => {} },
    { type: 'separator' },
    { label: 'Sign out',      icon: '↩️', danger: true, onClick: () => {} },
  ]}
/>`,
        },
      ],
    },
    {
      id: 'global-search',
      title: 'GlobalSearch',
      category: 'App',
      abbr: 'GS',
      description: 'Command-palette-style global search field. Supports a categorised result list, keyboard navigation and result selection.',
      filePath: 'modules/app/GlobalSearch.tsx',
      sourceCode: `'use client';
import { GlobalSearch } from '@/modules/app/GlobalSearch';

export function Demo() {
  return (
    <GlobalSearch
      placeholder="Search…"
      results={results}
      onSearch={handleSearch}
      onSelect={handleSelect}
    />
  );
}`,
      variants: [
        {
          title: 'Interactive results',
          layout: 'stack' as const,
          preview: <GlobalSearchStandaloneDemo />,
          code: `<GlobalSearch
  placeholder="Search pages and actions…"
  results={results}
  onSearch={handleSearch}
  onSelect={(result) => setSelected(result.label)}
/>`,
        },
        {
          title: 'Loading state',
          layout: 'stack' as const,
          preview: <GlobalSearchLoadingDemo />,
          code: `<GlobalSearch loading results={results} onSearch={handleSearch} onSelect={handleSelect} />`,
        },
      ],
    },
    {
      id: 'app-command-bar',
      title: 'AppCommandBar',
      category: 'App',
      abbr: 'CB',
      description: 'Keyboard-first command palette. Opens with ⌘K; an items prop accepts custom commands while a default navigation/actions/recent set is included.',
      filePath: 'modules/app/CommandPalette/index.tsx',
      sourceCode: `'use client';
import { AppCommandBar } from '@/modules/app/CommandPalette';

// With default commands:
<AppCommandBar onSelect={(item) => router.push(item.href)} />

// With custom commands:
<AppCommandBar
  items={[
    { icon: '🏠', label: 'Dashboard', shortcut: 'G D', category: 'Navigation' },
    { icon: '➕', label: 'New Project', shortcut: '⌘N', category: 'Actions', onClick: handleNew },
    { icon: '🕐', label: 'Recent Item', category: 'Recent' },
  ]}
  trigger={<Button variant="outline" size="sm">⌘K</Button>}
  onSelect={handleSelect}
/>`,
      variants: [
        {
          title: 'Varsayılan komutlar',
          preview: <AppCommandBarDemo />,
          code: `<AppCommandBar onSelect={(item) => console.log(item.label)} />`,
        },
        {
          title: 'Özel items + trigger',
          preview: <AppCommandBarDemo variant="custom" />,
          code: `<AppCommandBar
  items={customItems}
  trigger={<Button variant="ghost" size="sm" iconRight={<Badge variant="neutral" size="sm">⌘K</Badge>}>Search…</Button>}
  onSelect={handleSelect}
/>`,
        },
        {
          title: 'Fuzzy search + özel gruplar',
          preview: <AppCommandBarDemo variant="fuzzy" />,
          code: `// Try typing "kbd", "asgn" or "rls" to exercise the subsequence matcher.
const fuzzyItems = [
  { icon: '⌨️', label: 'Open Keyboard Shortcuts',  shortcut: '?',   category: 'Help',        keywords: ['kbd'] },
  { icon: '📚', label: 'Browse Documentation',     shortcut: 'G H', category: 'Help' },
  { icon: '🔔', label: 'Notification Preferences', shortcut: 'G N', category: 'Preferences' },
  { icon: '🛠️', label: 'Assign Reviewer to PR-42', shortcut: 'A R', category: 'Workflows',   keywords: ['asgn'] },
  { icon: '🚀', label: 'Release & Tag v1.4.0',     shortcut: 'R T', category: 'Workflows',   keywords: ['rls'] },
];

<AppCommandBar items={fuzzyItems} />`,
        },
      ],
    },
  ];
}
