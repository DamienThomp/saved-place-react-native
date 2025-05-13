import { useFocusEffect } from 'expo-router';
import { useState } from 'react';

import { usePlacesList } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import Map from '~/components/map/Map';
import { useMapActions } from '~/stores/mapControlsStore';

export default function GlobalView() {
  const [zoomLevel, setZoomLevel] = useState(2);
  const { data, error, isLoading, refetch } = usePlacesList();
  const { toggleLightMode } = useMapActions();

  useFocusEffect(() => {
    toggleLightMode(false);
    setZoomLevel(2);
    refetch();
  });

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <Map readOnly showControls places={data} zoomLevel={zoomLevel} />
    </LoadingState>
  );
}
