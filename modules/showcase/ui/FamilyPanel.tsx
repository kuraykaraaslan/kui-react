'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';

/**
 * The KUI family card on the home panel: the three UI kits (one design system
 * on three runtimes) and the standalone libraries. Pixel-identical in kui-ejs
 * (views/showcase/partials/family-panel.ejs) and kui-native
 * (modules/showcase/ui/FamilyPanel.tsx) — change all three together; only
 * `current` differs between them.
 *
 * Marks use the family's fixed brand hex (brand/geometry.mjs of each package),
 * like the static brand assets: they draw the siblings' marks, not this kit's
 * themed one.
 */

export type FamilyKit = 'react' | 'ejs' | 'native';

type Member = { id: string; name: string; meta: string; href: string; label: string; tone: string };

const KITS: (Member & { id: FamilyKit })[] = [
  { id: 'react',  name: 'KUIreact',  meta: 'Next.js · React',     href: 'https://kui-react.kuray.dev', label: 'kui-react.kuray.dev', tone: '#8b5cf6' },
  { id: 'ejs',    name: 'KUIejs',    meta: 'Express · EJS',       href: 'https://kui-ejs.kuray.dev', label: 'kui-ejs.kuray.dev', tone: '#ec4899' },
  { id: 'native', name: 'KUInative', meta: 'Expo · React Native', href: 'https://kui-native.kuray.dev', label: 'kui-native.kuray.dev', tone: '#f97316' },
];

const LIBRARIES: Member[] = [
  { id: 'player', name: 'KUI Player', meta: 'Video player',       href: 'https://kui-player.kuray.dev', label: 'kui-player.kuray.dev', tone: '#22c55e' },
  { id: 'gantt',  name: 'KUI Gantt',  meta: 'Gantt chart',        href: 'https://kui-gantt.kuray.dev', label: 'kui-gantt.kuray.dev', tone: '#ef4444' },
  { id: 'viewer', name: 'KUI Viewer', meta: 'IFC / BIM 3D viewer', href: 'https://kui-viewer.kuray.dev', label: 'kui-viewer.kuray.dev', tone: '#ffb020' },
];

/** The family mark (shared K construction), second arm in the member's tone. */
function MemberMark({ tone }: { tone: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8 shrink-0" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#0f172a" />
      <rect x="16" y="16" width="7" height="32" rx="1.5" fill="#3b82f6" />
      <path d="M25 32 L41 16" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M25 32 L41 48" stroke={tone} strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function MemberCard({ member, current }: { member: Member; current?: boolean }) {
  return (
    <a
      href={member.href}
      target={current ? undefined : '_blank'}
      rel={current ? undefined : 'noopener noreferrer'}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'group flex flex-col gap-3 rounded-lg border bg-surface-base p-4 transition-colors',
        'hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        current ? 'border-primary' : 'border-border'
      )}
    >
      <div className="flex items-center gap-2.5">
        <MemberMark tone={member.tone} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{member.name}</p>
          <p className="text-[10px] text-text-secondary truncate">{member.meta}</p>
        </div>
        {current && (
          <span className="ml-auto shrink-0 rounded-full bg-primary-subtle px-2 py-0.5 text-[10px] font-medium text-primary">
            You are here
          </span>
        )}
      </div>
      <span className="text-[10px] font-mono text-text-disabled truncate">{member.label}</span>
    </a>
  );
}

export function FamilyPanel({ current }: { current: FamilyKit }) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised p-5 mb-8">
      <h2 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
        <FontAwesomeIcon icon={faCubes} className="text-primary w-4" aria-hidden="true" />
        The KUI Family
      </h2>
      <p className="text-xs text-text-secondary mb-4 max-w-2xl leading-relaxed">
        KUIreact, KUIejs and KUInative are one design system: the same tokens, the same components and the same
        showcase, pixel for pixel — on Next.js, Express + EJS and React Native.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {KITS.map((kit) => (
          <MemberCard key={kit.id} member={kit} current={kit.id === current} />
        ))}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled mt-5 mb-2">Standalone libraries</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LIBRARIES.map((lib) => (
          <MemberCard key={lib.id} member={lib} />
        ))}
      </div>
    </div>
  );
}
