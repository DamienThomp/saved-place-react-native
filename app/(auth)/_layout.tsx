import { Redirect, Stack } from 'expo-router';

import { useAuthentication } from '~/providers/AuthProvider';

export default function AuthLayout() {
  const { session } = useAuthentication();

  if (session) {
    return <Redirect href="/(main)/Index" />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}
