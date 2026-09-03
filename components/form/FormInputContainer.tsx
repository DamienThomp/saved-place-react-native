import { useTheme } from 'expo-router/react-navigation';
import { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

import { tokens } from '~/constants/theme';

type FormInputContainerProps = {
  title: string;
  style?: ViewStyle;
};

export default function FormInputContainer({
  children,
  title,
  style,
}: PropsWithChildren<FormInputContainerProps>) {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: tokens.spacing.sm },
  label: { ...tokens.typography.label },
});
