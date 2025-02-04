import {
  getCurrentPositionAsync,
  LocationObjectCoords,
  useForegroundPermissions,
} from 'expo-location';
import { useEffect, useState } from 'react';

import verifyPermission from '~/utils/verifyPermission';

export default function useUserLocation() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [locationPermission, requestPermission] = useForegroundPermissions();

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await verifyPermission(
        locationPermission,
        'This app needs permission to find your location.',
        requestPermission
      );

      if (!hasPermission) return;

      const result = await getCurrentPositionAsync();
      setLocation(result.coords);
    };

    getLocation();
  }, []);

  return location;
}
