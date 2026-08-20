import Mapbox, { Camera, LocationPuck, MapView, MarkerView, StyleImport } from '@rnmapbox/maps';
import type { Position } from 'geojson';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AnnotationContent from './AnnotationContent';
import LineRoute from './LineRoute';
import MapMarkers from './MapMarker';
import MapPitchToggleButton from './MapPitchToggleButton';
import MapThemeToggleButton from './MapThemeToggleButton';
import MapUserLocationButton from './MapUserLocationButton';

import { useDirections } from '~/providers/DirectionsProvider';
import { useLocation } from '~/providers/LocationProvider';
import {
  useCameraCommand,
  useIsLightMode,
  useMapActions,
  useMapPitch,
} from '~/stores/mapControlsStore';
import { Place } from '~/types/types';
import { MAPBOX_STANDARD_STYLE, MAP_CAMERA } from '~/utils/mapBoxUtils';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

type Coordinates = {
  longitude: number;
  latitude: number;
};

export type SelectedPoint = {
  coordinate: number[];
  properties?: Properties | null;
};

type Properties = {
  screenPointX: number;
  screenPointY: number;
};

type MapProps = {
  coordinates?: Coordinates | null;
  places?: Place[] | null;
  readOnly?: boolean;
  showControls?: boolean;
  onPress?: (selected: SelectedPoint | null) => void;
};

export default function Map({ coordinates, readOnly, showControls, places, onPress }: MapProps) {
  const cameraRef = useRef<Camera>(null);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const isLightMode = useIsLightMode();
  const mapPitch = useMapPitch();
  const cameraCommand = useCameraCommand();
  const insets = useSafeAreaInsets();
  const { userLocation } = useLocation();
  const { directionCoordinates } = useDirections();
  const { flyTo, setPitchToggled } = useMapActions();

  const initialCenter = useMemo<Position | null>(() => {
    if (coordinates) {
      return [coordinates.longitude, coordinates.latitude];
    }
    if (userLocation) {
      return [userLocation.longitude, userLocation.latitude];
    }
    return null;
  }, [coordinates, userLocation]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setIsLayoutReady(true);
    }
  }, []);

  const onMapSelection = (feature: GeoJSON.Feature) => {
    if (readOnly) return;
    const properties = feature.properties as GeoJSON.GeoJsonProperties;
    const { coordinates: pointCoordinates } = feature.geometry as GeoJSON.Point;
    const point = {
      coordinate: pointCoordinates,
      properties: properties as Properties,
    };

    setSelectedPoint(point);
    onPress?.(point);
  };

  const standardStyleConfig = useMemo(
    () => ({
      lightPreset: isLightMode ? ('day' as const) : ('night' as const),
    }),
    [isLightMode]
  );

  useEffect(() => {
    if (!cameraCommand?.sequence) return;

    cameraRef.current?.setCamera({
      animationDuration: MAP_CAMERA.ANIMATION_DURATION_MS,
      ...(cameraCommand.center ? { centerCoordinate: cameraCommand.center } : {}),
      ...(cameraCommand.zoom != null ? { zoomLevel: cameraCommand.zoom } : {}),
    });
  }, [cameraCommand?.sequence]);

  useEffect(() => {
    if (coordinates) {
      flyTo([coordinates.longitude, coordinates.latitude], MAP_CAMERA.PLACE_DETAIL_ZOOM);
      setSelectedPoint({
        coordinate: [coordinates.longitude, coordinates.latitude],
      });
      return;
    }

    if (userLocation) {
      flyTo([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation, coordinates, flyTo]);

  useEffect(() => {
    if (directionCoordinates) {
      setPitchToggled(true);
    }
  }, [directionCoordinates, setPitchToggled]);

  return (
    <View style={styles.mapContainer} onLayout={onLayout}>
      {!initialCenter ? (
        <ActivityIndicator style={styles.map} />
      ) : isLayoutReady ? (
        <MapView
          style={styles.map}
          styleURL={MAPBOX_STANDARD_STYLE}
          scaleBarEnabled={false}
          onPress={onMapSelection}>
          <StyleImport id="basemap" existing={true} config={standardStyleConfig} />
          <Camera
            ref={cameraRef}
            defaultSettings={{
              centerCoordinate: initialCenter,
              zoomLevel: coordinates ? MAP_CAMERA.PLACE_DETAIL_ZOOM : MAP_CAMERA.DEFAULT_ZOOM,
              pitch: mapPitch,
              animationDuration: 0,
            }}
            pitch={mapPitch}
          />

          {selectedPoint && (
            <MarkerView coordinate={selectedPoint.coordinate} anchor={{ x: 0.5, y: 1 }}>
              <AnnotationContent />
            </MarkerView>
          )}

          {places && <MapMarkers data={places} />}

          <LocationPuck pulsing={{ isEnabled: true }} puckBearing="course" puckBearingEnabled />

          {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
        </MapView>
      ) : (
        <ActivityIndicator style={styles.map} />
      )}
      {showControls && (
        <View style={[styles.controlsContainer, { top: insets.top }]}>
          <MapUserLocationButton />
          <MapPitchToggleButton />
          <MapThemeToggleButton />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 4,
    padding: 8,
    right: 0,
  },
});
