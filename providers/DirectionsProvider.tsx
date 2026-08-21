import { getCurrentPositionAsync } from 'expo-location';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

import { DirectionType, getDirections } from '~/api/directions';
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
  mode?: DirectionType;
  error?: string | undefined;
  isFetching?: boolean;
  setMode?: Dispatch<SetStateAction<DirectionType>>;
  setError?: Dispatch<SetStateAction<string | undefined>>;
  requestDirections?: (point: SelectedPoint) => Promise<void>;
  clearDirections?: () => void;
};

const DirectionsContext = createContext<DirectionsContextState>({});

const isError = (response: MapboxDirections | undefined): boolean => {
  if (!response) return true;
  return response.code === 'InvalidInput';
};

export default function DirectionsProvider({ children }: PropsWithChildren) {
  const [directions, setDirections] = useState<MapboxDirections | null>();
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>();
  const [mode, setMode] = useState<DirectionType>(DirectionType.Driving);
  const [error, setError] = useState<string>();
  const [isFetching, setIsFetching] = useState(false);

  const clearDirections = useCallback(() => {
    setDirections(null);
    setSelectedPoint(undefined);
    setError(undefined);
    setMode(DirectionType.Driving);
    setIsFetching(false);
  }, []);

  const requestDirections = useCallback(
    async (point: SelectedPoint) => {
      setError(undefined);
      setIsFetching(true);

      try {
        const { coords } = await getCurrentPositionAsync();
        const start: Coordinates = { longitude: coords.longitude, latitude: coords.latitude };
        const end: Coordinates = { longitude: point.longitude, latitude: point.latitude };
        const response = await getDirections(start, end, mode);

        if (isError(response)) {
          throw new Error(response?.message ?? 'Could not fetch directions.');
        }

        setDirections(response);
        setSelectedPoint(point);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not fetch directions.';
        setError(message);
        throw err;
      } finally {
        setIsFetching(false);
      }
    },
    [mode]
  );

  return (
    <DirectionsContext.Provider
      value={{
        selectedPoint,
        mode,
        setMode,
        setError,
        requestDirections,
        clearDirections,
        directions,
        directionCoordinates: directions?.routes?.[0]?.geometry?.coordinates,
        routeTime: directions?.routes?.[0]?.duration,
        routeDistance: directions?.routes?.[0]?.distance,
        error,
        isFetching,
      }}>
      {children}
    </DirectionsContext.Provider>
  );
}

export const useDirections = () => useContext(DirectionsContext);
