'use client';
import React from 'react';
import { DatePicker } from '@/modules/ui/DatePicker';
import { DateRangePicker, TimePicker } from '@/modules/ui/DateRangePicker';
import { FileInput } from '@/modules/ui/FileInput';
import { ColorPicker } from '@/modules/ui/ColorPicker';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

function ColorPickerDemo() {
  const [c, setC] = useState<string | null>('#3b82f6');
  return <ColorPicker label="Brand color" value={c} onChange={setC} showNoColor />;
}
function ColorPickerCompactDemo() {
  const [c, setC] = useState<string | null>('#22c55e');
  return <ColorPicker value={c} onChange={setC} showHexInput={false} showNativePicker={false} />;
}
function ColorPickerNativeDemo() {
  const [c, setC] = useState<string | null>(null);
  return <ColorPicker label="Background" value={c} onChange={setC} showNoColor showHexInput showNativePicker swatches={[]} />;
}

function DateRangeDemo() {
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  return <DateRangePicker id="dr-demo" label="Select date range" value={range} onChange={setRange} />;
}

function TimePickerDemo() {
  const [t, setT] = useState('09:00');
  return <TimePicker id="tp-demo" label="Meeting time" value={t} onChange={setT} hint="24-hour format" />;
}

export function buildMoleculePickersData(): ShowcaseComponent[] {
  return [
    {
      id: 'date-picker',
      title: 'DatePicker',
      category: 'Molecule',
      abbr: 'Dp',
      description: 'Native date input with label + hint + error anatomy. Supports min/max constraints and a disabled state.',
      filePath: 'modules/ui/DatePicker.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

export function DatePicker({ id, label, hint, error, value, onChange, disabled, required, min, max, className }) {
  const formatted = value && !isNaN(value.getTime()) ? value.toISOString().split('T')[0] : '';
  function handleChange(e) {
    if (!e.target.value) { onChange(null); return; }
    const d = new Date(e.target.value);
    onChange(isNaN(d.getTime()) ? null : d);
  }
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="text-error ml-1" aria-hidden="true">*</span>}
      </label>
      <input id={id} type="date" value={formatted} onChange={handleChange} disabled={disabled} required={required} min={min} max={max} aria-invalid={!!error}
        className={cn('block w-full rounded-md border px-3 py-2 text-sm transition-colors text-text-primary bg-surface-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken', error ? 'border-error ring-1 ring-error bg-error-subtle' : 'border-border')} />
      {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
      {error && <p className="text-xs text-error" role="alert">{error}</p>}
    </div>
  );
}`,
      variants: [
        {
          title: 'Default',
          preview: <div className="w-full max-w-xs"><DatePicker id="sc-dp-default" label="Appointment date" hint="Select a future date." onChange={() => {}} value={null} /></div>,
          code: `<DatePicker id="date" label="Appointment date" hint="Select a future date." value={date} onChange={setDate} />`,
        },
        {
          title: 'With value',
          preview: <div className="w-full max-w-xs"><DatePicker id="sc-dp-val" label="Start date" value={new Date('2026-06-15')} onChange={() => {}} /></div>,
          code: `<DatePicker id="start" label="Start date" value={new Date('2026-06-15')} onChange={setDate} />`,
        },
        {
          title: 'Error / Disabled',
          preview: (
            <div className="w-full max-w-xs space-y-3">
              <DatePicker id="sc-dp-err" label="Due date" error="Please select a date." onChange={() => {}} value={null} required />
              <DatePicker id="sc-dp-dis" label="Locked date" value={new Date('2026-01-01')} onChange={() => {}} disabled />
            </div>
          ),
          code: `<DatePicker id="due" label="Due date" error="Please select a date." required />\n<DatePicker id="locked" label="Locked date" value={date} disabled />`,
        },
      ],
    },
    {
      id: 'date-range-picker',
      title: 'DateRangePicker',
      category: 'Molecule',
      abbr: 'Dr',
      description: 'fieldset-based dual native date inputs. Start/end auto-constrain each other (min/max) with accessible sr-only labels.',
      filePath: 'modules/ui/DateRangePicker.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\n\nexport function DateRangePicker({ id, label, value, onChange }) {\n  // start/end date inputs, auto-clears end if start > end\n}\n\nexport function TimePicker({ id, label, value, onChange, step = 60 }) {}`,
      variants: [
        {
          title: 'Date range',
          layout: 'stack' as const,
          preview: <DateRangeDemo />,
          code: `function Demo() {\n  const [range, setRange] = useState({ start: null, end: null });\n  return <DateRangePicker id="dr" label="Date range" value={range} onChange={setRange} />;\n}`,
        },
        {
          title: 'Time picker',
          layout: 'stack' as const,
          preview: <TimePickerDemo />,
          code: `function Demo() {\n  const [t, setT] = useState('09:00');\n  return <TimePicker id="tp" label="Meeting time" value={t} onChange={setT} />;\n}`,
        },
      ],
    },
    {
      id: 'file-input',
      title: 'FileInput',
      category: 'Molecule',
      abbr: 'Fi',
      description: 'Drag-and-drop file upload with validation, file list, and individual remove actions.',
      filePath: 'modules/ui/FileInput.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\nimport { useRef, useState } from 'react';\n\nexport function FileInput({ id, label, multiple, accept, maxSizeBytes, allowedTypes, disabled }) {\n  // drag-and-drop + browse, validates size/type, lists files with errors\n}`,
      variants: [
        {
          title: 'Single file',
          layout: 'stack' as const,
          preview: <FileInput id="fi-single" label="Profile photo" hint="PNG or JPG, max 2 MB" accept="image/*" maxSizeBytes={2 * 1024 * 1024} />,
          code: `<FileInput id="photo" label="Profile photo" hint="PNG or JPG, max 2 MB"\n  accept="image/*" maxSizeBytes={2097152} />`,
        },
        {
          title: 'Multiple files',
          layout: 'stack' as const,
          preview: <FileInput id="fi-multi" label="Attachments" multiple hint="Up to 5 MB each" maxSizeBytes={5 * 1024 * 1024} />,
          code: `<FileInput id="attachments" label="Attachments" multiple hint="Up to 5 MB each" maxSizeBytes={5242880} />`,
        },
        {
          title: 'With upload action',
          layout: 'stack' as const,
          preview: <FileInput id="fi-upload" label="Project attachments" multiple hint="Up to 5 MB each" maxSizeBytes={5 * 1024 * 1024} onUpload={async (files) => { await new Promise((r) => setTimeout(r, 800)); console.log('uploaded', files); }} uploadLabel="Upload" />,
          code: `<FileInput id="attachments" label="Project attachments" multiple maxSizeBytes={5242880}\n  onUpload={uploadFiles} uploadLabel="Upload" />`,
        },
        {
          title: 'Disabled',
          layout: 'stack' as const,
          preview: <FileInput id="fi-disabled" label="Disabled upload" disabled />,
          code: `<FileInput id="upload" label="Disabled upload" disabled />`,
        },
      ],
    },
    {
      id: 'color-picker',
      title: 'ColorPicker',
      category: 'Molecule',
      abbr: 'Cp',
      description:
        'Color selection control with a 32-swatch preset palette plus optional hex input and native browser color picker for unlimited colors. Pixel-identical EJS sibling at modules/ui/ColorPicker.ejs. Used by RichTextEditor for text + highlight colors.',
      filePath: 'modules/ui/ColorPicker.tsx',
      sourceCode: `'use client';
import { ColorPicker } from '@/modules/ui/ColorPicker';

const [color, setColor] = useState<string | null>('#3b82f6');

<ColorPicker
  label="Brand color"
  value={color}
  onChange={setColor}
  showNoColor
/>

// Compact (swatches only):
<ColorPicker
  value={color}
  onChange={setColor}
  showHexInput={false}
  showNativePicker={false}
/>

// Custom palette + hex / native only:
<ColorPicker
  value={color}
  onChange={setColor}
  swatches={['#ff0000', '#00ff00', '#0000ff']}
  showHexInput
  showNativePicker
/>`,
      since: '2026-05',
      composes: ['button'],
      designTokens: [
        '--surface-base', '--surface-raised', '--surface-overlay', '--surface-sunken',
        '--text-primary', '--text-secondary', '--text-disabled',
        '--border', '--border-focus',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['button', 'dialog'],
        keyboardInteractions: [
          { keys: 'Enter / Space', action: 'Open / close the picker' },
          { keys: 'Tab',            action: 'Move between swatches' },
          { keys: 'Enter (in hex)', action: 'Commit hex value' },
          { keys: 'Escape',         action: 'Close picker' },
        ],
      },
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          preview: <ColorPickerDemo />,
          code: `const [c, setC] = useState<string | null>('#3b82f6');
<ColorPicker label="Brand color" value={c} onChange={setC} showNoColor />`,
        },
        {
          title: 'Compact (swatches only)',
          layout: 'stack' as const,
          preview: <ColorPickerCompactDemo />,
          code: `<ColorPicker
  value={c}
  onChange={setC}
  showHexInput={false}
  showNativePicker={false}
/>`,
        },
        {
          title: 'Hex + native picker only (no swatches)',
          layout: 'stack' as const,
          preview: <ColorPickerNativeDemo />,
          code: `<ColorPicker
  label="Background"
  value={c}
  onChange={setC}
  swatches={[]}
  showHexInput
  showNativePicker
  showNoColor
/>`,
        },
      ],
    },
  ];
}
