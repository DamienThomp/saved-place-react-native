import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import useUserLocation from '~/hooks/useUserLocation';
import { useMapActions } from '~/stores/mapControlsStore';

export default function MapUserLocationButton() {
  const { setMapCenter } = useMapActions();
  const userLocation = useUserLocation();

  const onToggleToUserLocation = () => {
    if (userLocation) {
      setMapCenter([userLocation.longitude, userLocation.latitude]);
    }
  };
  return (
    <MapControlContainer>
      <IconButton
        icon="navigate-circle-sharp"
        color="white"
        size={28}
        onPress={onToggleToUserLocation}
      />
    </MapControlContainer>
  );
}
