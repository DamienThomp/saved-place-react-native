import { useFocusEffect, useIsFocused } from 'expo-router';
import { useCallback } from 'react';

import { useAllPlaces } from '~/api/places';
import { useMapActions } from '~/stores/mapControlsStore';
import { MAP_CAMERA } from '~/utils/mapBoxUtils';

export function useGlobalViewModel() {
  const { setZoom } = useMapActions();
  const { data, error, isLoading, refetch } = useAllPlaces();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setZoom(MAP_CAMERA.GLOBAL_ZOOM);
      refetch();
    }, [setZoom, refetch])
  );

  return {
    status: { isLoading, error },
    state: { data, isFocused },
  };
}
