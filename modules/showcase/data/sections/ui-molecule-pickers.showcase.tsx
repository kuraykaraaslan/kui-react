'use client';
import React from 'react';
import { DatePicker } from '@/modules/ui/DatePicker';
import { DateRangePicker, TimePicker } from '@/modules/ui/DateRangePicker';
import type { DateRange } from '@/modules/ui/DatePicker';
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
function ColorPickerFormatSwitcherDemo() {
  const [c, setC] = useState<string | null>('#3b82f6');
  return (
    <ColorPicker
      label="Theme color"
      value={c}
      onChange={setC}
      showFormatSwitcher
      defaultFormat="hex"
      showHexInput={false}
      showNativePicker
    />
  );
}

function DatePickerDefaultDemo() {
  const [d, setD] = useState<Date | null>(null);
  return <div className="w-full max-w-xs"><DatePicker id="sc-dp-default" label="Appointment date" hint="Select a future date." value={d} onChange={setD} /></div>;
}
function DatePickerValueDemo() {
  const [d, setD] = useState<Date | null>(new Date('2026-06-15'));
  return <div className="w-full max-w-xs"><DatePicker id="sc-dp-val" label="Start date" value={d} onChange={setD} /></div>;
}
function DatePickerErrorDemo() {
  const [a, setA] = useState<Date | null>(null);
  const [b, setB] = useState<Date | null>(new Date('2026-01-01'));
  return (
    <div className="w-full max-w-xs space-y-3">
      <DatePicker id="sc-dp-err" label="Due date" error="Please select a date." required value={a} onChange={setA} />
      <DatePicker id="sc-dp-dis" label="Locked date" value={b} onChange={setB} disabled />
    </div>
  );
}
function DatePickerTrDemo() {
  const [d, setD] = useState<Date | null>(new Date('2026-05-26'));
  return (
    <div className="w-full max-w-xs">
      <DatePicker
        id="sc-dp-tr"
        label="Randevu tarihi"
        hint="Lütfen ileri bir tarih seçin."
        locale="tr"
        value={d}
        onChange={setD}
        messages={{ today: 'Bugün seç', clear: 'Temizle' }}
      />
    </div>
  );
}

function DateRangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <DateRangePicker id="dr-demo" label="Select date range" value={range} onChange={setRange} />;
}
function DateRangeValueDemo() {
  const [range, setRange] = useState<DateRange>({ start: new Date('2026-06-01'), end: new Date('2026-06-15') });
  return <DateRangePicker id="dr-val" label="Booking window" value={range} onChange={setRange} locale="en" />;
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
      description:
        'Popover-based date picker with a locale-aware calendar grid (TR / EN), quick month / year jump from the header, min / max / disabledDates support, and full keyboard navigation (Arrow / PageUp/Down / Shift+Page / Home / End / Enter / Esc). Pixel-identical EJS sibling at modules/ui/DatePicker/DatePicker.ejs.',
      filePath: 'modules/ui/DatePicker/index.tsx',
      sourceCode: `'use client';
import { DatePicker } from '@/modules/ui/DatePicker';

// Single-date popover — defaults to Turkish locale (Monday-first, GG.AA.YYYY).
const [date, setDate] = useState<Date | null>(null);
<DatePicker
  id="appointment"
  label="Appointment date"
  value={date}
  onChange={setDate}
  hint="Select a future date."
/>

// English locale, min/max constraints + disabledDates predicate.
<DatePicker
  locale="en"
  value={date}
  onChange={setDate}
  min={new Date('2026-06-01')}
  max={new Date('2026-06-30')}
  disabledDates={(d) => d.getDay() === 0 /* no Sundays */}
/>

// Override individual messages.
<DatePicker
  locale="tr"
  value={date}
  onChange={setDate}
  messages={{ today: 'Bugün seç', clear: 'Temizle' }}
/>`,
      variants: [
        {
          title: 'Default',
          preview: <DatePickerDefaultDemo />,
          code: `const [date, setDate] = useState<Date | null>(null);
<DatePicker id="date" label="Appointment date" hint="Select a future date." value={date} onChange={setDate} />`,
        },
        {
          title: 'With value',
          preview: <DatePickerValueDemo />,
          code: `<DatePicker id="start" label="Start date" value={new Date('2026-06-15')} onChange={setDate} />`,
        },
        {
          title: 'Error / Disabled',
          preview: <DatePickerErrorDemo />,
          code: `<DatePicker id="due" label="Due date" error="Please select a date." required />\n<DatePicker id="locked" label="Locked date" value={date} disabled />`,
        },
        {
          title: 'Locale: Türkçe + custom messages',
          preview: <DatePickerTrDemo />,
          code: `<DatePicker
  locale="tr"
  value={date}
  onChange={setDate}
  messages={{ today: 'Bugün seç', clear: 'Temizle' }}
/>`,
        },
      ],
    },
    {
      id: 'date-range-picker',
      title: 'DateRangePicker',
      category: 'Molecule',
      abbr: 'Dr',
      description:
        'Two-month popover for picking a start → end date range. Shares the same Calendar core as DatePicker; locale-aware, fully keyboard navigable, with min/max/disabledDates. Pixel-identical EJS sibling at modules/ui/DatePicker/DateRangePicker.ejs.',
      filePath: 'modules/ui/DatePicker/index.tsx',
      sourceCode: `'use client';
import { DateRangePicker } from '@/modules/ui/DateRangePicker';
import type { DateRange } from '@/modules/ui/DatePicker';

const [range, setRange] = useState<DateRange>({ start: null, end: null });
<DateRangePicker
  id="dr"
  label="Date range"
  value={range}
  onChange={setRange}
  locale="en"
/>`,
      variants: [
        {
          title: 'Date range',
          layout: 'stack' as const,
          preview: <DateRangeDemo />,
          code: `function Demo() {\n  const [range, setRange] = useState<DateRange>({ start: null, end: null });\n  return <DateRangePicker id="dr" label="Date range" value={range} onChange={setRange} />;\n}`,
        },
        {
          title: 'With value (EN locale)',
          layout: 'stack' as const,
          preview: <DateRangeValueDemo />,
          code: `<DateRangePicker id="dr" label="Booking window"\n  value={{ start: new Date('2026-06-01'), end: new Date('2026-06-15') }}\n  onChange={setRange} locale="en" />`,
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
      description:
        'Drag-and-drop file upload with validation, file list, and individual remove actions. M1 adds paste-from-clipboard, `accept` MIME-pattern + extension validation, and `maxFiles` enforcement with i18n messages. Pixel-identical EJS sibling at modules/ui/FileInput/FileInput.ejs.',
      filePath: 'modules/ui/FileInput/index.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\nimport { useRef, useState, useEffect } from 'react';\n\nexport function FileInput({ id, label, multiple, accept, maxSizeBytes, maxFiles, allowedTypes, disabled, enablePaste, onFiles, onUpload, messages }) {\n  // drag-and-drop + browse + paste, validates size/type/count, lists files with errors\n}`,
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
          title: 'Paste from clipboard',
          layout: 'stack' as const,
          preview: (
            <FileInput
              id="fi-paste"
              label="Screenshot drop"
              multiple
              enablePaste
              accept="image/*"
              maxFiles={4}
              maxSizeBytes={4 * 1024 * 1024}
              hint="Drop, browse, or paste a screenshot from your clipboard (Cmd/Ctrl + V while this card is focused)."
            />
          ),
          code: `<FileInput id="screenshots" label="Screenshot drop" multiple enablePaste\n  accept="image/*" maxFiles={4} maxSizeBytes={4 * 1024 * 1024}\n  hint="Drop, browse, or paste a screenshot (Cmd/Ctrl + V)." />`,
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
        'Color selection control with a 32-swatch preset palette plus optional hex input and native browser color picker for unlimited colors. M1 adds a HEX / RGBA / HSLA / HWB / OKLCH format-switcher with per-format input + copy. Pixel-identical EJS sibling at modules/ui/ColorPicker/ColorPicker.ejs. Used by RichTextEditor for text + highlight colors.',
      filePath: 'modules/ui/ColorPicker/index.tsx',
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
/>

// M1 — HEX / RGBA / HSLA / HWB / OKLCH format-switcher:
<ColorPicker
  label="Theme color"
  value={color}
  onChange={setColor}
  showFormatSwitcher
  defaultFormat="hex"
  showHexInput={false}
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
        {
          title: 'Format switcher — HEX / RGBA / HSLA / HWB / OKLCH (M1)',
          layout: 'stack' as const,
          preview: <ColorPickerFormatSwitcherDemo />,
          code: `<ColorPicker
  label="Theme color"
  value={c}
  onChange={setC}
  showFormatSwitcher
  defaultFormat="hex"
  showHexInput={false}
  showNativePicker
/>

// onChange receives the value formatted in the active format:
//   '#3b82f6'                              (HEX)
//   'rgb(59, 130, 246)'                    (RGBA)
//   'hsl(217.2, 91.2%, 59.8%)'             (HSLA)
//   'hwb(217.2 23.1% 3.5%)'                (HWB)
//   'oklch(0.6228 0.1808 257.84)'          (OKLCH)
//
// Each tab has its own validated text input + a Copy button (faCopy → faCheck).`,
        },
      ],
    },
  ];
}
