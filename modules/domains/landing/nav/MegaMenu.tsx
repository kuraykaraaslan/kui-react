'use client';
import { useRef, useCallback, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */

export type MegaMenuItemData = {
  icon: IconDefinition;
  label: string;
  description: string;
  href: string;
};

export type MegaMenuFeaturedData = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

/* ─────────────────────────────────────────
   MegaMenu.Root — hover-aware wrapper
   Handles open/close with delay so the
   mouse can travel from trigger to panel.
───────────────────────────────────────── */

type RootProps = {
  id: string;
  openId: string | null;
  onOpen: (id: string) => void;
  onScheduleClose: () => void;
  children: React.ReactNode;
  className?: string;
};

function Root({ id, onOpen, onScheduleClose, children, className }: RootProps) {
  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => onOpen(id)}
      onMouseLeave={onScheduleClose}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   MegaMenu.Trigger — the nav button
───────────────────────────────────────── */

type TriggerProps = {
  label: string;
  isOpen: boolean;
  className?: string;
};

function Trigger({ label, isOpen, className }: TriggerProps) {
  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={isOpen}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        isOpen
          ? 'text-text-primary bg-surface-overlay'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
        className,
      )}
    >
      {label}
      <FontAwesomeIcon
        icon={faChevronDown}
        className={cn('w-2.5 h-2.5 transition-transform duration-150', isOpen && 'rotate-180')}
        aria-hidden="true"
      />
    </button>
  );
}

/* ─────────────────────────────────────────
   MegaMenu.Panel — floating container
   Includes the invisible hover bridge that
   prevents the gap between trigger and panel
   from triggering onMouseLeave.
───────────────────────────────────────── */

type PanelProps = {
  onOpen: (id: string) => void;
  id: string;
  onScheduleClose: () => void;
  width?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  className?: string;
};

function Panel({ onOpen, id, onScheduleClose, width = 'w-[480px]', align = 'left', children, className }: PanelProps) {
  const alignClass =
    align === 'center' ? 'left-1/2 -translate-x-1/2' :
    align === 'right'  ? 'right-0' :
    'left-0';

  return (
    <div
      onMouseEnter={() => onOpen(id)}
      onMouseLeave={onScheduleClose}
    >
      {/* Invisible bridge — closes the hover gap between trigger and panel */}
      <div className="absolute top-full left-0 right-0 h-2 z-40" aria-hidden="true" />
      <div
        className={cn(
          'absolute top-[calc(100%+8px)] z-50',
          alignClass,
          width,
          'rounded-2xl border border-border bg-surface-base shadow-xl shadow-black/8 overflow-hidden',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MegaMenu.Section — labeled column header
───────────────────────────────────────── */

function Section({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-3', className)}>
      {label && (
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
          {label}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MegaMenu.Item — icon + title + description
───────────────────────────────────────── */

type ItemProps = {
  icon: IconDefinition;
  label: string;
  description: string;
  href: string;
  iconVariant?: 'primary' | 'neutral';
  onClick?: () => void;
  className?: string;
};

function Item({ icon, label, description, href, iconVariant = 'primary', onClick, className }: ItemProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 px-3 py-2.5 rounded-xl group transition-colors',
        'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg mt-0.5 transition-colors',
          iconVariant === 'primary'
            ? 'bg-primary-subtle group-hover:bg-primary/10'
            : 'bg-surface-sunken group-hover:bg-surface-overlay',
        )}
      >
        <FontAwesomeIcon
          icon={icon}
          className={cn(
            'w-3.5 h-3.5 transition-colors',
            iconVariant === 'primary'
              ? 'text-primary'
              : 'text-text-secondary group-hover:text-primary',
          )}
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary leading-snug mt-0.5">{description}</p>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────
   MegaMenu.Footer — bottom strip (e.g. "See all")
───────────────────────────────────────── */

type FooterProps = {
  label: string;
  href: string;
  onClick?: () => void;
  className?: string;
};

function Footer({ label, href, onClick, className }: FooterProps) {
  return (
    <div className={cn('px-6 pt-2 pb-3 border-t border-border', className)}>
      <a
        href={href}
        onClick={onClick}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline focus-visible:outline-none"
      >
        {label}
        <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" aria-hidden="true" />
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────
   MegaMenu.FeaturedCard — right-side panel
   with primary background and CTA buttons
───────────────────────────────────────── */

type FeaturedCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string; onClick?: () => void };
  secondaryCta?: { label: string; href: string; onClick?: () => void };
  className?: string;
};

function FeaturedCard({ eyebrow, title, description, primaryCta, secondaryCta, className }: FeaturedCardProps) {
  return (
    <div className={cn('bg-primary p-5 flex flex-col gap-3 h-full', className)}>
      <div className="flex-1">
        {eyebrow && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary-fg/60 mb-1">
            {eyebrow}
          </span>
        )}
        <p className="text-sm font-bold text-primary-fg leading-snug">{title}</p>
        <p className="mt-1.5 text-xs text-primary-fg/80 leading-relaxed">{description}</p>
      </div>

      {(primaryCta || secondaryCta) && (
        <div className="space-y-2">
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              onClick={secondaryCta.onClick}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-white/15 hover:bg-white/25 px-3 py-2 text-xs font-semibold text-primary-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {secondaryCta.label}
              <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" aria-hidden="true" />
            </a>
          )}
          {primaryCta && (
            <a
              href={primaryCta.href}
              onClick={primaryCta.onClick}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-white hover:bg-primary-subtle px-3 py-2 text-xs font-semibold text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {primaryCta.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   useMegaMenu — shared hover/close state
───────────────────────────────────────── */

export function useMegaMenu() {
  const [openId, setOpenId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearClose = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const open = useCallback((id: string) => {
    clearClose();
    setOpenId(id);
  }, [clearClose]);

  const scheduleClose = useCallback(() => {
    clearClose();
    timer.current = setTimeout(() => setOpenId(null), 120);
  }, [clearClose]);

  const close = useCallback(() => {
    clearClose();
    setOpenId(null);
  }, [clearClose]);

  return { openId, open, scheduleClose, close };
}

/* ─────────────────────────────────────────
   MegaMenu namespace export
───────────────────────────────────────── */

export const MegaMenu = {
  Root,
  Trigger,
  Panel,
  Section,
  Item,
  Footer,
  FeaturedCard,
};
