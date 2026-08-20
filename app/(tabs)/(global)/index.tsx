import { useFocusEffect, useIsFocused } from 'expo-router';
import { useCallback } from 'react';

import { useAllPlaces } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import Map from '~/components/map/Map';
import { useMapActions } from '~/stores/mapControlsStore';
import { MAP_CAMERA } from '~/utils/mapBoxUtils';

export default function GlobalView() {
  const { setZoom, setLightMode } = useMapActions();
  const { data, error, isLoading, refetch } = useAllPlaces();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setZoom(MAP_CAMERA.GLOBAL_ZOOM);
      setLightMode(false);
      refetch();
    }, [setZoom, setLightMode, refetch])
  );

  return (
    <LoadingState isLoading={isLoading} error={error}>
      {isFocused && <Map readOnly showControls places={data} />}
    </LoadingState>
  );
}
