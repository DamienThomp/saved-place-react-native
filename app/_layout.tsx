import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthProvider from '~/providers/AuthProvider';
import QueryProvider from '~/providers/QueryProvider';

const defaultScreenOptions = {
  headerShown: false,
};

export default function Layout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <AuthProvider>
          <QueryProvider>
            <GestureHandlerRootView>
              <Stack>
                <Stack.Screen name="index" options={defaultScreenOptions} />
                <Stack.Screen name="(auth)" options={defaultScreenOptions} />
                <Stack.Screen name="(main)" options={defaultScreenOptions} />
              </Stack>
            </GestureHandlerRootView>
          </QueryProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
