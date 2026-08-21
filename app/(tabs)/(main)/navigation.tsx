import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import LoadingState from '~/components/common/LoadingState';
import { useNavigationViewModel } from '~/hooks/useNavigationViewModel';

export default function NavigationScreen() {
  const { status, state } = useNavigationViewModel();
  const { isLoading, error } = status;

  return (
    <>
      <Stack.Screen options={{ title: state?.title ?? 'Navigation', headerShown: true }} />
      <LoadingState isLoading={isLoading} error={error}>
        {state && (
          <View style={styles.container}>
            <Text style={styles.label}>Destination</Text>
            <Text style={styles.value}>{state.title}</Text>

            <Text style={styles.label}>Mode</Text>
            <Text style={styles.value}>{state.mode}</Text>

            <Text style={styles.label}>Origin</Text>
            <Text style={styles.value}>
              {state.origin.latitude.toFixed(5)}, {state.origin.longitude.toFixed(5)}
            </Text>

            <Text style={styles.label}>Destination coordinates</Text>
            <Text style={styles.value}>
              {state.destination.latitude.toFixed(5)}, {state.destination.longitude.toFixed(5)}
            </Text>

            <Text style={styles.placeholder}>
              Turn-by-turn navigation will be powered by the Mapbox Navigation SDK.
            </Text>
          </View>
        )}
      </LoadingState>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
  },
  placeholder: {
    fontSize: 14,
    color: '#666',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
