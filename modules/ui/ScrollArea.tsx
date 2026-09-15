'use client';
import { cn } from '@/libs/utils/cn';

type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

type ScrollAreaProps = {
  orientation?: ScrollAreaOrientation;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const overflowClasses: Record<ScrollAreaOrientation, string> = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
};

export function ScrollArea({ orientation = 'vertical', className, children, ...rest }: ScrollAreaProps) {
  return (
    <div
      className={cn(
        'relative rounded-md',
        overflowClasses[orientation],
        '[scrollbar-width:thin] [scrollbar-color:var(--border-strong)_transparent]',
        '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-thumb]:rounded-full',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
