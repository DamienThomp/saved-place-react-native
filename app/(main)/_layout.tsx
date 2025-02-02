import { Redirect, Stack } from 'expo-router';

import { useAuthentication } from '~/providers/AuthProvider';

export default function MainLayout() {
  const { session } = useAuthentication();

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Stack />;
}
