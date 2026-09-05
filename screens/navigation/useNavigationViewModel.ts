import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useNavigationParams } from '~/hooks/useNavigationParams';

export function useNavigationViewModel() {
  const router = useRouter();
  const { params, error } = useNavigationParams();

  const handleCancel = () => {
    router.back();
  };

  const handleArrived = () => {
    // TODO: Improve arrive at destination handler
    Alert.alert('Arrived');
  };

  return {
    status: { isLoading: false, error },
    state: params,
    actions: {
      handleCancel,
      handleArrived,
    },
  };
}
