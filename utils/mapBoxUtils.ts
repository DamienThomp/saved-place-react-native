import MapboxGL from '@rnmapbox/maps';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || null;

export interface MapSnapShotProps {
  centerCoordinate: number[];
  width?: number;
  height?: number;
  zoomLevel?: number;
  pitch?: number;
  heading?: number;
  styleURL?: MapboxGL.StyleURL;
  writeToDisk?: boolean;
}

const DEFAULT_OPTIONS: MapSnapShotProps = {
  centerCoordinate: [-74.12641, 40.797968],
  width: 375,
  height: 200,
  zoomLevel: 16,
  styleURL: MapboxGL.StyleURL.Street,
  writeToDisk: true,
};

export async function takeSnapshot(args: MapSnapShotProps): Promise<string> {
  const options = { ...DEFAULT_OPTIONS, ...args };
  const result = await MapboxGL.snapshotManager.takeSnap(options);
  return result;
}

export async function getAddress({ centerCoordinate }: MapSnapShotProps) {
  try {
    const [long, lat] = centerCoordinate;

    const response = await axios({
      method: 'get',
      url: `https://api.mapbox.com/search/geocode/v6/reverse`,
      withCredentials: false,
      params: {
        longitude: long,
        latitude: lat,
        types: 'address',
        limit: 1,
        access_token: token,
      },
    });

    if (!response.data) {
      throw new Error('Invalid response fetching address');
    }

    const { data } = response;

    return data?.features[0]?.properties?.full_address ?? 'n/a';
  } catch (error) {
    console.log(error);
  }
}
