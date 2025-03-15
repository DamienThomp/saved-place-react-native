import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import RemoteImage from '../common/RemoteImage';

import { Tables } from '~/types/database.types';

type Place = Tables<'places'>;
interface PlaceItemProps {
  item: Place;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PlaceListItem({ item, onSelect, onDelete }: PlaceItemProps) {
  const { width: screenWidth } = useWindowDimensions();
  const iconThreshold = -screenWidth * 0.3;
  const deleteItemThreshold = -screenWidth * 0.6;
  const theme = useTheme();
  const position = useSharedValue(0);

  const tapGesture = Gesture.Tap()
    .onTouchesUp(() => {
      onSelect(item.id);
    })
    .runOnJS(true);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      position.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < deleteItemThreshold) {
        position.value = withTiming(
          -screenWidth,
          {
            duration: 100,
            easing: Easing.ease,
            reduceMotion: ReduceMotion.System,
          },
          (isFinished) => {
            if (isFinished) {
              runOnJS(onDelete)(item.id);
            }
          }
        );
      } else {
        position.value = withSpring(0);
      }
    })
    .onTouchesUp(() => true);

  const containerGestures = Gesture.Exclusive(panGesture, tapGesture);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(position.value < iconThreshold ? 1 : 0);
    return { opacity };
  });

  return (
    <GestureDetector gesture={containerGestures}>
      <View>
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <Ionicons name="trash-bin" size={40} color="red" />
        </Animated.View>

        <Animated.View style={animatedContainerStyle}>
          {/*TODO: Refactor and remove Pressable component */}
          <Pressable
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
        </Animated.View>
      </View>
    </GestureDetector>
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
    padding: 24,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 12,
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    flex: 2,
    padding: 12,
    gap: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  address: {
    fontSize: 12,
    opacity: 0.7,
  },
  iconContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '10%',
  },
});
