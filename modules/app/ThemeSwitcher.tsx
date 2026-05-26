'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faDisplay, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { DropdownMenu } from '../ui/DropdownMenu';

type Theme = 'light' | 'dark' | 'system';

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const t = window.localStorage.getItem('theme');
  return t === 'light' || t === 'dark' || t === 'system' ? t : 'system';
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const icon = theme === 'light' ? faSun : theme === 'dark' ? faMoon : faDisplay;
  const label = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <DropdownMenu
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <span className="w-4 flex items-center justify-center shrink-0" aria-hidden="true" suppressHydrationWarning>
            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
          </span>
          <span className="inline-block min-w-[3.5rem] text-left" suppressHydrationWarning>{label}</span>
          <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-text-disabled" />
        </Button>
      }
      items={[
        { type: 'item', label: 'Light', icon: <FontAwesomeIcon icon={faSun} />, onClick: () => setTheme('light') },
        { type: 'item', label: 'Dark', icon: <FontAwesomeIcon icon={faMoon} />, onClick: () => setTheme('dark') },
        { type: 'item', label: 'System', icon: <FontAwesomeIcon icon={faDisplay} />, onClick: () => setTheme('system') },
      ]}
    />
  );
}
