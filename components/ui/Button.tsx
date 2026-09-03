import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from 'expo-router/react-navigation';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

import { tokens } from '~/constants/theme';

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
        {
          backgroundColor: theme.colors.primary,
          opacity: state.pressed ? tokens.opacity.pressed : 1,
        },
        typeof props.style === 'function' ? props.style(state) : props.style,
      ]}>
      {title && <Text style={styles.buttonText}>{title}</Text>}
      {icon && (
        <FontAwesome5
          name={icon}
          color={color ?? tokens.colors.white}
          size={size ?? tokens.typography.button.fontSize}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: tokens.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
    gap: tokens.spacing.sm,
    ...tokens.shadows.button,
  },
  buttonText: {
    color: tokens.colors.white,
    ...tokens.typography.button,
    textAlign: 'center',
  },
});
