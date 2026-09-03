import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useNavigationParams } from '~/hooks/useNavigationParams';

export function useNavigationViewModel() {
  const router = useRouter();
  const { params, error } = useNavigationParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error || !params) return;

    let cancelled = false;

    async function prepareNavigation() {
      setIsLoading(true);

      // Placeholder for future Mapbox Navigation SDK initialization.
      if (!cancelled) setIsLoading(false);
    }

    prepareNavigation();

    return () => {
      cancelled = true;
    };
  }, [params, error]);

  const handleCancel = () => {
    router.back();
  };

  const handleArrived = () => {
    // TODO: Improve arrive at destination handler
    Alert.alert('Arrived');
  };

  return {
    status: { isLoading, error },
    state: params,
    actions: {
      handleCancel,
      handleArrived,
    },
  };
}
