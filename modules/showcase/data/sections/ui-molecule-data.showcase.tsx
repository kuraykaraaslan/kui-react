'use client';

import { Badge } from '@/modules/ui/Badge';
import { Textarea } from '@/modules/ui/Textarea';
import { Table } from '@/modules/ui/Table';
import { DataTable } from '@/modules/ui/DataTable';
import { ContentScoreBar, type ScoreRule } from '@/modules/ui/ContentScoreBar';
import { AdvancedDataTable } from '@/modules/ui/AdvancedDataTable';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

function AdvancedTableDemo() {
  const rows = [
    { name: 'Alice', role: 'Admin', status: 'Active', _expanded: <p className="text-sm">Joined 2023-01-15 · Last active 2 days ago</p> },
    { name: 'Bob', role: 'Editor', status: 'Inactive', _expanded: <p className="text-sm">Joined 2022-06-10 · Last active 30 days ago</p> },
    { name: 'Carol', role: 'Viewer', status: 'Active' },
    { name: 'Dave', role: 'Editor', status: 'Active', _expanded: <p className="text-sm">Joined 2024-03-01 · Last active today</p> },
  ];
  const cols = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ] as const;
  return (
    <div className="w-full">
      <AdvancedDataTable
        columns={cols as never}
        rows={rows as never}
        selectable
        caption="Team members"
      />
    </div>
  );
}

