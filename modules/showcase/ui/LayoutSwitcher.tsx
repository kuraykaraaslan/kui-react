'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns, faTableList, faBorderAll } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';

/**
 * 'variant' is not in the switcher: one column, each variant in the layout it declares
 * (`layout: 'stack'`, else side by side). The visual regression suite opens pages with
 * `?layout=variant`, so a variant that needs the full width is captured the way its author laid it out.
 */
export type VariantLayout = 'side' | 'stack' | 'grid' | 'variant';

const URL_LAYOUTS: readonly VariantLayout[] = ['side', 'stack', 'grid', 'variant'];

/** The layout a `?layout=` query parameter asks for, if it names one. */
export function layoutFromSearch(search: string): VariantLayout | null {
  const value = new URLSearchParams(search).get('layout');
  return (URL_LAYOUTS as readonly string[]).includes(value ?? '') ? (value as VariantLayout) : null;
}

const OPTIONS: { value: VariantLayout; icon: typeof faTableColumns; title: string }[] = [
  { value: 'side',  icon: faTableColumns, title: 'Side layout'  },
  { value: 'stack', icon: faTableList,    title: 'Stack layout' },
  { value: 'grid',  icon: faBorderAll,    title: 'Grid layout'  },
];

interface LayoutSwitcherProps {
  value: VariantLayout;
  onChange: (layout: VariantLayout) => void;
}

export function LayoutSwitcher({ value, onChange }: LayoutSwitcherProps) {
  return (
    <div
      className="flex items-center gap-0.5 mr-2 border border-border rounded-md p-0.5"
      role="group"
      aria-label="Layout"
    >
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            title={opt.title}
            aria-pressed={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded text-xs transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              isActive
                ? 'bg-primary text-primary-fg'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
            )}
          >
            <FontAwesomeIcon icon={opt.icon} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
