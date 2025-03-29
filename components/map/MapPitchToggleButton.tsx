import { useTheme } from '@react-navigation/native';

import IconButton from '../ui/IconButton';

import { useIsPitchToggled, useMapActions } from '~/stores/mapControlsStore';

export default function MapPitchToggleButton() {
  const isPitchToggled = useIsPitchToggled();
  const { toggleMapPitch } = useMapActions();
  const theme = useTheme();

  const onTogglePitch = () => {
    toggleMapPitch(!isPitchToggled);
  };

  return <IconButton icon="map" color={theme.colors.primary} size={36} onPress={onTogglePitch} />;
}
