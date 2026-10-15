'use client';
import { createContext, useContext } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { FieldOverrides } from '../SchemaForm/schema-form.context';

export interface WidgetKitHost {
  /** Draw an icon setting value ('fas fa-bolt', 'mdi:lamp', …). The host owns its icon set. */
  renderIcon?: (name: string, props: { className?: string; style?: CSSProperties }) => ReactNode;
  /** Field renderers for app-bound field types (icon, media, data-key pickers, …). */
  fieldOverrides?: FieldOverrides;
  /** Locale for numbers and dates; defaults to the browser's. */
  locale?: string;
}

const Ctx = createContext<WidgetKitHost>({});

export function WidgetKitProvider({ value, children }: { value: WidgetKitHost; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useWidgetKit = () => useContext(Ctx);

/** An icon from a setting, through the host's resolver; nothing when there is none. */
export function SettingIcon({ name, className, style }: { name?: unknown; className?: string; style?: CSSProperties }) {
  const { renderIcon } = useWidgetKit();
  if (typeof name !== 'string' || !name || !renderIcon) return null;
  return <>{renderIcon(name, { className, style })}</>;
}
