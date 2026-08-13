import MapboxGL from '@rnmapbox/maps';

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

export async function takeSnapshot(args: MapSnapShotProps): Promise<string | undefined> {
  const options = { ...DEFAULT_OPTIONS, ...args };
  const result = await MapboxGL.snapshotManager.takeSnap(options);
  return result;
}