export function buildDataData(): ShowcaseComponent[] {
  return [
    {
      id: 'table',
      title: 'Table',
      category: 'Organism',
      abbr: 'Tb',
      description: 'Responsive table. scope="col" headers, hover row highlight, empty-state message, and custom cell render support.',
      filePath: 'modules/ui/Table.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

export function Table({ columns, rows, caption, emptyMessage = 'No results found.', className }) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-surface-sunken border-b border-border">
          <tr>{columns.map((col) => <th key={col.key} scope="col" className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-left">{col.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface-base">
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-text-secondary">{emptyMessage}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="hover:bg-surface-overlay transition-colors">
              {columns.map((col) => <td key={col.key} className="px-4 py-3 text-text-primary">{col.render ? col.render(row) : String(row[col.key] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      variants: [
        {
          title: 'With data',
          layout: 'stack' as const,
          preview: (
            <Table
              caption="Users table"
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
                { key: 'role', header: 'Role' },
                { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{String(row.status)}</Badge> },
              ]}
              rows={[
                { name: 'Jane Doe', email: 'jane@example.com', role: 'Admin', status: 'Active' },
                { name: 'John Smith', email: 'john@example.com', role: 'Member', status: 'Inactive' },
              ]}
            />
          ),
          code: `<Table\n  columns={[\n    { key: 'name', header: 'Name' },\n    { key: 'email', header: 'Email' },\n    { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge> },\n  ]}\n  rows={[{ name: 'Jane Doe', email: 'jane@example.com', status: 'Active' }]}\n/>`,
        },
        {
          title: 'Empty state',
          preview: (
            <Table
              caption="Empty table"
              columns={[{ key: 'name', header: 'Name' }, { key: 'email', header: 'Email' }]}
              rows={[]}
              emptyMessage="No users found. Invite your team to get started."
            />
          ),
          code: `<Table columns={[...]} rows={[]} emptyMessage="No users found." />`,
        },
        {
          title: 'Sortable columns',
          layout: 'stack' as const,
          preview: (
            <Table
              caption="Sortable users table"
              columns={[
                { key: 'name',  header: 'Name',  sortable: true },
                { key: 'email', header: 'Email', sortable: true },
                { key: 'role',  header: 'Role',  sortable: true },
              ]}
              rows={[
                { name: 'Zara Kim',    email: 'zara@example.com',  role: 'Admin' },
                { name: 'Alice Brown', email: 'alice@example.com', role: 'Member' },
                { name: 'Bob Lee',     email: 'bob@example.com',   role: 'Viewer' },
              ]}
            />
          ),
          code: `<Table\n  columns={[\n    { key: 'name', header: 'Name', sortable: true },\n    { key: 'role', header: 'Role', sortable: true },\n  ]}\n  rows={rows}\n/>`,
        },
      ],
    },
    {
      id: 'data-table',
      title: 'DataTable',
      category: 'Organism',
      abbr: 'Dt',
      description: 'Table + SearchBar + Pagination in a single component. Client-side search and pagination with filtered result counter and rows-per-page selector.',
      filePath: 'modules/ui/DataTable.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';
import { useMemo, useState } from 'react';
import { SearchBar } from './SearchBar';
import { Pagination } from './Pagination';

export function DataTable({ columns, rows, caption, searchable = true, searchPlaceholder = 'Search…', pageSize: defaultPageSize = 10, pageSizeOptions = [5,10,25,50], emptyMessage = 'No results found.', className }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) => columns.some((col) => !col.render && String(row[col.key] ?? '').toLowerCase().includes(q)));
  }, [rows, search, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={cn('space-y-3', className)}>
      {searchable && (
        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={searchPlaceholder} className="flex-1 min-w-40" />
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border border-border bg-surface-base px-2 py-1.5 text-sm">
            {pageSizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      {/* table body ... */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-text-secondary">Showing {(page-1)*pageSize+1}–{Math.min(page*pageSize, filtered.length)} of {filtered.length}</p>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
}`,
      variants: [
        {
          title: 'Full example',
          layout: 'stack' as const,
          preview: (() => {
            type User = { name: string; email: string; role: string; status: string; joined: string };
            const USERS: User[] = [
              { name: 'Alice Martin',   email: 'alice@example.com',   role: 'Admin',   status: 'Active',   joined: '2024-01-15' },
              { name: 'Bob Johnson',    email: 'bob@example.com',     role: 'Member',  status: 'Active',   joined: '2024-02-20' },
              { name: 'Carol Williams', email: 'carol@example.com',   role: 'Editor',  status: 'Inactive', joined: '2024-03-10' },
              { name: 'David Brown',    email: 'david@example.com',   role: 'Member',  status: 'Active',   joined: '2024-04-05' },
              { name: 'Eve Davis',      email: 'eve@example.com',     role: 'Admin',   status: 'Active',   joined: '2024-05-18' },
              { name: 'Frank Wilson',   email: 'frank@example.com',   role: 'Member',  status: 'Pending',  joined: '2024-06-22' },
              { name: 'Grace Moore',    email: 'grace@example.com',   role: 'Editor',  status: 'Active',   joined: '2024-07-01' },
              { name: 'Hank Taylor',    email: 'hank@example.com',    role: 'Member',  status: 'Inactive', joined: '2024-08-14' },
            ];
            return (
              <div className="w-full">
                <DataTable<User>
                  caption="Users"
                  searchPlaceholder="Search users…"
                  pageSize={5}
                  rows={USERS}
                  columns={[
                    { key: 'name',   header: 'Name'   },
                    { key: 'email',  header: 'Email'  },
                    { key: 'role',   header: 'Role'   },
                    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'neutral'}>{r.status}</Badge> },
                    { key: 'joined', header: 'Joined' },
                  ]}
                />
              </div>
            );
          })(),
          code: `<DataTable\n  caption="Users"\n  searchPlaceholder="Search users…"\n  pageSize={5}\n  rows={users}\n  columns={[\n    { key: 'name',   header: 'Name' },\n    { key: 'email',  header: 'Email' },\n    { key: 'role',   header: 'Role' },\n    { key: 'status', header: 'Status', render: (r) => <Badge variant={...}>{r.status}</Badge> },\n    { key: 'joined', header: 'Joined' },\n  ]}\n/>`,
        },
        {
          title: 'Sortable columns',
          layout: 'stack' as const,
          preview: (() => {
            type Product = { name: string; category: string; price: string; stock: string };
            const PRODUCTS: Product[] = [
              { name: 'Widget A', category: 'Tools',       price: '29.99',  stock: '150' },
              { name: 'Gadget B', category: 'Electronics', price: '99.00',  stock: '42'  },
              { name: 'Part C',   category: 'Tools',       price: '9.50',   stock: '500' },
              { name: 'Device D', category: 'Electronics', price: '249.00', stock: '18'  },
              { name: 'Item E',   category: 'Misc',        price: '14.75',  stock: '200' },
            ];
            return (
              <div className="w-full">
                <DataTable<Product>
                  caption="Products"
                  pageSize={5}
                  rows={PRODUCTS}
                  columns={[
                    { key: 'name',     header: 'Product',  sortable: true },
                    { key: 'category', header: 'Category', sortable: true },
                    { key: 'price',    header: 'Price',    sortable: true, align: 'right' },
                    { key: 'stock',    header: 'Stock',    sortable: true, align: 'right' },
                  ]}
                />
              </div>
            );
          })(),
          code: `<DataTable\n  rows={products}\n  columns={[\n    { key: 'name',  header: 'Product',  sortable: true },\n    { key: 'price', header: 'Price',    sortable: true, align: 'right' },\n  ]}\n/>`,
        },
      ],
    },
    {
      id: 'advanced-data-table',
      title: 'AdvancedDataTable',
      category: 'Organism',
      abbr: 'At',
      description: 'Enhanced table with row selection (with indeterminate header), expandable rows, and optional sticky header.',
      filePath: 'modules/ui/AdvancedDataTable.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\nimport { useState } from 'react';\n\nexport function AdvancedDataTable({ columns, rows, selectable, stickyHeader, onSelectionChange }) {\n  // row selection with indeterminate header, expandable rows, sticky header\n}`,
      variants: [
        {
          title: 'Selectable + Expandable',
          layout: 'stack' as const,
          preview: <AdvancedTableDemo />,
          code: `<AdvancedDataTable\n  columns={[{ key: 'name', header: 'Name' }, ...]}\n  rows={rows}\n  selectable\n/>`,
        },
        {
          title: 'Sticky Header',
          layout: 'stack' as const,
          preview: (
            <div className="w-full">
              <AdvancedDataTable
                columns={[{ key: 'n', header: 'Name' }, { key: 'v', header: 'Value' }] as never}
                rows={Array.from({ length: 10 }, (_, i) => ({ n: `Row ${i + 1}`, v: i * 10 }))}
                stickyHeader
                caption="Sticky header table"
              />
            </div>
          ),
          code: `<AdvancedDataTable columns={columns} rows={rows} stickyHeader />`,
        },
      ],
    },
    {
      id: 'content-score-bar',
      title: 'ContentScoreBar',
      category: 'Organism',
      abbr: 'Cs',
      description: 'Rule-based content quality score with Good ≥70 / Fair ≥40 / Poor <40 tier system. Each rule shown as a chip with passed/total count. role="progressbar" + aria-valuenow.',
      filePath: 'modules/ui/ContentScoreBar.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';
import { useMemo } from 'react';

const tierMap = {
  great: { bar: 'bg-success', text: 'text-success-fg', bg: 'bg-success-subtle', border: 'border-success', label: 'Good' },
  ok:    { bar: 'bg-warning', text: 'text-warning-fg', bg: 'bg-warning-subtle', border: 'border-warning', label: 'Fair' },
  poor:  { bar: 'bg-error',   text: 'text-error-fg',   bg: 'bg-error-subtle',   border: 'border-error',   label: 'Poor' },
};

export function ContentScoreBar({ value, rules, label, className }) {
  const { score, results } = useMemo(() => {
    let earned = 0, total = 0;
    const results = rules.map((rule) => { const pass = rule.check(value); if (pass) earned += rule.points; total += rule.points; return { label: rule.label, pass, hint: rule.hint }; });
    return { score: total > 0 ? Math.round((earned / total) * 100) : 0, results };
  }, [value, rules]);
  const tier = score >= 70 ? 'great' : score >= 40 ? 'ok' : 'poor';
  const t = tierMap[tier];
  return (
    <div className={cn('rounded-lg border p-3 space-y-2', t.bg, t.border, className)}>
      <div className="flex items-center gap-2">
        {label && <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <span className={cn('text-xs font-medium', t.text)}>{t.label}</span>
          <span className={cn('text-sm font-bold tabular-nums', t.text)}>{score}%</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', t.bar)} style={{ width: \`\${score}%\` }} />
      </div>
      <div className="flex flex-wrap gap-1">
        {results.map((r, i) => <span key={i} title={r.hint} className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', r.pass ? cn(t.bg, t.text, 'border', t.border) : 'bg-surface-sunken text-text-disabled border border-border')}>{r.pass && <span aria-hidden="true">✓</span>}{r.label}</span>)}
      </div>
      <p className="text-xs text-text-secondary">{results.filter(r => r.pass).length} / {results.length} rules passed</p>
    </div>
  );
}`,
      variants: [
        {
          title: 'Live evaluation',
          layout: 'stack' as const,
          preview: (() => {
            const RULES: ScoreRule[] = [
              { label: 'Min 20 chars',   check: (v) => v.length >= 20,                            points: 20 },
              { label: 'Has number',     check: (v) => /\d/.test(v),                               points: 20 },
              { label: 'Has uppercase',  check: (v) => /[A-Z]/.test(v),                            points: 20 },
              { label: 'Has keyword',    check: (v) => /next|react|typescript/i.test(v),            points: 20, hint: 'Include "Next", "React", or "TypeScript"' },
              { label: 'Min 5 words',    check: (v) => v.trim().split(/\s+/).filter(Boolean).length >= 5, points: 20 },
            ];
            function Demo() {
              const [text, setText] = useState('Build with Next.js and TypeScript');
              return (
                <div className="w-full max-w-sm space-y-2">
                  <Textarea id="sc-csb-input" label="Content" rows={2} value={text} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)} placeholder="Type your content…" />
                  <ContentScoreBar value={text} rules={RULES} label="Quality score" />
                </div>
              );
            }
            return <Demo />;
          })(),
          code: `const rules = [\n  { label: 'Min 20 chars', check: (v) => v.length >= 20, points: 20 },\n  { label: 'Has keyword',  check: (v) => /react/i.test(v), points: 20, hint: 'Include "React"' },\n  // ...\n];\n<ContentScoreBar value={content} rules={rules} label="Quality score" />`,
        },
        {
          title: 'All tiers',
          layout: 'stack' as const,
          preview: (() => {
            const makeRules = (pass: number, total: number): ScoreRule[] =>
              Array.from({ length: total }, (_, i) => ({
                label: `Rule ${i + 1}`,
                check: () => i < pass,
                points: 1,
              }));
            return (
              <div className="w-full max-w-sm space-y-3">
                <ContentScoreBar value="" rules={makeRules(5, 5)} label="Good (100%)" />
                <ContentScoreBar value="" rules={makeRules(3, 5)} label="Fair (60%)" />
                <ContentScoreBar value="" rules={makeRules(1, 5)} label="Poor (20%)" />
              </div>
            );
          })(),
          code: `// Good tier  (score ≥ 70)\n<ContentScoreBar value="" rules={allPassRules} label="Good (100%)" />\n\n// Fair tier  (40 ≤ score < 70)\n<ContentScoreBar value="" rules={halfPassRules} label="Fair (60%)" />\n\n// Poor tier  (score < 40)\n<ContentScoreBar value="" rules={onePassRules}  label="Poor (20%)" />`,
        },
        {
          title: 'Password strength',
          layout: 'stack' as const,
          preview: (() => {
            const PWD_RULES: ScoreRule[] = [
              { label: 'Min 8 chars',   check: (v) => v.length >= 8,           points: 25 },
              { label: 'Uppercase',     check: (v) => /[A-Z]/.test(v),         points: 25 },
              { label: 'Number',        check: (v) => /\d/.test(v),             points: 25 },
              { label: 'Special char',  check: (v) => /[^A-Za-z0-9]/.test(v),  points: 25 },
            ];
            function PwdDemo() {
              const [pwd, setPwd] = useState('Hello1');
              return (
                <div className="w-full max-w-sm space-y-2">
                  <input
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="Enter password…"
                    className="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  />
                  <ContentScoreBar value={pwd} rules={PWD_RULES} label="Password strength" />
                </div>
              );
            }
            return <PwdDemo />;
          })(),
          code: `const rules = [\n  { label: 'Min 8 chars',  check: (v) => v.length >= 8,          points: 25 },\n  { label: 'Uppercase',    check: (v) => /[A-Z]/.test(v),        points: 25 },\n  { label: 'Number',       check: (v) => /\\d/.test(v),            points: 25 },\n  { label: 'Special char', check: (v) => /[^A-Za-z0-9]/.test(v), points: 25 },\n];\n<ContentScoreBar value={password} rules={rules} label="Password strength" />`,
        },
      ],
    },
  ];
}
