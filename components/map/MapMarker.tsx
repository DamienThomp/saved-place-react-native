import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import { useMemo } from 'react';

import pin from '~/assets/map-pin.png';
import { useIsLightMode } from '~/stores/mapControlsStore';
import { Place } from '~/types/types';
import { MAP_LAYER_STYLES } from '~/utils/mapBoxUtils';

type MapMarkersProps = {
  data: Place[];
};

export default function MapMarkers({ data }: MapMarkersProps) {
  const isLightMode = useIsLightMode();
  const points = useMemo(
    () => data.map((place) => point([place.longitude, place.latitude], { title: place.title })),
    [data]
  );

  const onPress = async () => {
    //TODO: add point selection logic
  };

  return (
    <ShapeSource id="places" cluster shape={featureCollection(points)} onPress={onPress}>
      <SymbolLayer id="clusters-count" style={MAP_LAYER_STYLES.clustersCount} />

      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={MAP_LAYER_STYLES.clusters}
      />

      <SymbolLayer
        id="place-icons"
        filter={['!', ['has', 'point_count']]}
        style={MAP_LAYER_STYLES.placeIcons}
      />

      <SymbolLayer id="callout" style={MAP_LAYER_STYLES.callout(isLightMode)} />

      <Images images={{ pin }} />
    </ShapeSource>
  );
}
