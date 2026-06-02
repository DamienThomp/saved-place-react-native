import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from 'expo-router/react-navigation';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

type ButtonProps = {
  title?: string;
  icon?: keyof typeof FontAwesome5.glyphMap;
  color?: string;
  size?: number;
  ref?: React.Ref<View>;
} & PressableProps;

export function Button({ title, icon, color, size, ref, ...props }: ButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      ref={ref}
      {...props}
      style={(state) => [
        styles.button,
        { backgroundColor: theme.colors.primary, opacity: state.pressed ? 0.8 : 1 },
        typeof props.style === 'function' ? props.style(state) : props.style,
      ]}>
      {title && <Text style={styles.buttonText}>{title}</Text>}
      {icon && <FontAwesome5 name={icon} color={color ?? 'white'} size={size ?? 16} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
