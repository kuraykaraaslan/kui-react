'use client';
import { ControlSwitch } from '@/modules/ui/ControlTile';
import { asBoolean } from '@/modules/ui/ControlTile/control-logic';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle } from '../settings/style';
import { SettingIcon } from '../WidgetKitContext';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { confirmProps, controlBlockReason, requestControl, textOr } from './control-common';

type S = {
  layout?: 'right' | 'left' | 'centered';
  label?: string;
  labelFont?: FontValue;
  labelColor?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  showStateText?: boolean;
  onLabel?: string;
  offLabel?: string;
  unknownLabel?: string;
  stateFont?: FontValue;
  onTextColor?: string;
  offTextColor?: string;
  unknownTextColor?: string;
  onColor?: string;
  offColor?: string;
  disabledColor?: string;
  thumbColor?: string;
  onMatch?: string;
  disableWhen?: string[];
};

/**
 * The bound value as on / off / unknown. With `onMatch` set, only that exact value means on and any
 * other present value means off; without it, the usual spellings (true, 1, on, yes …) are read.
 */
export function switchState(value: unknown, onMatch?: string): boolean | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof onMatch === 'string' && onMatch.trim() !== '') {
    if (typeof value === 'object') return null;
    return String(value).trim() === onMatch.trim();
  }
  return asBoolean(value);
}

/** `control.switch`: reads the bound state, asks the host to write the toggled value. */
export function ControlSwitchView(props: WidgetViewProps) {
  const s = props.settings as S;
  const state = switchState(props.data.value?.value, s.onMatch);
  const iconSize = typeof s.iconSize === 'number' ? s.iconSize : 20;
  const set = requestControl(props.onControl, 'set');
  return (
    <ControlSwitch
      framed={false}
      value={state}
      {...confirmProps(props.confirm)}
      onCommit={(next, confirmation) => set(next, confirmation)}
      layout={s.layout ?? 'right'}
      label={textOr(s.label)}
      labelStyle={fontStyle(s.labelFont, s.labelColor)}
      icon={s.icon ? <SettingIcon name={s.icon} style={{ width: iconSize, height: iconSize, fontSize: iconSize, color: cssColor(s.iconColor) }} /> : undefined}
      showStateText={s.showStateText !== false}
      onLabel={textOr(s.onLabel)}
      offLabel={textOr(s.offLabel)}
      unknownLabel={textOr(s.unknownLabel)}
      stateStyles={{
        on: fontStyle(s.stateFont, s.onTextColor),
        off: fontStyle(s.stateFont, s.offTextColor),
        unknown: fontStyle(s.stateFont, s.unknownTextColor),
      }}
      colors={{ on: cssColor(s.onColor), off: cssColor(s.offColor), disabled: cssColor(s.disabledColor), thumb: cssColor(s.thumbColor) }}
      disabledReason={controlBlockReason(props, s.disableWhen, state === null)}
    />
  );
}

export const CONTROL_SWITCH_VIEW: WidgetKindView = { View: ControlSwitchView, isEmpty: () => false };
