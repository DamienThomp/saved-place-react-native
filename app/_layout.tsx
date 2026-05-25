import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import Mapbox from '@rnmapbox/maps';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthProvider from '~/providers/AuthProvider';
import QueryProvider from '~/providers/QueryProvider';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

export default function Layout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <AuthProvider>
          <QueryProvider>
            <GestureHandlerRootView>
              <Stack screenOptions={{ headerShown: false }} />
            </GestureHandlerRootView>
          </QueryProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
