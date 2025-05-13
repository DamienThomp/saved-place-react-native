import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import DirectionsProvider from '~/providers/DirectionsProvider';
import LocationProvider from '~/providers/LocationProvider';
import MapSearchProvider from '~/providers/MapSearchProvider';

export default function RoutLayout() {
  return (
    <LocationProvider>
      <DirectionsProvider>
        <MapSearchProvider>
          <Tabs
            screenOptions={{
              tabBarStyle: { position: 'absolute' },
              tabBarBackground: () => (
                <BlurView
                  intensity={80}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                  }}
                />
              ),
            }}>
            <Tabs.Screen
              name="(main)"
              options={{
                title: 'Main',
                headerShown: false,
                tabBarIcon: ({ color, size }) => <Ionicons color={color} size={size} name="list" />,
              }}
            />
            <Tabs.Screen
              name="(global)"
              options={{
                title: 'Global',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons color={color} size={size} name="globe-outline" />
                ),
              }}
            />
            <Tabs.Screen
              name="(profile)"
              options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons color={color} size={size} name="person" />
                ),
              }}
            />
          </Tabs>
        </MapSearchProvider>
      </DirectionsProvider>
    </LocationProvider>
  );
}
