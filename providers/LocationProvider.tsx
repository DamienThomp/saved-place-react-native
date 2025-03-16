import { getCurrentPositionAsync } from 'expo-location';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import getDirections from '~/lib/directions';
import { Coordinates, MapboxDirections } from '~/types/types';

type SelectedPoint = {
  longitude: number;
  latitude: number;
};

type LocationContextState = {
  selectedPoint?: SelectedPoint;
  directions?: MapboxDirections | null;
  directionCoordinates?: [number, number][] | undefined;
  routeTime?: number | undefined;
  routeDistance?: number | undefined;
  setSelectedPoint?: Dispatch<SetStateAction<SelectedPoint | undefined>>;
  setDirections?: Dispatch<SetStateAction<MapboxDirections | null | undefined>>;
};

const LocationContext = createContext<LocationContextState>({});

export default function LocationProvider({ children }: PropsWithChildren) {
  const [directions, setDirections] = useState<MapboxDirections | null>();
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>();

  useEffect(() => {
    const fetchDirections = async ({ longitude, latitude }: SelectedPoint) => {
      const { coords } = await getCurrentPositionAsync();
      const start: Coordinates = { longitude: coords.longitude, latitude: coords.latitude };
      const end: Coordinates = { longitude, latitude };

      const response = await getDirections(start, end);

      setDirections(response);
    };
    if (selectedPoint) {
      fetchDirections({ ...selectedPoint });
    }
  }, [selectedPoint]);

  return (
    <LocationContext.Provider
      value={{
        selectedPoint,
        setSelectedPoint,
        setDirections,
        directions,
        directionCoordinates: directions?.routes?.[0]?.geometry?.coordinates,
        routeTime: directions?.routes?.[0]?.duration,
        routeDistance: directions?.routes?.[0]?.distance,
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
