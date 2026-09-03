import MapControlContainer from './MapControlContainer';
import IconButton from '../ui/IconButton';

import { useLocation } from '~/providers/LocationProvider';
import { useMapActions } from '~/stores/mapControlsStore';
import { tokens } from '~/constants/theme';

export default function MapUserLocationButton() {
  const { flyTo } = useMapActions();
  const { userLocation } = useLocation();

  const onToggleToUserLocation = () => {
    if (!userLocation) return;

    flyTo([userLocation.longitude, userLocation.latitude]);
  };

  return (
    <MapControlContainer>
      <IconButton
        icon="navigate-circle-sharp"
        color={tokens.colors.white}
        size={28}
        accessibilityLabel="Toggle to current location"
        onPress={onToggleToUserLocation}
      />
    </MapControlContainer>
  );
}
