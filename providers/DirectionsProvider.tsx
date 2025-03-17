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

type DirectionsContextState = {
  selectedPoint?: SelectedPoint;
  directions?: MapboxDirections | null;
  directionCoordinates?: [number, number][] | undefined;
  routeTime?: number | undefined;
  routeDistance?: number | undefined;
  setSelectedPoint?: Dispatch<SetStateAction<SelectedPoint | undefined>>;
  setDirections?: Dispatch<SetStateAction<MapboxDirections | null | undefined>>;
};

const DirectionsContext = createContext<DirectionsContextState>({});

export default function DirectionsProvider({ children }: PropsWithChildren) {
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
    <DirectionsContext.Provider
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
    </DirectionsContext.Provider>
  );
}

export const useDirections = () => useContext(DirectionsContext);
