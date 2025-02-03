import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ContentUnavailableProps {
  color?: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function ContentUnavailable({
  children,
  color,
  icon,
}: PropsWithChildren<ContentUnavailableProps>) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={color} />
      <Text style={[styles.text, { color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginTop: 16,
  },
});
