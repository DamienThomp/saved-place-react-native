import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import RemoteImage from '../common/RemoteImage';

import { Place } from '~/types/types';
interface PlaceItemProps {
  item: Place;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PlaceListItem({ item, onSelect, onDelete }: PlaceItemProps) {
  const theme = useTheme();

  const handleDelete = (swipeable?: SwipeableMethods) => {
    Alert.alert('Delete', 'Are you sure you want to delete this Place?', [
      { text: 'Cancel', onPress: () => swipeable?.close(), style: 'cancel' },
      {
        text: 'Continue',
        onPress: () => {
          onDelete(item.id);
        },
      },
    ]);
  };

  const RightAction = (
    _: SharedValue<number>,
    drag: SharedValue<number>,
    swipeable: SwipeableMethods
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 112 }],
      };
    });
    return (
      <Animated.View style={[{ padding: 8 }, styleAnimation]}>
        <Pressable onPress={() => handleDelete(swipeable)} style={styles.iconContainer}>
          <Ionicons name="trash-bin" size={40} color="white" />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable friction={2} rightThreshold={40} renderRightActions={RightAction}>
      <Pressable
        onPress={() => onSelect(item.id)}
        style={({ pressed }) => [
          styles.item,
          pressed && styles.pressed,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}>
        <RemoteImage style={styles.image} path={item.image} aspectRatio={3 / 2} />
        <View style={styles.info}>
          <Text numberOfLines={1} style={[styles.title, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={[styles.address, { color: theme.colors.text }]}>
            {item.address}
          </Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 6,
    padding: 18,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    flex: 1,
    borderRadius: 6,
    marginRight: 12,
    aspectRatio: 3 / 2,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  info: {
    flex: 2,
    padding: 12,
    gap: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  address: {
    fontSize: 12,
    opacity: 0.7,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    backgroundColor: 'red',
    borderRadius: 8,
  },
});
