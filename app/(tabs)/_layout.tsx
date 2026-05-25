import { NativeTabs } from 'expo-router/unstable-native-tabs';
import DirectionsProvider from '~/providers/DirectionsProvider';
import LocationProvider from '~/providers/LocationProvider';
import MapSearchProvider from '~/providers/MapSearchProvider';

export default function RoutLayout() {
  return (
    <LocationProvider>
      <DirectionsProvider>
        <MapSearchProvider>
          <NativeTabs>
            <NativeTabs.Trigger name="(main)">
              <NativeTabs.Trigger.Label>Main</NativeTabs.Trigger.Label>
              <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(global)">
              <NativeTabs.Trigger.Label>Global</NativeTabs.Trigger.Label>
              <NativeTabs.Trigger.Icon sf="globe" md="globe" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(profile)">
              <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
              <NativeTabs.Trigger.Icon sf="person" md="person" />
            </NativeTabs.Trigger>
          </NativeTabs>
        </MapSearchProvider>
      </DirectionsProvider>
    </LocationProvider>
  );
}
