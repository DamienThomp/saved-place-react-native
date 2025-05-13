import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import { useMemo } from 'react';

import pin from '~/assets/map-pin.png';
import { useIsLightMode } from '~/stores/mapControlsStore';
import { Place } from '~/types/types';

type MapMarkersProps = {
  data: Place[];
};

export default function MapMarkers({ data }: MapMarkersProps) {
  const isLightMode = useIsLightMode();
  const points = useMemo(
    () => data.map((place) => point([place.longitude, place.latitude], { title: place.title })),
    [data]
  );

  const onPress = async (event: OnPressEvent) => {
    //TODO: add point selection logic
    console.log(JSON.stringify(event.features, null, '\t'));
  };

  return (
    <ShapeSource id="places" cluster shape={featureCollection(points)} onPress={onPress}>
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'viewport',
        }}
      />

      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'viewport',
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

      <SymbolLayer
        id="callout"
        style={{
          iconTextFit: 'both',
          iconTextFitPadding: [5, 5, 5, 5],
          textSize: 16,
          iconAllowOverlap: true,
          textAllowOverlap: true,
          textColor: isLightMode ? 'black' : 'white',
          textFont: ['Open Sans SemiBold'],
          textOffset: [0, 1.8],
          textField: '{title}',
        }}
      />

      <Images images={{ pin }} />
    </ShapeSource>
  );
}
