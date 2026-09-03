import { StyleSheet, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { tokens } from '~/constants/theme';
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
        color={tokens.colors.white}
        onPress={onNavigate}
        style={styles.navigateButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navigateSection: {
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  routeSummary: {
    ...tokens.typography.button,
    color: tokens.colors.white,
  },
  navigateButton: {
    alignSelf: 'stretch',
  },
});
