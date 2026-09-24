'use client';
import { createContext, useContext, useLayoutEffect } from 'react';
import { getDirection, isRTL, type AppLanguage } from '../I18nTypes';

type DirectionContextValue = {
  lang: AppLanguage;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
};

const DirectionContext = createContext<DirectionContextValue>({
  lang: 'en' as AppLanguage,
  dir: 'ltr',
  isRTL: false,
});

export function useDirection(): DirectionContextValue {
  return useContext(DirectionContext);
}

type DirectionProviderProps = {
  lang: AppLanguage;
  children: React.ReactNode;
  applyToDocument?: boolean;
};

export function DirectionProvider({ lang, children, applyToDocument = false }: DirectionProviderProps) {
  const dir = getDirection(lang);

  // Layout effect so <html dir/lang> is updated before the browser paints.
  useLayoutEffect(() => {
    if (!applyToDocument) return;
    document.documentElement.dir  = dir;
    document.documentElement.lang = lang;
  }, [applyToDocument, dir, lang]);

  return (
    <DirectionContext.Provider value={{ lang, dir, isRTL: isRTL(lang) }}>
      <div dir={dir} lang={lang}>
        {children}
      </div>
    </DirectionContext.Provider>
  );
}
