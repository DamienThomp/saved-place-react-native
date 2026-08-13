const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
const BASE_URL = 'https://api.mapbox.com/search/geocode/v6/reverse';

export async function getAddress(centerCoordinate: number[]): Promise<string> {
  const [longitude, latitude] = centerCoordinate;

  const params = new URLSearchParams({
    longitude: String(longitude),
    latitude: String(latitude),
    types: 'address',
    limit: '1',
    access_token: ACCESS_TOKEN,
  });

  const url = `${BASE_URL}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch address (${response.status})`);
  }

  const data = await response.json();

  return data?.features?.[0]?.properties?.full_address ?? 'n/a';
}
