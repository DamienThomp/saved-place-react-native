import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress: () => void;
};

export default function IconButton({ icon, size, color, onPress }: IconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
