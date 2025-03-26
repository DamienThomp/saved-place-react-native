import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

type LineRouteProps = { coordinates: Position[] };

export default function LineRoute({ coordinates }: LineRouteProps) {
  return (
    <ShapeSource
      id="routeSource"
      lineMetrics
      shape={{
        properties: {},
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
      }}>
      <LineLayer
        id="lineLayer"
        belowLayerID="puck"
        slot="top"
        style={{
          lineColor: '#FF69B4',
          lineCap: 'round',
          lineJoin: 'round',
          lineWidth: 10,
        }}
      />
    </ShapeSource>
  );
}
