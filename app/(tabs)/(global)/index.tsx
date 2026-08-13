import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useAllPlaces } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import Map from '~/components/map/Map';
import { useMapActions } from '~/stores/mapControlsStore';

export default function GlobalView() {
  const { setMapZoomLevel } = useMapActions();
  const { data, error, isLoading, refetch } = useAllPlaces();
  const { toggleLightMode } = useMapActions();

  useFocusEffect(
    useCallback(() => {
      setMapZoomLevel(6.5);
      toggleLightMode(false);
      refetch();
    }, [setMapZoomLevel, toggleLightMode, refetch])
  );

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <Map readOnly showControls places={data} />
    </LoadingState>
  );
}
