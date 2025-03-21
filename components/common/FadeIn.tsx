import { PropsWithChildren, useEffect } from 'react';
import { Animated, useAnimatedValue } from 'react-native';

export default function FadeIn({ children }: PropsWithChildren) {
  const fadeAnim = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
      }}>
      {children}
    </Animated.View>
  );
}
