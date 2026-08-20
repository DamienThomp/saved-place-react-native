import { Label, Picker } from '@expo/ui/swift-ui';
import { padding, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';

import { DirectionType } from '~/api/directions';
import {
  DIRECTION_MODES,
  DirectionTypeSelectorProps,
} from '~/components/map/directions/selector/directionModes';

const MODE_ICONS: Record<DirectionType, SFSymbol> = {
  [DirectionType.Driving]: 'car.fill',
  [DirectionType.Walking]: 'figure.walk',
  [DirectionType.Cycling]: 'bicycle',
  [DirectionType.DrivingTraffic]: 'car.side.fill',
};

export default function DirectionTypeSelector({ value, onChange }: DirectionTypeSelectorProps) {
  return (
    <Picker
      modifiers={[pickerStyle('segmented'), padding({ all: 16 })]}
      selection={value}
      onSelectionChange={onChange}>
      {DIRECTION_MODES.map((mode) => (
        <Label
          key={mode.value}
          title={mode.label}
          systemImage={MODE_ICONS[mode.value]}
          modifiers={[tag(mode.value)]}
        />
      ))}
    </Picker>
  );
}
