import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { tokens } from '~/constants/theme';
import { Place } from '~/types/types';

type PlaceDetailsInfoProps = {
  place: Place;
  onCenterMap: () => void;
  onOpenDirections: () => void;
};

export default function PlaceDetailsInfo({
  place,
  onCenterMap,
  onOpenDirections,
}: PlaceDetailsInfoProps) {
  return (
    <View style={styles.info}>
      <View style={styles.titleRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Center map on place"
          style={styles.titleContainer}
          onPress={onCenterMap}>
          <Text style={styles.title}>{place.title}</Text>
          <Ionicons name="location-sharp" color={tokens.colors.destructive} size={18} />
        </Pressable>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.address}>{place.address}</Text>
        <Button
          accessibilityLabel="Get directions"
          icon="directions"
          size={22}
          color={tokens.colors.white}
          onPress={onOpenDirections}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    padding: tokens.spacing.xl,
    marginTop: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  title: {
    ...tokens.typography.title,
    color: tokens.colors.white,
  },
  address: {
    ...tokens.typography.label,
    color: tokens.colors.white,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
  },
});
