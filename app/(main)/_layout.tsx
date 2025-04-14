import { Redirect, Stack, useRouter } from 'expo-router';

import IconButton from '~/components/ui/IconButton';
import { useAuthentication } from '~/providers/AuthProvider';
import DirectionsProvider from '~/providers/DirectionsProvider';
import MapSearchProvider from '~/providers/MapSearchProvider';

export default function MainLayout() {
  const { session } = useAuthentication();
  const router = useRouter();

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <DirectionsProvider>
      <MapSearchProvider>
        <Stack>
          <Stack.Screen
            name="Index"
            options={{
              title: 'All Places',
              headerLargeTitle: true,
              headerBlurEffect: 'regular',
              headerStyle: { backgroundColor: 'transparent' },
              headerRight: ({ tintColor }) => (
                <>
                  <IconButton
                    icon="person-circle"
                    color={tintColor}
                    size={26}
                    onPress={() => router.push('/profile')}
                  />
                  <IconButton
                    icon="add-circle-outline"
                    color={tintColor}
                    size={26}
                    onPress={() => router.push('/form')}
                    style={{ paddingRight: 0 }}
                  />
                </>
              ),
            }}
          />
          <Stack.Screen name="form" options={{ headerLargeTitle: true }} />
          <Stack.Screen
            name="map-modal"
            options={{
              title: 'Select a Location',
              presentation: 'modal',
            }}
          />
          <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
      </MapSearchProvider>
    </DirectionsProvider>
  );
}
