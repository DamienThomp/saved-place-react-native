import { useTheme } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type FormInputContainerProps = {
  title: string;
};

export default function FormInputContainer({
  children,
  title,
}: PropsWithChildren<FormInputContainerProps>) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { color: '#4a4a4a', fontWeight: '500', fontSize: 18 },
});
