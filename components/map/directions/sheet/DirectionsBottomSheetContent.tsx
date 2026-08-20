import { StyleSheet, Text, View } from 'react-native';

import DirectionButton from '~/components/map/DirectionButton';
import { Button } from '~/components/ui/Button';
import { Coordinates } from '~/types/types';
import { formatRouteDistance, formatRouteDuration } from '~/utils/formatRoute';

type DirectionsBottomSheetContentProps = {
  coordinates: Coordinates;
  directionCoordinates?: [number, number][];
  routeTime?: number;
  routeDistance?: number;
  onNavigate: () => void;
};

export default function DirectionsBottomSheetContent({
  coordinates,
  directionCoordinates,
  routeTime,
  routeDistance,
  onNavigate,
}: DirectionsBottomSheetContentProps) {
  return (
    <View style={styles.container}>
      <DirectionButton coordinates={coordinates} color="white" style={styles.fullWidthButton} />

      {directionCoordinates && (
        <View style={styles.routeSummary}>
          <Text style={styles.summaryText}>
            {formatRouteDuration(routeTime)} · {formatRouteDistance(routeDistance)}
          </Text>
          <Button
            title="Navigate to place"
            icon="directions"
            color="white"
            onPress={onNavigate}
            style={styles.fullWidthButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    gap: 12,
  },
  fullWidthButton: {
    alignSelf: 'stretch',
  },
  routeSummary: {
    gap: 12,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
