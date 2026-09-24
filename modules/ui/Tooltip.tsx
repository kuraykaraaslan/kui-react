'use client';
import { cn } from '@/libs/utils/cn';
import { useId, useRef, useState } from 'react';

type TooltipTheme = 'default' | 'dark' | 'light';
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

const themeMap: Record<TooltipTheme, string> = {
  default: 'bg-surface-overlay text-text-primary border border-border',
  dark:    'bg-gray-900 text-white border-transparent',
  light:   'bg-white text-gray-900 border border-border shadow-md',
};

const arrowBaseClass = 'absolute w-2 h-2 rotate-45 border border-border';

const arrowPlacementClass: Record<TooltipPlacement, string> = {
  top:    'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0',
  bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0',
  left:   'right-[-5px] top-1/2 -translate-y-1/2 border-l-0 border-b-0',
  right:  'left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-t-0',
};

const arrowThemeMap: Record<TooltipTheme, string> = {
  default: 'bg-surface-overlay',
  dark:    'bg-gray-900 border-transparent',
  light:   'bg-white',
};

const placementClass: Record<TooltipPlacement, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({
  content,
  placement = 'top',
  theme = 'default',
  arrow = false,
  delay = 0,
  children,
  className,
}: {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  theme?: TooltipTheme;
  arrow?: boolean;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = `tooltip-${useId()}`;

  function show() {
    if (delay > 0) {
      timer.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  }

  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }

  return (
    <span
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={cn(
          'absolute z-[80] whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md',
          'transition-opacity duration-150 pointer-events-none',
          themeMap[theme],
          placementClass[placement],
          visible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {content}
        {arrow && (
          <span
            aria-hidden="true"
            className={cn(
              arrowBaseClass,
              arrowPlacementClass[placement],
              arrowThemeMap[theme]
            )}
          />
        )}
      </span>
    </span>
  );
}
