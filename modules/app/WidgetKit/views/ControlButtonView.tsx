'use client';
import type { CSSProperties } from 'react';
import { ControlButton } from '@/modules/ui/ControlTile';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle } from '../settings/style';
import { SettingIcon } from '../WidgetKitContext';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { confirmProps, controlBlockReason, requestControl, textOr } from './control-common';

type S = {
  layout?: 'button' | 'tile';
  label?: string;
  labelFont?: FontValue;
  icon?: string;
  iconSize?: number;
  appearance?: 'filled' | 'outlined' | 'ghost' | 'underlined';
  mainColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number | null;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

const VARIANT = { filled: 'primary', outlined: 'outline', ghost: 'ghost', underlined: 'ghost' } as const;

/** The button's inline style from its appearance and colours (settings data only reaches the DOM here). */
export function buttonStyleOf(s: S): CSSProperties {
  const appearance = s.appearance && VARIANT[s.appearance] ? s.appearance : 'filled';
  const main = cssColor(s.mainColor);
  const text = cssColor(s.textColor);
  const bg = cssColor(s.backgroundColor);
  const out: CSSProperties = { ...fontStyle(s.labelFont) };
  if (appearance === 'filled') {
    if (bg ?? main) { out.background = bg ?? main; out.borderColor = bg ?? main; }
    if (text) out.color = text;
  } else {
    if (bg) out.background = bg;
    if (text ?? main) out.color = text ?? main;
    if (appearance === 'outlined' && main) out.borderColor = main;
  }
  if (typeof s.borderRadius === 'number') out.borderRadius = s.borderRadius;
  return out;
}

/** `control.button`: one press asks the host to run the placement's command. */
export function ControlButtonView(props: WidgetViewProps) {
  const s = props.settings as S;
  const appearance = s.appearance && VARIANT[s.appearance] ? s.appearance : 'filled';
  const iconSize = typeof s.iconSize === 'number' ? s.iconSize : 16;
  const layout = s.layout === 'tile' ? 'tile' : 'button';
  const size = layout === 'tile' ? Math.max(iconSize, 28) : iconSize;
  const icon = s.icon ? <SettingIcon name={s.icon} style={{ width: size, height: size, fontSize: size }} /> : undefined;
  const run = requestControl(props.onControl, 'run');
  return (
    <ControlButton
      framed={false}
      layout={layout}
      label={textOr(s.label)}
      icon={icon}
      variant={VARIANT[appearance]}
      size={s.size ?? 'md'}
      fullWidth={s.fullWidth !== false}
      buttonStyle={buttonStyleOf(s)}
      buttonClassName={appearance === 'underlined' ? 'underline underline-offset-4' : undefined}
      disabledReason={controlBlockReason(props, [], false)}
      {...confirmProps(props.confirm)}
      onCommit={(confirmation) => run(undefined, confirmation)}
    />
  );
}

export const CONTROL_BUTTON_VIEW: WidgetKindView = { View: ControlButtonView, isEmpty: () => false };
