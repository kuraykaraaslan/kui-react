'use client';
import { Popover } from '@/modules/ui/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faNpm } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare, faEarthAmericas, faGlobe, faLink } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import type { ExternalLibraryLinks } from '@/modules/showcase/data/showcase.types';

type LinkRow = {
  key: 'homepage' | 'website' | 'npm' | 'github';
  label: string;
  href: string;
  icon: typeof faGithub;
};

function buildRows(external: ExternalLibraryLinks): LinkRow[] {
  const rows: LinkRow[] = [];
  if (external.homepage) rows.push({ key: 'homepage', label: 'Homepage', href: external.homepage, icon: faGlobe });
  if (external.website)  rows.push({ key: 'website',  label: 'Website',  href: external.website,  icon: faEarthAmericas });
  if (external.npm)      rows.push({ key: 'npm',      label: 'npm',      href: external.npm,      icon: faNpm   });
  if (external.github)   rows.push({ key: 'github',   label: 'GitHub',   href: external.github,   icon: faGithub });
  return rows;
}

export function ExternalLinksPopover({ external, title }: { external: ExternalLibraryLinks; title: string }) {
  const rows = buildRows(external);
  if (rows.length === 0) return null;

  const packageName = external.packageName ?? title;

  return (
    <Popover
      placement="bottom"
      focusTrap={false}
      trigger={
        <button
          type="button"
          aria-label={`Open library links for ${packageName}`}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised',
            'px-2.5 py-1 text-xs font-medium text-text-secondary',
            'hover:text-text-primary hover:bg-surface-overlay transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={faLink} className="w-3 h-3" aria-hidden="true" />
          <span>Links</span>
        </button>
      }
      className="w-64 p-2"
    >
      <div className="px-2 py-1.5 border-b border-border mb-1">
        <p className="text-xs font-semibold text-text-primary truncate">{packageName}</p>
        {external.version && (
          <p className="text-[11px] font-mono text-text-secondary">v{external.version}</p>
        )}
      </div>
      <ul className="space-y-0.5" role="list">
        {rows.map((row) => (
          <li key={row.key}>
            <a
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                'text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              )}
            >
              <FontAwesomeIcon icon={row.icon} className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="flex-1 font-medium">{row.label}</span>
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="w-3 h-3 text-text-disabled group-hover:text-text-primary"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </Popover>
  );
}
