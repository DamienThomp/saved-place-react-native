import { useFocusEffect, useIsFocused } from 'expo-router';
import { useCallback, useState } from 'react';

import { useAllPlaces } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import Map from '~/components/map/Map';
import { useMapActions } from '~/stores/mapControlsStore';

export default function GlobalView() {
  console.log('[GlobalView] render');
  const { setMapZoomLevel } = useMapActions();
  const { data, error, isLoading, refetch } = useAllPlaces();
  const { toggleLightMode } = useMapActions();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      console.log('[GlobalView] useCallback');
      setMapZoomLevel(6);
      toggleLightMode(false);
      refetch();
    }, [setMapZoomLevel, toggleLightMode, refetch])
  );

  return (
    <LoadingState isLoading={isLoading} error={error}>
      {isFocused && <Map readOnly showControls places={data} />}
    </LoadingState>
  );
}
