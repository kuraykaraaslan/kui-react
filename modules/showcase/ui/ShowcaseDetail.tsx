'use client';
import { useEffect, useRef, useState } from 'react';
import { Widget } from './Widget';
import { CopyButton } from './CopyButton';
import { PropsEditor } from './PropsEditor';
import { useVariantLayout } from './VariantLayoutContext';
import { cn } from '@/libs/utils/cn';
import { buildShowcaseData, type ShowcaseVariant } from '@/modules/showcase/data/showcase.data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const categoryStyles: Record<string, string> = {
  Atom:     'bg-info-subtle text-info-fg',
  Molecule: 'bg-primary-subtle text-primary',
  Organism: 'bg-success-subtle text-success-fg',
  App:      'bg-warning-subtle text-warning-fg',
  Domain:   'bg-error-subtle text-error-fg',
  Theme:    'bg-secondary text-primary-fg',
};

function SourceBlock({ filePath, sourceCode }: { filePath: string; sourceCode: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
      <div className="widget-drag-handle flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface-overlay">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-text-disabled text-xs shrink-0 select-none" aria-hidden="true">⠿</span>
          <span className="text-sm font-semibold text-text-primary">Source</span>
          <span className="font-mono text-xs text-text-secondary bg-surface-sunken px-2 py-0.5 rounded truncate">
            {filePath}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CopyButton code={sourceCode} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Collapse source' : 'Expand source'}
            className={cn(
              'px-2.5 py-1 text-xs rounded-md font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'bg-surface-overlay text-text-secondary hover:text-text-primary hover:bg-surface-sunken'
            )}
          >
            {open ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      {open && (
        <div className="bg-surface-sunken overflow-x-auto">
          <pre className="px-5 py-5 text-sm font-mono text-text-primary leading-relaxed">
            <code>{sourceCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

const MIN_PREVIEW_PCT = 20;
const MAX_PREVIEW_PCT = 80;
const DEFAULT_PREVIEW_PCT = 40;

function VariantBlock({ variant }: { variant: ShowcaseVariant }) {
  const stack = variant.layout === 'stack';
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [previewPct, setPreviewPct] = useState(DEFAULT_PREVIEW_PCT);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const canResize = !stack && isWide;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canResize) return;
    e.preventDefault();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setPreviewPct(Math.min(MAX_PREVIEW_PCT, Math.max(MIN_PREVIEW_PCT, pct)));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canResize) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPreviewPct((v) => Math.max(MIN_PREVIEW_PCT, v - 2));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPreviewPct((v) => Math.min(MAX_PREVIEW_PCT, v + 2));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPreviewPct(MIN_PREVIEW_PCT);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPreviewPct(MAX_PREVIEW_PCT);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setPreviewPct(DEFAULT_PREVIEW_PCT);
    }
  };

  return (
    <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
      <Widget
        title={variant.title}
        headerRight={<CopyButton code={variant.code} />}
      >
        <div
          ref={containerRef}
          className={cn(
            'flex',
            stack ? 'flex-col' : 'flex-col sm:flex-row'
          )}
        >
          <div
            className={cn(
              'flex flex-col',
              !stack && 'border-b border-border sm:border-b-0'
            )}
            style={canResize ? { width: `${previewPct}%` } : undefined}
          >
            <div className="px-3 py-1.5 border-b border-border bg-surface-overlay">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Preview</span>
            </div>
            <div
              className={cn(
                'flex items-start justify-center px-6 py-8',
                stack ? 'min-h-40' : 'flex-1 min-h-28'
              )}
              style={{
                backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              <div className={cn('w-full', !stack && 'flex flex-wrap gap-2 items-center justify-center')}>
                {variant.preview}
              </div>
            </div>
          </div>

          {!stack && (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize preview and code panes"
              aria-valuemin={MIN_PREVIEW_PCT}
              aria-valuemax={MAX_PREVIEW_PCT}
              aria-valuenow={Math.round(previewPct)}
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              onDoubleClick={() => setPreviewPct(DEFAULT_PREVIEW_PCT)}
              title="Drag to resize · Double-click to reset"
              className={cn(
                'hidden sm:flex relative shrink-0 w-1.5 group',
                'cursor-col-resize touch-none select-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus'
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border group-hover:bg-border-focus group-active:bg-border-focus transition-colors"
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-border-strong opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
              />
            </div>
          )}

          <div
            className={cn(
              'flex flex-col bg-surface-sunken overflow-x-auto',
              !stack && 'flex-1 min-w-0'
            )}
          >
            <div className="px-3 py-1.5 border-b border-border bg-surface-overlay">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Code</span>
            </div>
            <pre className="flex-1 px-4 py-5 text-sm font-mono text-text-primary leading-relaxed whitespace-pre-wrap">
              <code>{variant.code}</code>
            </pre>
          </div>
        </div>
      </Widget>
    </div>
  );
}

export function ShowcaseDetail({ slug }: { slug: string }) {
  const data = buildShowcaseData();
  const dataMap = Object.fromEntries(data.map((c) => [c.id, c]));
  const selected = dataMap[slug];
  const { variantLayout } = useVariantLayout();

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FontAwesomeIcon icon={faHouse} className="text-4xl text-text-disabled mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-text-primary mb-1">Showcase coming soon</h2>
        <p className="text-sm text-text-secondary">No preview has been added for this component yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-text-primary leading-tight">
            {selected.title}
          </h2>
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              categoryStyles[selected.category]
            )}
          >
            {selected.category}
          </span>
        </div>
        <p className="text-sm text-text-secondary max-w-2xl">{selected.description}</p>
      </div>

      {selected.playground && (
        <PropsEditor {...selected.playground} />
      )}

      <div className={cn(
        'grid gap-4',
        variantLayout === 'grid'
          ? 'grid-cols-1 xl:grid-cols-2'
          : 'grid-cols-1'
      )}>
        {selected.variants.map((variant: ShowcaseVariant) => (
          <div
            key={variant.title}
            className={variantLayout === 'grid' && variant.layout === 'stack' ? 'xl:col-span-2' : ''}
          >
            <VariantBlock
              variant={variantLayout === 'side' || variantLayout === 'stack'
                ? { ...variant, layout: variantLayout }
                : variant}
            />
          </div>
        ))}
      </div>

      <SourceBlock filePath={selected.filePath} sourceCode={selected.sourceCode} />
    </>
  );
}
