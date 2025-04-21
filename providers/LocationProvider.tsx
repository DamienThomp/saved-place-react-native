import {
  getCurrentPositionAsync,
  LocationObjectCoords,
  LocationPermissionResponse,
} from 'expo-location';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import useLocationPermissions from '~/hooks/useLocationPermissions';

type LocationContextState = {
  userLocation?: LocationObjectCoords | null;
  permissionStatus?: LocationPermissionResponse | null;
};

const LocationContext = createContext<LocationContextState>({});

export default function LocationProvider({ children }: PropsWithChildren) {
  const locationPermission = useLocationPermissions();
  const [userLocation, setLocation] = useState<LocationObjectCoords>();

  useEffect(() => {
    if (!locationPermission || !locationPermission.granted) return;

    const getLocation = async () => {
      const result = await getCurrentPositionAsync();
      setLocation(result.coords);
    };

    getLocation();
  }, [locationPermission]);

  return (
    <>
      <LocationContext.Provider value={{ userLocation, permissionStatus: locationPermission }}>
        {children}
      </LocationContext.Provider>
    </>
  );
}

export const useLocation = () => useContext(LocationContext);
