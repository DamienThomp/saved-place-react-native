import { Stack } from 'expo-router';

import DirectionsProvider from '~/providers/DirectionsProvider';
import LocationProvider from '~/providers/LocationProvider';
import MapSearchProvider from '~/providers/MapSearchProvider';

export default function CommonLayout() {
  return (
    <LocationProvider>
      <DirectionsProvider>
        <MapSearchProvider>
          <Stack screenOptions={{ animation: 'default' }}>
            <Stack.Screen name="form" options={{ headerShown: true, headerLargeTitle: true }} />
            <Stack.Screen
              name="map-modal"
              options={{
                title: 'Select a Location',
                presentation: 'modal',
                headerShown: true,
              }}
            />
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
          </Stack>
        </MapSearchProvider>
      </DirectionsProvider>
    </LocationProvider>
  );
}
