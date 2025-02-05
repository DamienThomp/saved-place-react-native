import { Redirect, Stack, useRouter } from 'expo-router';

import IconButton from '~/components/ui/IconButton';
import { useAuthentication } from '~/providers/AuthProvider';

export default function MainLayout() {
  const { session } = useAuthentication();
  const router = useRouter();

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="Index"
        options={{
          title: 'All Places',
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="add-circle-outline"
              color={tintColor}
              size={24}
              onPress={() => router.push('/form')}
            />
          ),
        }}
      />
      <Stack.Screen name="form" options={{ title: 'Add A Place', headerLargeTitle: true }} />
      <Stack.Screen
        name="map-modal"
        options={{
          title: 'Select a Location',
          presentation: 'modal',
          headerLeft: ({ tintColor }) => (
            <IconButton
              icon="close-circle-outline"
              color={tintColor}
              size={24}
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
