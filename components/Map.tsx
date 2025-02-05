import Mapbox, { Camera, LocationPuck, MapView, MarkerView, StyleURL } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IconButton from './ui/IconButton';

import useUserLocation from '~/hooks/useUserLocation';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

const AnnotationContent = ({ title }: { title: string }) => (
  <View style={styles.touchableContainer}>
    <IconButton icon="pin" size={36} color="white" onPress={() => {}} />
  </View>
);

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
  coordinates?: Coordinates;
  readOnly?: boolean;
  onPress?: (selected: SelectedPoint | null) => void;
};

export default function Map({ coordinates, readOnly, onPress }: MapProps) {
  const [mapCenter, setMapCenter] = useState<Position | undefined>();
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const userLocation = useUserLocation();

  const onMapSelection = (feature: GeoJSON.Feature) => {
    if (readOnly) return;
    const properties = feature.properties as GeoJSON.GeoJsonProperties;
    const { coordinates } = feature.geometry as GeoJSON.Point;
    const point = {
      coordinate: coordinates,
      properties: properties as Properties,
    };
    console.log(`selectedPoint: ${JSON.stringify(point, null, '\t')}`);
    setSelectedPoint(point);
    onPress?.(point);
  };

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
  }, [userLocation]);

  return (
    <MapView
      style={styles.map}
      styleURL={StyleURL.Street}
      logoEnabled={false}
      scaleBarEnabled={false}
      onPress={onMapSelection}>
      <Camera
        centerCoordinate={mapCenter}
        animationDuration={500}
        defaultSettings={{
          zoomLevel: 16,
        }}
      />

      {selectedPoint && (
        <MarkerView coordinate={selectedPoint.coordinate} anchor={{ x: 0.5, y: 1 }}>
          <AnnotationContent title="marker" />
        </MarkerView>
      )}

      <LocationPuck pulsing={{ isEnabled: true }} puckBearing="course" puckBearingEnabled />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  touchableContainer: {
    backgroundColor: 'red',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
