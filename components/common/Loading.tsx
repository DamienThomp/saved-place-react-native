import { useTheme } from 'expo-router/react-navigation';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { tokens } from '~/constants/theme';

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
  container: { flex: 1, justifyContent: 'center', gap: tokens.spacing.md },
  title: {
    ...tokens.typography.subtitle,
    textAlign: 'center',
    padding: tokens.spacing.sm,
  },
});
