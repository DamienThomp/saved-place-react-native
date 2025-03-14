import { ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function Loading() {
  return (
    <Animated.View
      style={{ flex: 1, justifyContent: 'center' }}
      entering={FadeIn}
      exiting={FadeOut}>
      <ActivityIndicator />
    </Animated.View>
  );
}
