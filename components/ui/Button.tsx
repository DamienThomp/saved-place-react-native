import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from '@react-navigation/native';
import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title?: string;
  icon?: keyof typeof FontAwesome5.glyphMap;
  color?: string;
  size?: number;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, icon, color, size, ...props }, ref) => {
    const theme = useTheme();
    return (
      <TouchableOpacity ref={ref} {...props} style={[styles.button, props.style]}>
        <Text style={styles.buttonText}>{title}</Text>
        {icon && (
          <FontAwesome5 name={icon} color={color ?? theme.colors.primary} size={size ?? 16} />
        )}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#6366F1',
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
