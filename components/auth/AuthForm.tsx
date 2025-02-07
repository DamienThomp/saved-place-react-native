import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Text, View, StyleSheet, Alert } from 'react-native';

import FormInputContainer from '../form/FormInputContainer';
import TextInputField from '../form/TextInputField';

import { Button } from '~/components/ui/Button';

type AuthFormProps = {
  actionLabel: string;
  primaryAction: (email: string, password: string) => void;
  secondaryLabel: string;
  secondaryAction: () => void;
};

export default function AuthForm({
  actionLabel,
  primaryAction,
  secondaryLabel,
  secondaryAction,
}: AuthFormProps) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  const validateForm = (): boolean => {
    setErrors('');

    if (email.length === 0) {
      setErrors('Email is Required');
      return false;
    }

    if (password.length === 0) {
      setErrors('Password is Required');
      return false;
    }

    return true;
  };

  const onEmailUpdate = (text: string) => {
    setEmail(text);
  };

  const onPasswordUpdate = (text: string) => {
    setPassword(text);
  };

  const onSubmit = () => {
    if (!validateForm()) return;

    primaryAction(email, password);
  };

  useEffect(() => {
    if (errors) {
      Alert.alert('Error', errors);
    }
  }, [errors]);

  return (
    <KeyboardAvoidingView style={styles.content} behavior="padding" enabled>
      <FormInputContainer title="Email">
        <TextInputField
          value={email}
          onChangeText={onEmailUpdate}
          placeholder="email@something.com"
          keyboardType="email-address"
        />
      </FormInputContainer>
      <FormInputContainer title="Password">
        <TextInputField value={password} onChangeText={onPasswordUpdate} secureTextEntry />
      </FormInputContainer>
      <View>
        <Button title={actionLabel} onPress={onSubmit} />
        <Text
          onPress={secondaryAction}
          style={[styles.secondaryAction, { color: theme.colors.primary }]}>
          {secondaryLabel}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    gap: 18,
  },
  secondaryAction: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 8,
  },
});
