import { Stack, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import LoadingState from '~/components/common/LoadingState';
import { useNavigationViewModel } from '~/hooks/useNavigationViewModel';
import NavigationModuleView from '~/modules/navigation-module/src/NavigationModuleView';

export default function NavigationScreen() {
  const router = useRouter();
  const { status, state } = useNavigationViewModel();
  const { isLoading, error } = status;

  const handleCancel = () => {
    router.back();
  };

  const handleArrived = () => {
    // TODO: Improve arrive at destination handler
    Alert.alert('Arrived');
  };

  return (
    <>
      <Stack.Screen options={{ title: state?.title ?? 'Navigation', headerShown: true }} />
      <LoadingState isLoading={isLoading} error={error}>
        {state && (
          <NavigationModuleView
            onCancel={handleCancel}
            onArrived={handleArrived}
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
