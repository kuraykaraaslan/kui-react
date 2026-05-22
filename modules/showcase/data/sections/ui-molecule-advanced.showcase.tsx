'use client';
import React from 'react';
import { TagInput } from '@/modules/ui/TagInput';
import { MultiSelect } from '@/modules/ui/MultiSelect';
import { ComboBox, type ComboBoxOption } from '@/modules/ui/ComboBox';
import { countries } from 'countries-list';
import * as Flags from 'country-flag-icons/react/3x2';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

const COUNTRY_OPTIONS = Object.entries(countries)
  .map(([code, data]) => {
    const Flag = Flags[code as keyof typeof Flags] as React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined;
    return {
      value: code,
      label: data.name,
      icon: Flag ? <Flag style={{ width: 20, height: 14, borderRadius: 2 }} /> : null,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

const COMBO_OPTIONS: ComboBoxOption[] = [
  { value: 'nextjs', label: 'Next.js', description: 'App Router framework' },
  { value: 'react', label: 'React', description: 'UI library for components' },
  { value: 'typescript', label: 'TypeScript', description: 'Typed JavaScript' },
  { value: 'tailwind', label: 'Tailwind CSS', description: 'Utility-first CSS toolkit' },
  { value: 'storybook', label: 'Storybook', description: 'Component documentation workspace' },
];

function CountryMultiSelectDemo() {
  const [v, setV] = useState<string[]>([]);
  return (
    <div className="w-full max-w-sm space-y-1">
      <MultiSelect id="cms-demo" label="Countries" options={COUNTRY_OPTIONS}
        placeholder="Select countries…" value={v} onChange={setV} hint="Select one or more countries." />
      {v.length > 0 && (
        <p className="text-xs text-text-secondary">Selected: {v.join(', ')}</p>
      )}
    </div>
  );
}

function MultiSelectDemo() {
  const [v, setV] = useState<string[]>([]);
  return (
    <MultiSelect
      id="ms-demo"
      label="Frameworks"
      options={[
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'angular', label: 'Angular' },
      ]}
      value={v}
      onChange={setV}
      placeholder="Pick frameworks…"
    />
  );
}

function ComboBoxDemo() {
  const [value, setValue] = useState('nextjs');
  return (
    <div className="w-full max-w-sm space-y-1">
      <ComboBox
        id="cb-demo"
        label="Framework"
        options={COMBO_OPTIONS}
        value={value}
        onChange={setValue}
        hint="Search or pick from the list."
      />
      <p className="text-xs text-text-secondary">Selected: {value || 'none'}</p>
    </div>
  );
}

function AsyncComboBoxDemo() {
  const [value, setValue] = useState('');

  async function search(query: string) {
    const normalized = query.trim().toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (!normalized) return COMBO_OPTIONS;
    return COMBO_OPTIONS.filter((opt) => (
      opt.label.toLowerCase().includes(normalized)
      || opt.description?.toLowerCase().includes(normalized)
    ));
  }

  return (
    <div className="w-full max-w-sm space-y-1">
      <ComboBox
        id="cb-async"
        label="Async search"
        options={COMBO_OPTIONS}
        value={value}
        onChange={setValue}
        onSearch={search}
        placeholder="Type to search..."
      />
      <p className="text-xs text-text-secondary">Selected: {value || 'none'}</p>
    </div>
  );
}

export function buildMoleculeAdvancedData(): ShowcaseComponent[] {
  return [
    {
      id: 'tag-input',
      title: 'TagInput',
      category: 'Molecule',
      abbr: 'Ti',
      description: 'Free-text input that creates chips. Add tags with Enter or comma, double-click to edit, Backspace to delete. Duplicates are ignored.',
      filePath: 'modules/ui/TagInput.tsx',
      sourceCode: `'use client';
import { useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';

export function TagInput({ id, label, hint, error, value, onChange, placeholder = 'Type and press Enter or comma…', disabled, className }) {
  const [input, setInput] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  function addTags(raw) {
    const tags = raw.split(',').map((t) => t.trim()).filter(Boolean);
    onChange([...new Set([...value, ...tags])]);
    setInput('');
  }
  function removeTag(idx) { onChange(value.filter((_, i) => i !== idx)); }
  // ... keyboard handlers + inline edit
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">{label}</label>
      <div className={cn('flex flex-wrap gap-1.5 min-h-10 w-full rounded-md border px-3 py-2 transition-colors cursor-text focus-within:ring-2 focus-within:ring-border-focus', disabled ? 'opacity-50 cursor-not-allowed bg-surface-sunken' : 'bg-surface-base border-border', error && 'border-error ring-1 ring-error')}>
        {value.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-subtle text-primary">
            {tag}
            {!disabled && <button type="button" onClick={() => removeTag(i)} className="hover:opacity-70">✕</button>}
          </span>
        ))}
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={value.length === 0 ? placeholder : undefined} disabled={disabled} className="flex-1 min-w-24 bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none" />
      </div>
    </div>
  );
}`,
      variants: [
        {
          title: 'Default',
          preview: (() => {
            function TagInputDemo() {
              const [tags, setTags] = useState<string[]>(['next.js', 'react']);
              return <div className="w-full max-w-sm"><TagInput id="sc-ti-default" label="Tags" value={tags} onChange={setTags} hint="Press Enter or comma to add. Double-click to edit." /></div>;
            }
            return <TagInputDemo />;
          })(),
          code: `const [tags, setTags] = useState(['next.js', 'react']);\n<TagInput id="tags" label="Tags" value={tags} onChange={setTags} hint="Press Enter or comma to add." />`,
        },
        {
          title: 'Empty / Error',
          preview: (() => {
            function TagInputErrorDemo() {
              const [tags, setTags] = useState<string[]>([]);
              return <div className="w-full max-w-sm"><TagInput id="sc-ti-err" label="Required tags" value={tags} onChange={setTags} error="At least one tag is required." /></div>;
            }
            return <TagInputErrorDemo />;
          })(),
          code: `<TagInput id="tags" label="Required tags" value={[]} onChange={setTags} error="At least one tag is required." />`,
        },
      ],
    },
    {
      id: 'multi-select',
      title: 'MultiSelect',
      category: 'Molecule',
      abbr: 'Ms',
      description: 'Chip-based multi-select popover with searchable filter, keyboard navigation, and disabled-option support.',
      filePath: 'modules/ui/MultiSelect.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\nimport { useEffect, useRef, useState } from 'react';\n\nexport function MultiSelect({ id, label, options, value, onChange, placeholder = 'Select…' }) {\n  // ... (controlled/uncontrolled multi-select with chip tags)\n}`,
      variants: [
        {
          title: 'Controlled',
          layout: 'stack' as const,
          preview: <MultiSelectDemo />,
          code: `function Demo() {\n  const [v, setV] = useState([]);\n  return (\n    <MultiSelect id="ms" label="Frameworks"\n      options={[{ value: 'react', label: 'React' }, ...]}\n      value={v} onChange={setV}\n    />\n  );\n}`,
        },
        {
          title: 'With error',
          layout: 'stack' as const,
          preview: (
            <MultiSelect id="ms-err" label="Tags" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
              error="Please select at least one tag." />
          ),
          code: `<MultiSelect id="ms" label="Tags" options={[...]} error="Please select at least one tag." />`,
        },
        {
          title: 'With countries',
          layout: 'stack' as const,
          preview: <CountryMultiSelectDemo />,
          code: `import { countries, getEmojiFlag } from 'countries-list';\n\nconst COUNTRY_OPTIONS = Object.entries(countries)\n  .map(([code, data]) => ({ value: code, label: \`\${getEmojiFlag(code)} \${data.name}\` }))\n  .sort((a, b) => a.label.localeCompare(b.label));\n\nfunction Demo() {\n  const [v, setV] = useState([]);\n  return (\n    <MultiSelect id="ms-countries" label="Countries"\n      options={COUNTRY_OPTIONS} placeholder="Select countries…"\n      value={v} onChange={setV} hint="Select one or more countries." />\n  );\n}`,
        },
        {
          title: 'Searchable',
          layout: 'stack' as const,
          preview: (() => {
            function SearchableMultiSelectDemo() {
              const [v, setV] = useState<string[]>([]);
              return (
                <MultiSelect id="ms-search" label="Countries" searchable
                  options={COUNTRY_OPTIONS} placeholder="Search and select…"
                  value={v} onChange={setV} hint="Type to filter the list." />
              );
            }
            return <SearchableMultiSelectDemo />;
          })(),
          code: `<MultiSelect id="countries" label="Countries" searchable\n  options={COUNTRY_OPTIONS} placeholder="Search and select…"\n  value={v} onChange={setV} hint="Type to filter the list." />`,
        },
      ],
    },
    {
      id: 'combo-box',
      title: 'ComboBox',
      category: 'Molecule',
      abbr: 'Cb',
      description: 'Searchable autocomplete single-select with keyboard navigation, described options, and a clearable button.',
      filePath: 'modules/ui/ComboBox.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\nimport { useState } from 'react';\n\nexport function ComboBox({ id, label, options, value, onChange, onSearch }) {\n  // searchable single-select combobox with async search support\n}`,
      variants: [
        {
          title: 'Controlled selection',
          layout: 'stack' as const,
          preview: <ComboBoxDemo />,
          code: `function Demo() {\n  const [value, setValue] = useState('nextjs');\n  return (\n    <ComboBox\n      id="framework"\n      label="Framework"\n      options={COMBO_OPTIONS}\n      value={value}\n      onChange={setValue}\n    />\n  );\n}`,
        },
        {
          title: 'Async search',
          layout: 'stack' as const,
          preview: <AsyncComboBoxDemo />,
          code: `<ComboBox id="search" label="Async search" options={COMBO_OPTIONS} onSearch={search} value={value} onChange={setValue} />`,
        },
      ],
    },
  ];
}
