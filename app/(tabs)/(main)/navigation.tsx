import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import LoadingState from '~/components/common/LoadingState';
import { useNavigationViewModel } from '~/hooks/useNavigationViewModel';
import NavigationModuleView from '~/modules/navigation-module/src/NavigationModuleView';

export default function NavigationScreen() {
  const { status, state } = useNavigationViewModel();
  const { isLoading, error } = status;

  return (
    <>
      <Stack.Screen options={{ title: state?.title ?? 'Navigation', headerShown: true }} />
      <LoadingState isLoading={isLoading} error={error}>
        {state && (
          <NavigationModuleView
            style={{ flex: 1 }}
            mode={state.mode}
            origin={state.origin}
            destination={state.destination}
          />
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
