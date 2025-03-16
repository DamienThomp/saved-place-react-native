import { Coordinates, MapboxDirections } from '~/types/types';

// TODO: - Add enum for selecting direction type and remove hardcoded walking value
const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/walking/';
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';

const buildDefaultParams = (): URLSearchParams => {
  const query = {
    alternatives: 'false',
    annotations: 'duration,distance',
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
  end: Coordinates
): Promise<MapboxDirections | undefined> {
  const queryParams = buildDefaultParams();
  const coordinates = encodeURIComponent(
    `${start.longitude},${start.latitude};${end.longitude},${end.latitude}`
  );
  const url = `${BASE_URL}${coordinates}?${queryParams}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}
