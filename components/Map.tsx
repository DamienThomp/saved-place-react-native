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
type MapProps = {
  coordinates?: Coordinates;
  onPress?: () => void;
};

export default function Map({ coordinates, onPress }: MapProps) {
  const [mapCenter, setMapCenter] = useState<Position | undefined>();
  const [selectedPoint, setSelectedPoint] = useState<Position | undefined>();
  const userLocation = useUserLocation();

  useEffect(() => {
    if (coordinates) {
      setMapCenter([coordinates.longitude, coordinates.latitude]);
      setSelectedPoint([coordinates.longitude, coordinates.latitude]);
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
      onPress={onPress}>
      <Camera
        centerCoordinate={mapCenter}
        animationDuration={500}
        defaultSettings={{
          zoomLevel: 16,
        }}
      />

      {selectedPoint && (
        <MarkerView coordinate={selectedPoint} anchor={{ x: 0.5, y: 1 }}>
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
