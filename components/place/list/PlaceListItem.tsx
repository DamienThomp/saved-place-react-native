import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'expo-router/react-navigation';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import RemoteImage from '../../common/RemoteImage';

import { tokens } from '~/constants/theme';
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
      <Animated.View style={[{ padding: tokens.spacing.sm }, styleAnimation]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="delete place"
          onPress={() => handleDelete(swipeable)}
          style={styles.iconContainer}>
          <Ionicons name="trash-bin" size={40} color={tokens.colors.white} />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable friction={2} rightThreshold={40} renderRightActions={RightAction}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="select place"
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
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    marginVertical: 6,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
  },
  pressed: {
    opacity: tokens.opacity.pressed,
  },
  image: {
    flex: 1,
    borderRadius: tokens.borderRadius.sm,
    marginRight: tokens.spacing.md,
    aspectRatio: 3 / 2,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  info: {
    flex: 2,
    padding: tokens.spacing.md,
    gap: 6,
  },
  title: {
    ...tokens.typography.subtitle,
  },
  address: {
    ...tokens.typography.caption,
    opacity: tokens.opacity.textSecondary,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    backgroundColor: tokens.colors.destructive,
    borderRadius: tokens.borderRadius.md,
  },
});
