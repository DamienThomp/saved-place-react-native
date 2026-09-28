import { Ionicons } from '@expo/vector-icons';

import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import { useMapActions, useMapStyle } from '~/stores/mapControlsStore';
import { tokens } from '~/constants/theme';
import { MapStyle } from '~/utils/mapBoxUtils';

const MAP_STYLE_META: Record<MapStyle, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  [MapStyle.Standard]: { icon: 'map-outline', label: 'Map style: Standard' },
  [MapStyle.Outdoors]: { icon: 'trail-sign-outline', label: 'Map style: Outdoors' },
  [MapStyle.StandardSatellite]: { icon: 'globe-outline', label: 'Map style: Satellite' },
};

export default function MapStyleToggleButton() {
  const mapStyle = useMapStyle();
  const { cycleMapStyle } = useMapActions();
  const { icon, label } = MAP_STYLE_META[mapStyle];

  return (
    <MapControlContainer>
      <IconButton
        icon={icon}
        color={tokens.colors.white}
        size={28}
        accessibilityLabel={label}
        onPress={cycleMapStyle}
      />
    </MapControlContainer>
  );
}
