'use client';
import type { CSSProperties, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faDownload, faRotateRight, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { Tooltip } from '@/modules/ui/Tooltip';
import { cssColor, fontStyle } from './settings/style';
import type { CardSettings } from './settings/types';
import { SettingIcon } from './WidgetKitContext';

export type { CardSettings };

/** What the card body is showing. */
export type WidgetCardState = 'ready' | 'loading' | 'empty' | 'unconfigured' | 'error';

export type WidgetCardProps = {
  title?: string;
  card: CardSettings;
  state?: WidgetCardState;
  /** The data is older than `staleAfterSeconds`. */
  stale?: boolean;
  /** When the shown data was produced (for "Updated …"). */
  updatedAt?: Date | string | number | null;
  /** Shown to editors when the widget has no data bound yet. */
  unconfiguredText?: string;
  errorText?: string;
  onRetry?: () => void;
  onFullscreen?: () => void;
  /** Present only when the widget can export; the button shows when `card.buttons` asks for it. */
  onExport?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Extra header controls (e.g. action buttons), left of the card buttons. */
  headerRight?: ReactNode;
  /** Badges next to the title (e.g. a pinned time window). */
  badges?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  locale?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'children' | 'style'>;

const VARIANT: Record<NonNullable<CardSettings['variant']>, string> = {
  raised: 'bg-surface-raised border border-border shadow-sm',
  flat: 'bg-surface-base border border-border',
  outline: 'bg-transparent border border-border',
  plain: 'bg-transparent',
};

const SHADOW: Record<NonNullable<CardSettings['shadow']>, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const SIZES: Record<NonNullable<CardSettings['backgroundSize']>, string> = {
  cover: 'cover', contain: 'contain', fill: '100% 100%', auto: 'auto',
};

/** Only an https/http address or an internal path may become a CSS background image. */
function safeImageUrl(url: unknown): string | undefined {
  if (typeof url !== 'string' || !url) return undefined;
  if (!/^(https?:\/\/|\/(?!\/))/i.test(url) || /["'()\\\s]/.test(url)) return undefined;
  return url;
}

export function formatUpdated(at: Date | string | number | null | undefined, mode: CardSettings['showUpdated'], locale?: string, now = Date.now()): string | null {
  if (!at || !mode || mode === 'off') return null;
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return null;
  if (mode === 'relative') {
    const s = Math.round((now - d.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    if (Math.abs(s) < 60) return rtf.format(-s, 'second');
    if (Math.abs(s) < 3600) return rtf.format(-Math.round(s / 60), 'minute');
    if (Math.abs(s) < 86400) return rtf.format(-Math.round(s / 3600), 'hour');
    return rtf.format(-Math.round(s / 86400), 'day');
  }
  const opts: Intl.DateTimeFormatOptions =
    mode === 'time' ? { hour: '2-digit', minute: '2-digit' }
      : mode === 'date' ? { day: 'numeric', month: 'short' }
        : { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat(locale, opts).format(d);
}

const iconBtn = cn(
  'inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors',
  'hover:bg-surface-overlay hover:text-text-primary',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
  'disabled:opacity-50 disabled:cursor-not-allowed',
);

/**
 * The frame every dashboard widget sits in: title row (icon, title, subtitle, help, badges),
 * card buttons (full screen, CSV, refresh), the body states (loading, empty, unconfigured, error,
 * stale) and an "Updated …" footer. Every look comes from `card` (`core:card` settings): theme
 * tokens by default, any colour the author picks otherwise.
 */
export function WidgetCard({
  title, card, state = 'ready', stale = false, updatedAt, unconfiguredText = 'Not configured yet.',
  errorText = 'This widget could not load its data.', onRetry, onFullscreen, onExport, onRefresh, refreshing = false,
  headerRight, badges, footer, children, className, style, locale, ...rest
}: WidgetCardProps) {
  const variant = card.variant ?? 'raised';
  const bgMode = card.background ?? 'default';
  const image = bgMode === 'image' ? safeImageUrl(card.backgroundImage) : undefined;
  const buttons = card.buttons ?? [];
  const showTitle = card.showTitle !== false && !!title;
  const staleMode = stale ? card.staleDisplay ?? 'badge' : null;
  const bodyState: WidgetCardState = staleMode === 'hide' ? 'empty' : state;
  const updated = formatUpdated(updatedAt, card.showUpdated, locale);

  const frame: CSSProperties = {
    borderRadius: typeof card.radius === 'number' ? card.radius : undefined,
    color: cssColor(card.textColor),
    ...(typeof card.borderWidth === 'number' ? { borderWidth: card.borderWidth, borderStyle: 'solid' } : {}),
    ...(cssColor(card.borderColor) ? { borderColor: cssColor(card.borderColor) } : {}),
    ...(bgMode === 'none' ? { background: 'transparent' } : {}),
    ...(bgMode === 'color' || bgMode === 'image' ? { backgroundColor: cssColor(card.backgroundColor) } : {}),
    ...(image ? { backgroundImage: `url("${image}")`, backgroundSize: SIZES[card.backgroundSize ?? 'cover'], backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}),
    ...(card.hideOnMobile || card.hideOnDesktop || card.mobileOrder !== undefined || card.mobileHeight !== undefined
      ? { ['--wk-mo' as string]: card.mobileOrder ?? 'initial', ['--wk-mh' as string]: card.mobileHeight ? `${card.mobileHeight}px` : 'auto' }
      : {}),
    ...style,
  };
  const pad = typeof card.padding === 'number' ? card.padding : 12;
  const hasHeader = showTitle || !!headerRight || !!badges || buttons.length > 0 || staleMode !== null;

  return (
    <section
      aria-label={title || undefined}
      aria-busy={state === 'loading' || refreshing || undefined}
      className={cn(
        'group/wk relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl text-text-primary',
        VARIANT[variant],
        card.shadow && SHADOW[card.shadow],
        staleMode === 'dim' && 'opacity-60',
        card.hideOnMobile && 'max-lg:hidden',
        card.hideOnDesktop && 'lg:hidden',
        card.mobileOrder !== undefined && 'max-lg:[order:var(--wk-mo)]',
        card.mobileHeight !== undefined && 'max-lg:[height:var(--wk-mh)]',
        className,
      )}
      style={frame}
      {...rest}
    >
      {image && cssColor(card.overlayColor) && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: cssColor(card.overlayColor), backdropFilter: card.overlayBlur ? `blur(${card.overlayBlur}px)` : undefined }} />
      )}

      {hasHeader && (
        <header className="relative flex min-w-0 items-start gap-2" style={{ padding: `${Math.max(pad - 4, 6)}px ${pad}px 0` }}>
          {showTitle && card.titleIcon && (
            <SettingIcon name={card.titleIcon} className="mt-0.5 shrink-0 text-text-secondary"
              style={{ width: card.titleIconSize ?? 16, height: card.titleIconSize ?? 16, fontSize: card.titleIconSize ?? 16, color: cssColor(card.titleIconColor) }} />
          )}
          <div className="min-w-0 flex-1">
            {showTitle && (
              <div className="flex min-w-0 items-center gap-1.5">
                <h3 className="truncate text-sm font-semibold" style={fontStyle(card.titleFont, card.titleColor)}>{title}</h3>
                {card.titleTooltip && (
                  <Tooltip content={card.titleTooltip}>
                    <button type="button" aria-label={`About ${title}`} className={cn(iconBtn, 'h-5 w-5')}>
                      <FontAwesomeIcon icon={faCircleInfo} className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </Tooltip>
                )}
                {badges}
                {staleMode && (
                  <span className="shrink-0 rounded-full bg-warning-subtle px-2 py-0.5 text-[10px] font-medium text-warning-fg">Old data</span>
                )}
              </div>
            )}
            {showTitle && card.subtitle && (
              <p className="truncate text-xs text-text-secondary" style={{ color: cssColor(card.subtitleColor) }}>{card.subtitle}</p>
            )}
            {!showTitle && staleMode && (
              <span className="rounded-full bg-warning-subtle px-2 py-0.5 text-[10px] font-medium text-warning-fg">Old data</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity lg:opacity-0 lg:group-hover/wk:opacity-100 lg:group-focus-within/wk:opacity-100">
            {headerRight}
            {buttons.includes('refresh') && onRefresh && (
              <button type="button" onClick={onRefresh} disabled={refreshing} aria-label="Refresh" title="Refresh" className={iconBtn}>
                <FontAwesomeIcon icon={faRotateRight} className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} aria-hidden="true" />
              </button>
            )}
            {buttons.includes('export') && onExport && (
              <button type="button" onClick={onExport} aria-label="Download data (CSV)" title="Download data (CSV)" className={iconBtn}>
                <FontAwesomeIcon icon={faDownload} className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            {buttons.includes('fullscreen') && onFullscreen && (
              <button type="button" onClick={onFullscreen} aria-label="Full screen" title="Full screen" className={iconBtn}>
                <FontAwesomeIcon icon={faExpand} className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </header>
      )}

      <div className="relative @container min-h-0 flex-1 overflow-auto" style={{ padding: pad }}>
        {bodyState === 'loading' ? (
          <div className="flex h-full min-h-16 flex-col gap-2" role="status" aria-label="Loading">
            <div className="h-4 w-1/3 animate-pulse rounded bg-surface-sunken" />
            <div className="h-full min-h-8 w-full animate-pulse rounded bg-surface-sunken" />
          </div>
        ) : bodyState === 'empty' ? (
          <div className="flex h-full min-h-16 items-center justify-center text-center text-sm text-text-secondary">
            {card.noDataText || 'No data'}
          </div>
        ) : bodyState === 'unconfigured' ? (
          <div className="flex h-full min-h-16 items-center justify-center text-center text-sm text-text-secondary">{unconfiguredText}</div>
        ) : bodyState === 'error' ? (
          <div role="alert" className="flex h-full min-h-16 flex-col items-center justify-center gap-2 text-center text-sm text-error">
            <p>{errorText}</p>
            {onRetry && (
              <button type="button" onClick={onRetry}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
                Retry
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>

      {(updated || footer) && (
        <footer className="relative flex items-center justify-between gap-2 text-xs text-text-secondary" style={{ padding: `0 ${pad}px ${Math.max(pad - 4, 6)}px` }}>
          <span>{footer}</span>
          {updated && <span>Updated {updated}</span>}
        </footer>
      )}
    </section>
  );
}
