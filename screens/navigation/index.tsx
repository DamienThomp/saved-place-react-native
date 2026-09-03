import { Stack } from 'expo-router';

import LoadingState from '~/components/common/LoadingState';
import NavigationModuleView from '~/modules/navigation-module/src/NavigationModuleView';

import { useNavigationViewModel } from './useNavigationViewModel';

export default function NavigationScreen() {
  const { status, state, actions } = useNavigationViewModel();
  const { isLoading, error } = status;

  return (
    <>
      <Stack.Screen options={{ title: state?.title ?? 'Navigation', headerShown: true }} />
      <LoadingState isLoading={isLoading} error={error}>
        {state && (
          <NavigationModuleView
            onCancel={actions.handleCancel}
            onArrived={actions.handleArrived}
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
