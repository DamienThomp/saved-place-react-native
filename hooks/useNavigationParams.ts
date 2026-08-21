import { useLocalSearchParams } from 'expo-router';

import { DirectionType } from '~/api/directions';
import { NavigationParams } from '~/types/navigation';

export enum NavigationParamsError {
  MISSING_PARAMETERS = 'Missing or invalid navigation parameters.',
  INVALID_COORDINATES = 'Invalid navigation coordinates.',
}

type NavigationParamsResult = {
  params?: NavigationParams;
  error: Error | null;
};

export function useNavigationParams(): NavigationParamsResult {
  const { originLng, originLat, destinationLng, destinationLat, mode, title } =
    useLocalSearchParams<{
      originLng: string;
      originLat: string;
      destinationLng: string;
      destinationLat: string;
      mode: string;
      title: string;
    }>();

  if (!originLng || !originLat || !destinationLng || !destinationLat || !mode || !title) {
    return { error: new Error(NavigationParamsError.MISSING_PARAMETERS) };
  }

  if (!Object.values(DirectionType).includes(mode as DirectionType)) {
    return { error: new Error(NavigationParamsError.MISSING_PARAMETERS) };
  }

  const origin = { longitude: Number(originLng), latitude: Number(originLat) };
  const destination = { longitude: Number(destinationLng), latitude: Number(destinationLat) };

  if (
    [origin.longitude, origin.latitude, destination.longitude, destination.latitude].some(
      Number.isNaN
    )
  ) {
    return { error: new Error(NavigationParamsError.INVALID_COORDINATES) };
  }

  return {
    params: { origin, destination, mode: mode as DirectionType, title },
    error: null,
  };
}
