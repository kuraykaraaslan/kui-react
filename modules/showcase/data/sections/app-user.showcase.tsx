'use client';
import { GlobalSearch, type SearchResult } from '@/modules/app/GlobalSearch';
import { AppCommandBar, registerCommands, type CommandItem } from '@/modules/app/AppCommandBar';
import { useEffect, useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faCreditCard, faReceipt, faPlus } from '@fortawesome/free-solid-svg-icons';

const SEARCH_RESULTS: SearchResult[] = [
  { id: 'dash',        label: 'Dashboard',     description: 'Overview page',               icon: <FontAwesomeIcon icon={faHouse}       className="w-3.5 h-3.5" />, category: 'Pages'    },
  { id: 'users',       label: 'Users',          description: 'Manage team members',         icon: <FontAwesomeIcon icon={faUsers}       className="w-3.5 h-3.5" />, category: 'Pages'    },
  { id: 'billing',     label: 'Billing',        description: 'Invoices and plans',          icon: <FontAwesomeIcon icon={faCreditCard}  className="w-3.5 h-3.5" />, category: 'Settings' },
  { id: 'audit',       label: 'Audit Logs',     description: 'Security and activity logs',  icon: <FontAwesomeIcon icon={faReceipt}     className="w-3.5 h-3.5" />, category: 'Settings' },
  { id: 'new-project', label: 'Create Project', description: 'Quick action',                icon: <FontAwesomeIcon icon={faPlus}        className="w-3.5 h-3.5" />, category: 'Actions'  },
];

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

function AppCommandBarContributedDemo() {
  const [canCall, setCanCall] = useState(false);
  // Another module registers its commands; hidden ones stay registered but unlisted.
  useEffect(
    () =>
      registerCommands([
        { id: 'tel-call', label: 'Call a contact', group: 'Telephony', order: 30, keywords: ['phone', 'dial'], hidden: !canCall },
        { id: 'tel-log', label: 'Open call log', group: 'Telephony', order: 31 },
      ]),
    [canCall],
  );
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AppCommandBar
        items={[
          { id: 'new-lead', label: 'New lead', group: 'Create', order: 10 },
          { id: 'new-contact', label: 'New contact', group: 'Create', order: 11 },
          { id: 'go-home', label: 'Go to dashboard', group: 'Navigation', order: 0 },
        ]}
      />
      <label className="flex items-center gap-2 text-xs text-text-secondary">
        <input type="checkbox" checked={canCall} onChange={(e) => setCanCall(e.target.checked)} />
        Viewer may place calls
      </label>
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
      demo={variant === undefined || variant === 'default'}
      items={items}
      onSelect={() => {}}
    />
  );
}

export function buildAppUserData(): ShowcaseComponent[] {
  return [
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
      description: 'Keyboard-first command palette. Opens with ⌘K. Lists the `items` it gets plus every command registered with `registerCommand` / `registerCommands` / `useRegisterCommand`; commands carry `group`, `order` and `hidden`. Sample commands only with `demo`.',
      filePath: 'modules/app/CommandPalette/index.tsx',
      sourceCode: `'use client';
import { AppCommandBar } from '@/modules/app/CommandPalette';

// With the sample commands (demos only):
<AppCommandBar demo onSelect={(item) => console.log(item.label)} />

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
          title: 'Sample commands (demo)',
          preview: <AppCommandBarDemo />,
          code: `<AppCommandBar demo onSelect={(item) => console.log(item.label)} />`,
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
        {
          title: 'Registered commands: group, order, hidden',
          preview: <AppCommandBarContributedDemo />,
          code: `// Any module adds commands to the shared registry; the palette lists them with its own items.
useEffect(() => registerCommands([
  { id: 'tel-call', label: 'Call a contact', group: 'Telephony', order: 30, hidden: !canCall },
  { id: 'tel-log', label: 'Open call log', group: 'Telephony', order: 31 },
]), [canCall]);

<AppCommandBar items={[
  { id: 'go-home', label: 'Go to dashboard', group: 'Navigation', order: 0 },
  { id: 'new-lead', label: 'New lead', group: 'Create', order: 10 },
]} />`,
        },
      ],
    },
  ];
}
