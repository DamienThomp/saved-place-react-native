import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
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
          <Ionicons name="location-sharp" color="red" size={18} />
        </Pressable>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.address}>{place.address}</Text>
        <Button
          accessibilityLabel="Get directions"
          icon="directions"
          size={22}
          color="white"
          onPress={onOpenDirections}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    padding: 18,
    marginTop: 12,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
  address: {
    fontSize: 18,
    color: 'white',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});
