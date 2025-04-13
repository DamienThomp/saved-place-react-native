import { useTheme } from '@react-navigation/native';

import IconButton from '../ui/IconButton';

import useUserLocation from '~/hooks/useUserLocation';
import { useMapActions } from '~/stores/mapControlsStore';
import MapControlContainer from './MapControlContainer';

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
    <MapControlContainer>
      <IconButton
        icon="navigate-circle-sharp"
        color={theme.colors.card}
        size={28}
        onPress={onToggleToUserLocation}
      />
    </MapControlContainer>
  );
}
