import Mapbox, { Camera, LocationPuck, MapView, MarkerView } from '@rnmapbox/maps';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  useMapActions,
  useMapCenter,
  useMapPitch,
  useMapTheme,
  useMapZoomLevel,
} from '~/stores/mapControlsStore';
import { Place } from '~/types/types';
import debounce from '~/utils/debounce';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

const DEFAULTS = {
  animationDuration: 500,
};

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

// TODO: Convert to zustand store
type MapProps = {
  coordinates?: Coordinates | null;
  places?: Place[] | null;
  readOnly?: boolean;
  showControls?: boolean;
  onPress?: (selected: SelectedPoint | null) => void;
};

export default function Map({ coordinates, readOnly, showControls, places, onPress }: MapProps) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const mapCenter = useMapCenter();
  const mapPitch = useMapPitch();
  const mapTheme = useMapTheme();
  const zoomLevel = useMapZoomLevel();
  const insets = useSafeAreaInsets();
  const { userLocation } = useLocation();
  const { directionCoordinates } = useDirections();
  const { setMapZoomLevel, setMapCenter, toggleMapPitch, resetAll } = useMapActions();

  const onMapSelection = (feature: GeoJSON.Feature) => {
    if (readOnly) return;
    const properties = feature.properties as GeoJSON.GeoJsonProperties;
    const { coordinates } = feature.geometry as GeoJSON.Point;
    const point = {
      coordinate: coordinates,
      properties: properties as Properties,
    };

    setSelectedPoint(point);
    onPress?.(point);
  };

  const onCameraChange = useCallback(
    debounce((event: Mapbox.MapState) => {
      setMapCenter(event.properties.center);
      setMapZoomLevel(event.properties.zoom);
    }, 1000),
    []
  );

  useEffect(() => {
    if (coordinates) {
      setMapCenter([coordinates.longitude, coordinates.latitude]);
      setSelectedPoint({
        coordinate: [coordinates.longitude, coordinates.latitude],
      });
      return;
    }

    if (userLocation) {
      setMapCenter([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation, coordinates]);

  useEffect(() => {
    if (directionCoordinates) {
      toggleMapPitch(true);
    }
  }, [directionCoordinates]);

  useEffect(() => {
    return () => {
      resetAll();
    };
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        styleURL={mapTheme}
        scaleBarEnabled={false}
        onCameraChanged={onCameraChange}
        onPress={onMapSelection}>
        <Camera
          centerCoordinate={mapCenter}
          animationDuration={DEFAULTS.animationDuration}
          zoomLevel={zoomLevel}
          pitch={mapPitch}
          defaultSettings={{
            animationDuration: 0,
          }}
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
