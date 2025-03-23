import { useTheme } from '@react-navigation/native';
import Mapbox, { Camera, LocationPuck, MapView, MarkerView, StyleURL } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AnnotationContent from './AnnotationContent';
import LineRoute from './LineRoute';
import IconButton from '../ui/IconButton';

import useUserLocation from '~/hooks/useUserLocation';
import { useDirections } from '~/providers/DirectionsProvider';
import debounce from '~/utils/debounce';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

const DEFAULTS = {
  zoomLevel: 14,
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

type MapProps = {
  coordinates?: Coordinates | null;
  readOnly?: boolean;
  showControls?: boolean;
  onPress?: (selected: SelectedPoint | null) => void;
};

export default function Map({ coordinates, readOnly, showControls, onPress }: MapProps) {
  const [mapCenter, setMapCenter] = useState<Position | undefined>();
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const userLocation = useUserLocation();
  const { directionCoordinates } = useDirections();
  const theme = useTheme();

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

  const onToggleToUserLocation = useCallback(() => {
    if (userLocation) {
      setMapCenter([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation]);

  const onCameraChange = useCallback(
    debounce((event: Mapbox.MapState) => setMapCenter(event.properties.center), 1000),
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

  return (
    <MapView
      style={styles.map}
      styleURL={StyleURL.Street}
      logoEnabled={false}
      scaleBarEnabled={false}
      onCameraChanged={onCameraChange}
      onPress={onMapSelection}>
      <Camera
        centerCoordinate={mapCenter}
        animationDuration={readOnly ? 0 : DEFAULTS.animationDuration}
        defaultSettings={{
          zoomLevel: DEFAULTS.zoomLevel,
        }}
      />

      {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}

      {selectedPoint && (
        <MarkerView coordinate={selectedPoint.coordinate} anchor={{ x: 0.5, y: 1 }}>
          <AnnotationContent title="marker" />
        </MarkerView>
      )}

      <LocationPuck pulsing={{ isEnabled: true }} puckBearing="course" puckBearingEnabled />

      {showControls && (
        <View style={styles.controlsContainer}>
          <IconButton
            icon="navigate-circle-sharp"
            color={theme.colors.primary}
            size={36}
            onPress={onToggleToUserLocation}
          />
        </View>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
  },
  controlsContainer: {
    alignItems: 'flex-end',
    top: 0,
    paddingTop: 8,
  },
});
