import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

import Place from '~/model/Place';

interface PlaceItemProps {
  item: Place;
  onSelect: (id: string) => void;
}

export default function PlaceListItem({ item, onSelect }: PlaceItemProps) {
  return (
    <Pressable
      onPress={() => onSelect(item.id)}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <Image style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.address}>{item.address}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 6,
    marginVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    height: 100,
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'grey',
  },
  address: {
    fontSize: 12,
    color: 'grey',
  },
});
