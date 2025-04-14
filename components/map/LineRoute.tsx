import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

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
