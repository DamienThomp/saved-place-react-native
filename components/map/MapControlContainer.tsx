import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { tokens } from '~/constants/theme';

export default function MapControlContainer({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.xs,
    backgroundColor: tokens.colors.overlay.darkGlass,
    borderRadius: tokens.borderRadius.sm,
  },
});
