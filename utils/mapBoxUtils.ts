import MapboxGL from '@rnmapbox/maps';

export const MAPBOX_STANDARD_STYLE = 'mapbox://styles/mapbox/standard';

export const MAP_CAMERA = {
  DEFAULT_ZOOM: 14,
  PLACE_DETAIL_ZOOM: 17,
  GLOBAL_ZOOM: 6,
  PITCH_ANGLE: 60,
  ANIMATION_DURATION_MS: 500,
} as const;

export interface MapSnapShotProps {
  centerCoordinate: number[];
  width?: number;
  height?: number;
  zoomLevel?: number;
  pitch?: number;
  heading?: number;
  styleURL?: string;
  writeToDisk?: boolean;
}

const DEFAULT_OPTIONS: MapSnapShotProps = {
  centerCoordinate: [-74.12641, 40.797968],
  width: 375,
  height: 200,
  zoomLevel: 16,
  styleURL: MAPBOX_STANDARD_STYLE,
  writeToDisk: true,
};

export async function takeSnapshot(args: MapSnapShotProps): Promise<string | undefined> {
  const options = { ...DEFAULT_OPTIONS, ...args };
  const result = await MapboxGL.snapshotManager.takeSnap(options);
  return result;
}
