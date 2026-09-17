'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import type { Testimonial } from '../types';

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-border bg-surface-raised p-6 gap-4',
        className,
      )}
    >
      <FontAwesomeIcon
        icon={faQuoteLeft}
        className="w-5 h-5 text-primary/40"
        aria-hidden="true"
      />

      {testimonial.rating && (
        <div role="img" className="flex items-center gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={cn(
                'w-3.5 h-3.5',
                i < testimonial.rating! ? 'text-warning' : 'text-surface-sunken',
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      <blockquote className="flex-1 text-sm text-text-primary leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        {testimonial.authorAvatar ? (
          <img
            src={testimonial.authorAvatar}
            alt={testimonial.authorName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-subtle flex items-center justify-center text-xs font-bold text-primary">
            {testimonial.authorName.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{testimonial.authorName}</p>
          {(testimonial.authorTitle || testimonial.companyName) && (
            <p className="text-xs text-text-secondary truncate">
              {[testimonial.authorTitle, testimonial.companyName].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        {testimonial.companyLogo && (
          <img
            src={testimonial.companyLogo}
            alt={testimonial.companyName ?? ''}
            className="ml-auto h-6 w-auto object-contain opacity-60"
          />
        )}
      </div>
    </div>
  );
}
