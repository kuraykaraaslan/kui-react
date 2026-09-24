'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { ModelProviderBadge } from './ModelProviderBadge';
import { ModelTypeBadge } from './ModelTypeBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faMicrochip,
  faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import type { AIModel } from '../types';

type ModelCardProps = {
  model: AIModel;
  href?: string;
  className?: string;
};

export function ModelCard({ model, href, className }: ModelCardProps) {
  const body = (
    <div className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-text-primary leading-snug truncate">
            {model.name}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5 font-mono">{model.modelId}</p>
        </div>
        {model.active ? (
          <Badge variant="success" size="sm" dot>Active</Badge>
        ) : (
          <Badge variant="neutral" size="sm" dot>Inactive</Badge>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <ModelProviderBadge provider={model.provider} size="sm" />
        <ModelTypeBadge type={model.type} size="sm" />
      </div>

      {/* Stats */}
      <div className="border-t border-border pt-3 grid grid-cols-2 gap-3">
        {model.contextWindow != null && (
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faMicrochip} className="w-3.5 h-3.5 text-text-secondary shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[10px] text-text-secondary leading-none">Context</p>
              <p className="text-xs font-medium text-text-primary mt-0.5">
                {model.contextWindow >= 1000
                  ? `${(model.contextWindow / 1000).toFixed(0)}k`
                  : model.contextWindow}{' '}
                tokens
              </p>
            </div>
          </div>
        )}
        {(model.pricingPromptPer1k != null || model.pricingCompletionPer1k != null) && (
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faDollarSign} className="w-3.5 h-3.5 text-text-secondary shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[10px] text-text-secondary leading-none">Pricing / 1k</p>
              <p className="text-xs font-medium text-text-primary mt-0.5">
                {model.pricingPromptPer1k != null
                  ? `$${model.pricingPromptPer1k.toFixed(4)} in`
                  : '—'}
                {' / '}
                {model.pricingCompletionPer1k != null
                  ? `$${model.pricingCompletionPer1k.toFixed(4)} out`
                  : '—'}
              </p>
            </div>
          </div>
        )}
        {model.maxOutputTokens != null && (
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 text-text-secondary shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[10px] text-text-secondary leading-none">Max output</p>
              <p className="text-xs font-medium text-text-primary mt-0.5">
                {model.maxOutputTokens >= 1000
                  ? `${(model.maxOutputTokens / 1000).toFixed(0)}k`
                  : model.maxOutputTokens}{' '}
                tokens
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const baseClass = cn(
    'group rounded-xl border border-border bg-surface-raised flex flex-col overflow-hidden',
    href && 'hover:shadow-md hover:border-border-focus transition-all duration-200',
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(baseClass, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus')}
      >
        {body}
      </a>
    );
  }

  return <div className={baseClass}>{body}</div>;
}
