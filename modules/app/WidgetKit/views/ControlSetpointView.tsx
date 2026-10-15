'use client';
import { ControlSetpoint } from '@/modules/ui/ControlTile';
import { asNumber } from '@/modules/ui/ControlTile/control-logic';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue } from '../settings/style';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { confirmProps, controlBlockReason, requestControl, textOr } from './control-common';

type S = {
  layout?: 'input' | 'stepper';
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valueFont?: FontValue;
  valueColor?: string;
  applyLabel?: string;
  buttonColor?: string;
  borderColor?: string;
  disableWhen?: string[];
};

/** `control.setpoint`: type a number and apply it, or step it; the host writes it. */
export function ControlSetpointView(props: WidgetViewProps) {
  const s = props.settings as S;
  const value = props.data.value?.value;
  const set = requestControl(props.onControl, 'set');
  const apply = textOr(s.applyLabel);
  const { messages: confirmMessages, ...confirm } = confirmProps(props.confirm);
  return (
    <ControlSetpoint
      framed={false}
      value={value}
      {...confirm}
      onCommit={(next, confirmation) => set(next, confirmation)}
      min={s.min}
      max={s.max}
      step={s.step}
      unit={props.format.unit || undefined}
      format={(n) => formatValue(n, props.format, {}, props.locale)}
      layout={s.layout === 'stepper' ? 'stepper' : 'input'}
      showValue={s.showValue !== false}
      valueStyle={fontStyle(s.valueFont, s.valueColor)}
      buttonColor={cssColor(s.buttonColor)}
      borderColor={cssColor(s.borderColor)}
      messages={apply || confirmMessages ? { ...confirmMessages, ...(apply ? { apply } : {}) } : undefined}
      disabledReason={controlBlockReason(props, s.disableWhen, asNumber(value) === null)}
    />
  );
}

export const CONTROL_SETPOINT_VIEW: WidgetKindView = { View: ControlSetpointView, isEmpty: () => false };
