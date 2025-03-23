import { PropsWithChildren } from 'react';
import { StyleSheet, SafeAreaView, ViewStyle } from 'react-native';

type ContainerProps = {
  style?: ViewStyle;
};

export const Container = ({ children, style }: PropsWithChildren<ContainerProps>) => {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
