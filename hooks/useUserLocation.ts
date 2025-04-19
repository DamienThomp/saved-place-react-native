import { getCurrentPositionAsync, LocationObjectCoords } from 'expo-location';
import { useEffect, useState } from 'react';

import useLocationPermissions from './useLocationPermissions';

export default function useUserLocation() {
  const [userLocation, setLocation] = useState<LocationObjectCoords | null>(null);
  const locationPermission = useLocationPermissions();

  useEffect(() => {
    const getLocation = async () => {
      if (!locationPermission?.granted) return;

      const result = await getCurrentPositionAsync();
      setLocation(result.coords);
    };

    getLocation();
  }, []);

  return { userLocation, setLocation };
}
