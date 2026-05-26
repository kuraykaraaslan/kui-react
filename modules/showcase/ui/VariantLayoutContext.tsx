'use client';
import { createContext, useContext } from 'react';
import { type VariantLayout } from './LayoutSwitcher';

type VariantLayoutContextValue = {
  variantLayout: VariantLayout;
  setVariantLayout: (v: VariantLayout) => void;
};

export const VariantLayoutContext = createContext<VariantLayoutContextValue>({
  variantLayout: 'side',
  setVariantLayout: () => {},
});

export function useVariantLayout() {
  return useContext(VariantLayoutContext);
}
