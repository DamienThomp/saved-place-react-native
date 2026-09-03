import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import type { Position } from 'geojson';

import { MAP_LAYER_STYLES } from '~/utils/mapBoxUtils';

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
      <LineLayer id="lineLayer" style={MAP_LAYER_STYLES.route} />
    </ShapeSource>
  );
}
