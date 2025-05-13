import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { usePlacesList } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import Map from '~/components/map/Map';
import { useMapActions } from '~/stores/mapControlsStore';

export default function GlobalView() {
  const { setMapZoomLevel } = useMapActions();
  const { data, error, isLoading, refetch } = usePlacesList();
  const { toggleLightMode } = useMapActions();

  useFocusEffect(
    useCallback(() => {
      setMapZoomLevel(2);
      toggleLightMode(false);
      refetch();
    }, [])
  );

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <Map readOnly showControls places={data} />
    </LoadingState>
  );
}
