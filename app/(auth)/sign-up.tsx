import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';

import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';
import FormInputContainer from '~/components/form/FormInputContainer';
import TextInputField from '~/components/form/TextInputField';
import { Button } from '~/components/ui/Button';
import { dbClient } from '~/lib/db';

export default function SignUpScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setIsLoading] = useState(false);

  const onEmailUpdate = (text: string) => {
    setEmail(text);
  };

  const onPasswordUpdate = (text: string) => {
    setPassword(text);
  };

  const onSignUp = async () => {
    setIsLoading(true);

    const { error } = await dbClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error in Sign Up', `${error.message}`);
    }

    setIsLoading(false);
  };

  const redirectToSignIn = () => {
    router.back();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
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
          <Button title="Sign Up" onPress={onSignUp} disabled={loading} />
          <Text
            onPress={redirectToSignIn}
            style={[styles.secondaryAction, { color: theme.colors.primary }]}>
            Sign In
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Container>
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
