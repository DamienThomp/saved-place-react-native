import { useTheme } from '@react-navigation/native';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type LoadingParams = {
  title?: string;
};

export default function Loading({ title }: LoadingParams) {
  const theme = useTheme();
  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <ActivityIndicator />
      {title && <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 12 },
  title: {
    fontSize: 22,
    textAlign: 'center',
    padding: 8,
  },
});
