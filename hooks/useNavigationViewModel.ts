import { useEffect, useState } from 'react';

import { useNavigationParams } from '~/hooks/useNavigationParams';

export function useNavigationViewModel() {
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

  return {
    status: { isLoading, error },
    state: params,
  };
}
