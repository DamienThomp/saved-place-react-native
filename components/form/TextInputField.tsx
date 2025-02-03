import { TextInput, StyleSheet } from 'react-native';

type TextInputFieldProps = {
  value: string;
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
  return (
    <TextInput
      value={value}
      style={styles.textInput}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 20,
  },
});
