import Mapbox, { Camera, LocationPuck, MapView, StyleURL, Style } from '@rnmapbox/maps';
import { StyleSheet, useColorScheme } from 'react-native';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

enum MapTheme {
  Light = StyleURL.Light,
  Dark = StyleURL.Dark,
  Streets = StyleURL.Street,
}

export default function Map() {
  const colorScheme = useColorScheme();
  const mapTheme = colorScheme === 'dark' ? MapTheme.Dark : MapTheme.Light;

  return (
    <MapView style={styles.map} styleURL={StyleURL.Street}>
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
