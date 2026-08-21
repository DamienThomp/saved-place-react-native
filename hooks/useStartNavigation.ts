import { getCurrentPositionAsync } from 'expo-location';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useDirections } from '~/providers/DirectionsProvider';
import { Coordinates } from '~/types/types';

type StartNavigationParams = {
  coordinates: Coordinates;
  title: string;
};

export function useStartNavigation() {
  const router = useRouter();
  const { mode } = useDirections();

  const startNavigation = async ({ coordinates, title }: StartNavigationParams) => {
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
    } catch {
      Alert.alert('Unable to start navigation', 'Could not get your current location.');
    }
  };

  return { startNavigation };
}
