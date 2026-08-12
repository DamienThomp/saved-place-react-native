import { Redirect, Stack, useRouter } from 'expo-router';

import IconButton from '~/components/ui/IconButton';
import { useAuthentication } from '~/providers/AuthProvider';
import DirectionsProvider from '~/providers/DirectionsProvider';
import LocationProvider from '~/providers/LocationProvider';
import MapSearchProvider from '~/providers/MapSearchProvider';

export default function MainLayout() {
  const { session } = useAuthentication();
  const router = useRouter();

  const redirectToForm = () => {
    router.push('/form');
  };

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <LocationProvider>
      <DirectionsProvider>
        <MapSearchProvider>
          <Stack screenOptions={{ animation: 'default' }}>
            <Stack.Screen
              name="index"
              options={{
                title: 'All Places',
                headerLargeTitle: true,
                headerTitleAlign: 'center',
                headerBlurEffect: 'regular',
                headerStyle: { backgroundColor: 'transparent' },
                headerRight: ({ tintColor }) => (
                  <IconButton
                    icon="add-circle-outline"
                    color={tintColor}
                    size={26}
                    accessibilityLabel="Add new place"
                    onPress={redirectToForm}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="form"
              options={{
                headerShown: true,
                headerLargeTitle: true,
                presentation: 'formSheet',
              }}
            />
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
