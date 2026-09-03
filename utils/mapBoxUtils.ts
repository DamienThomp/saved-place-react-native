import MapboxGL from '@rnmapbox/maps';

import { tokens } from '~/constants/theme';

export const MAPBOX_STANDARD_STYLE = 'mapbox://styles/mapbox/standard';

export const MAP_LAYER_STYLES = {
  route: {
    lineColor: tokens.colors.route,
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 10,
  },
  clustersCount: {
    textField: ['get', 'point_count'],
    textSize: 18,
    textColor: tokens.colors.white,
    textPitchAlignment: 'viewport' as const,
  },
  clusters: {
    circlePitchAlignment: 'viewport' as const,
    circleColor: tokens.colors.destructive,
    circleRadius: 20,
    circleOpacity: 1,
    circleStrokeWidth: 2,
    circleStrokeColor: tokens.colors.white,
  },
  placeIcons: {
    iconImage: 'pin',
    iconSize: 0.05,
    iconAllowOverlap: true,
    iconAnchor: 'center' as const,
    iconKeepUpright: true,
  },
  callout: (isLightMode: boolean) => ({
    iconTextFit: 'both' as const,
    iconTextFitPadding: [5, 5, 5, 5],
    textSize: 16,
    iconAllowOverlap: true,
    textAllowOverlap: true,
    textColor: isLightMode ? tokens.colors.black : tokens.colors.white,
    textFont: ['Open Sans SemiBold'],
    textOffset: [0, 1.8],
    textField: '{title}',
  }),
} as const;

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
