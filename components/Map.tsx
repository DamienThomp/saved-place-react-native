import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { StyleSheet, useColorScheme } from 'react-native';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

enum MapTheme {
  Light = 'mapbox://styles/mapbox/light-v11',
  Dark = 'mapbox://styles/mapbox/dark-v11',
}

export default function Map() {
  const colorScheme = useColorScheme();
  const mapTheme = colorScheme === 'dark' ? MapTheme.Dark : MapTheme.Light;

  return (
    <MapView style={styles.map} styleURL={mapTheme}>
      <Camera followUserLocation />
      <LocationPuck pulsing={{ isEnabled: true }} puckBearing="course" puckBearingEnabled />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
