import { useTheme } from '@react-navigation/native';
import { TextInput, StyleSheet } from 'react-native';

type TextInputFieldProps = {
  value?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'visible-password';
};

export default function TextInputField({
  value,
  placeholder,
  secureTextEntry,
  keyboardType,
  onChangeText,
}: TextInputFieldProps) {
  const theme = useTheme();
  return (
    <TextInput
      value={value}
      style={[
        styles.textInput,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 20,
  },
});
