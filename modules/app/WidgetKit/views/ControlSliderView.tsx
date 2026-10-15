'use client';
import { ControlSlider } from '@/modules/ui/ControlTile';
import { asNumber } from '@/modules/ui/ControlTile/control-logic';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue } from '../settings/style';
import { SettingIcon } from '../WidgetKitContext';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { confirmProps, controlBlockReason, requestControl } from './control-common';

type S = {
  layout?: 'default' | 'extended' | 'compact';
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valueFont?: FontValue;
  valueColor?: string;
  showTicks?: boolean;
  tickMarks?: number | null;
  mainColor?: string;
  trackColor?: string;
  disabledMainColor?: string;
  disabledTrackColor?: string;
  startIcon?: string;
  endIcon?: string;
  iconColor?: string;
  commit?: 'release' | 'debounced';
  debounceMs?: number;
  disableWhen?: string[];
};

/** `control.slider`: a bound number; the write is asked for once per gesture (or after a pause). */
export function ControlSliderView(props: WidgetViewProps) {
  const s = props.settings as S;
  const value = props.data.value?.value;
  const set = requestControl(props.onControl, 'set');
  const iconStyle = { color: cssColor(s.iconColor), fontSize: 16, width: 16, height: 16 };
  const layout = s.layout ?? 'default';
  return (
    <ControlSlider
      framed={false}
      value={value}
      {...confirmProps(props.confirm)}
      onCommit={(next, confirmation) => set(next, confirmation)}
      min={s.min}
      max={s.max}
      step={s.step}
      format={(n) => formatValue(n, props.format, {}, props.locale)}
      reportedLabel={(v) => `Reported: ${v}`}
      layout={layout}
      showValue={s.showValue !== false}
      valueStyle={fontStyle(s.valueFont, s.valueColor)}
      showTicks={s.showTicks !== false}
      tickMarks={typeof s.tickMarks === 'number' ? s.tickMarks : undefined}
      colors={{
        main: cssColor(s.mainColor), track: cssColor(s.trackColor),
        disabledMain: cssColor(s.disabledMainColor), disabledTrack: cssColor(s.disabledTrackColor),
      }}
      startIcon={layout === 'extended' && s.startIcon ? <SettingIcon name={s.startIcon} style={iconStyle} /> : undefined}
      endIcon={layout === 'extended' && s.endIcon ? <SettingIcon name={s.endIcon} style={iconStyle} /> : undefined}
      commitMode={s.commit === 'debounced' ? 'debounced' : 'release'}
      debounceMs={s.debounceMs}
      disabledReason={controlBlockReason(props, s.disableWhen, asNumber(value) === null)}
    />
  );
}

export const CONTROL_SLIDER_VIEW: WidgetKindView = { View: ControlSliderView, isEmpty: () => false };
