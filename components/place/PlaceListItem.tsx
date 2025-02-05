import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import RemoteImage from '../common/RemoteImage';

import { Tables } from '~/types/database.types';

type Place = Tables<'places'>;
interface PlaceItemProps {
  item: Place;
  onSelect: (id: number) => void;
}

export default function PlaceListItem({ item, onSelect }: PlaceItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onSelect(item.id)}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.pressed,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}>
      <RemoteImage fallback="" style={styles.image} path={item.image} />
      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={[styles.address, { color: theme.colors.text }]}>
          {item.address}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 12,
    padding: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    flex: 1,
    borderRadius: 8,
    height: 80,
    resizeMode: 'contain',
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  address: {
    fontSize: 12,
  },
});
