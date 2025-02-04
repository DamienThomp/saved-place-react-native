import { PropsWithChildren } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

export const Container = ({ children }: PropsWithChildren) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
