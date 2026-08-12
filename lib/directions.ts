import { Coordinates, MapboxDirections } from '~/types/types';

export enum DirectionType {
  Driving = 'driving',
  Walking = 'walking',
  Cycling = 'cycling',
  DrivingTraffic = 'driving-traffic',
}

const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox';
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';

const buildDefaultParams = (): URLSearchParams => {
  const query = {
    alternatives: 'true',
    annotations: 'duration,distance,speed,congestion,congestion_numeric,maxspeed,closure',
    continue_straight: 'true',
    geometries: 'geojson',
    overview: 'full',
    steps: 'true',
    access_token: ACCESS_TOKEN,
  };
  const params = new URLSearchParams(query);

  return params;
};

export default async function getDirections(
  start: Coordinates,
  end: Coordinates,
  mode: DirectionType = DirectionType.Driving
): Promise<MapboxDirections | undefined> {
  const queryParams = buildDefaultParams();
  const coordinates = encodeURIComponent(
    `${start.longitude},${start.latitude};${end.longitude},${end.latitude}`
  );
  const url = `${BASE_URL}/${mode}/${coordinates}?${queryParams}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}
