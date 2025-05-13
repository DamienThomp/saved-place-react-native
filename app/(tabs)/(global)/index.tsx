import { useEffect } from 'react';

import { usePlacesList } from '~/api/places';
import LoadingState from '~/components/common/LoadingState';
import Map from '~/components/map/Map';
import { useMapActions } from '~/stores/mapControlsStore';

export default function GlobalView() {
  const { data, error, isLoading } = usePlacesList();
  const { toggleLightMode } = useMapActions();

  useEffect(() => toggleLightMode(false), []);

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <Map readOnly showControls places={data} zoomLevel={2} />
    </LoadingState>
  );
}
