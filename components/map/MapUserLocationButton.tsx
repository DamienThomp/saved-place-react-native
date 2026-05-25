import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import { useLocation } from '~/providers/LocationProvider';
import { useMapActions } from '~/stores/mapControlsStore';

export default function MapUserLocationButton() {
  const { setMapCenter } = useMapActions();
  const { userLocation } = useLocation();

  const onToggleToUserLocation = () => {
    if (!userLocation) return;
      
    setMapCenter([userLocation.longitude, userLocation.latitude]);
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
