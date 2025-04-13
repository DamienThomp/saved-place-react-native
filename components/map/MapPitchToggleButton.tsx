import { useTheme } from '@react-navigation/native';

import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import { useIsPitchToggled, useMapActions } from '~/stores/mapControlsStore';

export default function MapPitchToggleButton() {
  const isPitchToggled = useIsPitchToggled();
  const { toggleMapPitch } = useMapActions();
  const theme = useTheme();

  const onTogglePitch = () => {
    toggleMapPitch(!isPitchToggled);
  };

  return (
    <MapControlContainer>
      <IconButton
        icon={isPitchToggled ? 'layers-outline' : 'layers'}
        color={theme.colors.card}
        size={28}
        onPress={onTogglePitch}
      />
    </MapControlContainer>
  );
}
