import DirectionsBikeIcon from '@expo/material-symbols/directions_bike.xml';
import DirectionsCarIcon from '@expo/material-symbols/directions_car.xml';
import DirectionsWalkIcon from '@expo/material-symbols/directions_walk.xml';
import TrafficIcon from '@expo/material-symbols/traffic.xml';
import {
  Host,
  Icon,
  Row,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text,
} from '@expo/ui/jetpack-compose';
import { ImageSourcePropType } from 'react-native';

import { DirectionType } from '~/api/directions';
import {
  DIRECTION_MODES,
  DirectionTypeSelectorProps,
} from '~/components/map/directions/selector/directionModes';

const MODE_ICONS: Record<DirectionType, ImageSourcePropType> = {
  [DirectionType.Driving]: DirectionsCarIcon,
  [DirectionType.Walking]: DirectionsWalkIcon,
  [DirectionType.Cycling]: DirectionsBikeIcon,
  [DirectionType.DrivingTraffic]: TrafficIcon,
};

export default function DirectionTypeSelector({ value, onChange }: DirectionTypeSelectorProps) {
  return (
    <SingleChoiceSegmentedButtonRow>
      {DIRECTION_MODES.map((mode) => (
        <SegmentedButton
          key={mode.value}
          selected={value === mode.value}
          onClick={() => onChange(mode.value)}>
          <SegmentedButton.Label>
            <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 4 }}>
              <Icon source={MODE_ICONS[mode.value]} size={18} contentDescription={mode.label} />
              <Text>{mode.label}</Text>
            </Row>
          </SegmentedButton.Label>
        </SegmentedButton>
      ))}
    </SingleChoiceSegmentedButtonRow>
  );
}
