'use client';
import { cn } from '@/libs/utils/cn';

type SeparatorOrientation = 'horizontal' | 'vertical';

type SeparatorProps = {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  label?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Separator({ orientation = 'horizontal', decorative = true, label, className, ...rest }: SeparatorProps) {
  const ariaProps = decorative ? { role: 'none' as const } : { role: 'separator' as const, 'aria-orientation': orientation };

  if (label && orientation === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-3 text-xs font-medium text-text-secondary', className)} {...ariaProps} {...rest}>
        <span className="h-px flex-1 bg-border" />
        {label}
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <div
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
      {...ariaProps}
      {...rest}
    />
  );
}
