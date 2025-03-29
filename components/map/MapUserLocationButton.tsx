import { useTheme } from '@react-navigation/native';

import IconButton from '../ui/IconButton';

import useUserLocation from '~/hooks/useUserLocation';
import { useMapActions } from '~/stores/mapControlsStore';

export default function MapUserLocationButton() {
  const { setMapCenter } = useMapActions();
  const userLocation = useUserLocation();
  const theme = useTheme();

  const onToggleToUserLocation = () => {
    if (userLocation) {
      setMapCenter([userLocation.longitude, userLocation.latitude]);
    }
  };
  return (
    <IconButton
      icon="navigate-circle-sharp"
      color={theme.colors.primary}
      size={36}
      onPress={onToggleToUserLocation}
      style={{ paddingTop: 4 }}
    />
  );
}
