import { Redirect, Stack, useRouter } from 'expo-router';

import IconButton from '~/components/ui/IconButton';
import { useAuthentication } from '~/providers/AuthProvider';
import DirectionsProvider from '~/providers/DirectionsProvider';
import LocationProvider from '~/providers/LocationProvider';
import MapSearchProvider from '~/providers/MapSearchProvider';

export default function MainLayout() {
  const { session } = useAuthentication();
  const router = useRouter();

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <LocationProvider>
      <DirectionsProvider>
        <MapSearchProvider>
          <Stack>
            <Stack.Screen
              name="Index"
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
                    onPress={() => router.push('/form')}
                    style={{ paddingRight: 0 }}
                  />
                ),
              }}
            />
          </Stack>
        </MapSearchProvider>
      </DirectionsProvider>
    </LocationProvider>
  );
}
