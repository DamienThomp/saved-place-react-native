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
  error?: string | undefined;
  setSelectedPoint?: Dispatch<SetStateAction<SelectedPoint | undefined>>;
  setDirections?: Dispatch<SetStateAction<MapboxDirections | null | undefined>>;
  setError?: Dispatch<SetStateAction<string | undefined>>;
};

const DirectionsContext = createContext<DirectionsContextState>({});

const isError = (response: MapboxDirections | undefined): boolean => {
  if (!response) return true;
  return response.code === 'InvalidInput';
};

export default function DirectionsProvider({ children }: PropsWithChildren) {
  const [directions, setDirections] = useState<MapboxDirections | null>();
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchDirections = async ({ longitude, latitude }: SelectedPoint) => {
      const { coords } = await getCurrentPositionAsync();
      const start: Coordinates = { longitude: coords.longitude, latitude: coords.latitude };
      const end: Coordinates = { longitude, latitude };

      const response = await getDirections(start, end);

      if (isError(response)) {
        setError(response?.message);
        return;
      }

      setDirections(response);
    };

    if (selectedPoint) {
      setError(undefined);
      fetchDirections({ ...selectedPoint });
    }
  }, [selectedPoint]);

  return (
    <DirectionsContext.Provider
      value={{
        selectedPoint,
        setSelectedPoint,
        setDirections,
        setError,
        directions,
        directionCoordinates: directions?.routes?.[0]?.geometry?.coordinates,
        routeTime: directions?.routes?.[0]?.duration,
        routeDistance: directions?.routes?.[0]?.distance,
        error,
      }}>
      {children}
    </DirectionsContext.Provider>
  );
}

export const useDirections = () => useContext(DirectionsContext);
