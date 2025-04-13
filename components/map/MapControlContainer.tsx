import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MapControlContainer({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    backgroundColor: 'rgba(36, 36, 36, 0.8)',
    borderRadius: 6,
  },
});
