import { getCurrentPositionAsync } from 'expo-location';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useDirections } from '~/providers/DirectionsProvider';
import { Coordinates } from '~/types/types';

type UseDirectionsBottomSheetParams = {
  coordinates: Coordinates;
  title: string;
  onDismiss: () => void;
};

export function useDirectionsBottomSheet({
  coordinates,
  title,
  onDismiss,
}: UseDirectionsBottomSheetParams) {
  const router = useRouter();
  const { mode, setMode, directionCoordinates, routeTime, routeDistance } = useDirections();

  const handleNavigate = async () => {
    if (!mode) return;

    try {
      const { coords } = await getCurrentPositionAsync();

      router.push({
        pathname: './navigation',
        params: {
          originLng: String(coords.longitude),
          originLat: String(coords.latitude),
          destinationLng: String(coordinates.longitude),
          destinationLat: String(coordinates.latitude),
          mode,
          title,
        },
      });

      onDismiss();
    } catch {
      Alert.alert('Unable to start navigation', 'Could not get your current location.');
    }
  };

  const handlePresentedChange = (open: boolean) => {
    if (!open) {
      onDismiss();
    }
  };

  return {
    mode,
    setMode,
    directionCoordinates,
    routeTime,
    routeDistance,
    handleNavigate,
    handlePresentedChange,
  };
}
