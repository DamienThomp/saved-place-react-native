import { StyleSheet, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { formatRouteDistance, formatRouteDuration } from '~/utils/formatRoute';

type PlaceDetailsNavigateSectionProps = {
  routeTime?: number;
  routeDistance?: number;
  onNavigate: () => void;
};

export default function PlaceDetailsNavigateSection({
  routeTime,
  routeDistance,
  onNavigate,
}: PlaceDetailsNavigateSectionProps) {
  return (
    <View style={styles.navigateSection}>
      <Text style={styles.routeSummary}>
        {formatRouteDuration(routeTime)} · {formatRouteDistance(routeDistance)}
      </Text>
      <Button
        title="Navigate to place"
        icon="directions"
        color="white"
        onPress={onNavigate}
        style={styles.navigateButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navigateSection: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  routeSummary: {
    fontSize: 16,
    color: 'white',
  },
  navigateButton: {
    alignSelf: 'stretch',
  },
});
