import {
  Accuracy,
  getCurrentPositionAsync,
  LocationObjectCoords,
  LocationOptions,
  LocationPermissionResponse,
  LocationSubscription,
  watchPositionAsync,
} from 'expo-location';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import useLocationPermissions from '~/hooks/useLocationPermissions';

type LocationContextState = {
  userLocation?: LocationObjectCoords | null;
  permissionStatus?: LocationPermissionResponse | null;
};

const LocationContext = createContext<LocationContextState>({});

const config: LocationOptions = {
  accuracy: Accuracy.Balanced,
  timeInterval: 5000,
  distanceInterval: 10, // update if device moves by 10 meters
};

export default function LocationProvider({ children }: PropsWithChildren) {
  const locationPermission = useLocationPermissions();
  const [userLocation, setLocation] = useState<LocationObjectCoords>();

  const subscribeToLocationUpdates = async () => {
    if (!locationPermission || !locationPermission.granted) return;

    const locationSubscription = await watchPositionAsync(config, (newLocation) => {
      setLocation(newLocation.coords);
    });

    return locationSubscription;
  };

  useEffect(() => {
    if (!locationPermission || !locationPermission.granted) return;

    const getLocation = async () => {
      const result = await getCurrentPositionAsync();
      setLocation(result.coords);
    };

    getLocation();
  }, [locationPermission]);

  useEffect(() => {
    if (!locationPermission?.granted) {
      return;
    }

    let locationSubscription: LocationSubscription | undefined;

    (async () => {
      locationSubscription = await subscribeToLocationUpdates();
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
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
