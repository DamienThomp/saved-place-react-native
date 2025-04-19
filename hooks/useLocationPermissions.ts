import { LocationPermissionResponse, requestForegroundPermissionsAsync } from 'expo-location';
import { useEffect, useState } from 'react';

export default function useLocationPermissions() {
  const [locationPermission, setLocationPermission] = useState<LocationPermissionResponse>();

  useEffect(() => {
    const getPermission = async () => {
      const response = await requestForegroundPermissionsAsync();
      setLocationPermission(response);
    };

    getPermission();
  }, []);

  return locationPermission;
}
