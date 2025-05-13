import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import { useMemo } from 'react';

import pin from '~/assets/map-pin.png';
import { Place } from '~/types/types';

type MapMarkersProps = {
  data: Place[];
};

export default function MapMarkers({ data }: MapMarkersProps) {
  const points = useMemo(
    () => data.map((place) => point([place.longitude, place.latitude], { place })),
    [data]
  );

  const onPress = async (event: OnPressEvent) => {
    //TODO: add point selection logic
    console.log(event);
  };

  return (
    <ShapeSource id="places" cluster shape={featureCollection(points)} onPress={onPress}>
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: 'red',
          circleRadius: 20,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="place-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 0.05,
          iconAllowOverlap: true,
          iconAnchor: 'center',
          iconKeepUpright: true,
        }}
      />

      <Images images={{ pin }} />
    </ShapeSource>
  );
}
